// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/cartSlice";

// Get backend URL from environment variables
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Admin CRUD state
  const [editingProduct, setEditingProduct] = useState(null);
  const [productData, setProductData] = useState({
    name: "",
    price: 0,
    description: "",
    image: "", // Can be an external URL or set via file upload (relative URL)
    category: "",
    stock: 100,
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        toast.error("Failed to fetch products. Please try again later.");
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Regular user: Add to cart
  const handleAddToCart = (product) => {
    if (user) {
      dispatch(addItem({ productId: product._id, quantity: 1 }));
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error("Please login to add items to cart.");
    }
  };

  // Admin: Create product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const finalProductData = {
      ...productData,
      image: productData.image || "https://via.placeholder.com/150",
    };
    try {
      const res = await axios.post("/api/products", finalProductData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts((prev) => [...prev, res.data]);
      toast.success("Product added successfully");
      setProductData({ name: "", price: 0, description: "", image: "", category: "", stock: 100 });
    } catch (err) {
      toast.error("Failed to add product");
    }
  };

  // Admin: Update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const finalProductData = {
      ...productData,
      image: productData.image || "https://via.placeholder.com/150",
    };
    try {
      const res = await axios.put(`/api/products/${editingProduct._id}`, finalProductData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts(products.map(p => p._id === res.data._id ? res.data : p));
      toast.success("Product updated successfully");
      setEditingProduct(null);
      setProductData({ name: "", price: 0, description: "", image: "", category: "", stock: 100 });
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  // Admin: Delete product
  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts(products.filter(p => p._id !== productId));
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  // File upload handling
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // Set the image URL from the upload response
        setProductData({ ...productData, image: res.data.imageUrl });
        toast.success("Image uploaded successfully");
      } catch (error) {
        toast.error("Image upload failed");
      }
    }
  };

  // Admin: Setup product editing
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductData({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      category: product.category,
      stock: product.stock || 100,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 min-h-screen"
    >
      {/* Search & Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-64 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full md:w-48 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="books">Books</option>
        </select>
      </div>

      {/* Admin CRUD Form */}
      {user && user.isAdmin && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <form
            onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1">Product Name</label>
              <input
                type="text"
                placeholder="Product Name"
                value={productData.name}
                onChange={(e) =>
                  setProductData({ ...productData, name: e.target.value })
                }
                className="w-full p-3 rounded bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Price</label>
              <input
                type="number"
                placeholder="Price"
                value={productData.price}
                onChange={(e) =>
                  setProductData({ ...productData, price: Number(e.target.value) })
                }
                className="w-full p-3 rounded bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Description</label>
              <textarea
                placeholder="Description"
                value={productData.description}
                onChange={(e) =>
                  setProductData({ ...productData, description: e.target.value })
                }
                className="w-full p-3 rounded bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Image URL</label>
              <input
                type="text"
                placeholder="Enter image URL (or use file upload below)"
                value={productData.image}
                onChange={(e) =>
                  setProductData({ ...productData, image: e.target.value })
                }
                className="w-full p-3 rounded bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 rounded bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block mb-1">Category</label>
              <input
                type="text"
                placeholder="Category"
                value={productData.category}
                onChange={(e) =>
                  setProductData({ ...productData, category: e.target.value })
                }
                className="w-full p-3 rounded bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Stock</label>
              <input
                type="number"
                placeholder="Stock"
                value={productData.stock}
                onChange={(e) =>
                  setProductData({ ...productData, stock: Number(e.target.value) })
                }
                className="w-full p-3 rounded bg-gray-700 text-white"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setProductData({
                      name: "",
                      price: 0,
                      description: "",
                      image: "",
                      category: "",
                      stock: 100,
                    });
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Product List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {user && user.isAdmin ? "Manage Products" : "Products"}
        </h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              // Determine the final image URL:
              const imageSrc = product.image.startsWith("http")
                ? product.image
                : `${backendUrl}${product.image}`;
              return (
                <div key={product._id} className="bg-gray-800 p-4 rounded-lg">
                  <img
                    src={imageSrc}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-400 mb-2">${product.price.toFixed(2)}</p>
                  {user && user.isAdmin ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="bg-yellow-500 px-3 py-1 rounded text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="bg-red-500 px-3 py-1 rounded text-white"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            No products found matching your criteria 😞
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Products;
