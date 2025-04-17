// src/pages/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import API from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AdminProducts = () => {
  const { user } = useSelector((state) => state.auth);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productData, setProductData] = useState({
    name: "",
    price: 0,
    description: "",
    image: "",
    category: "",
    stock: 100,
  });

  // Fetch products created by the logged-in admin using query parameter
  const fetchMyProducts = async () => {
    try {
      const response = await API.get(`/api/products?createdBy=${user._id}`);
      setMyProducts(response.data);
    } catch (error) {
      console.error("Error fetching my products:", error);
      toast.error("Failed to fetch product history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchMyProducts();
    }
  }, [user]);

  // Setup product editing
  const handleEdit = (product) => {
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

  // Update product handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/products/${editingProduct._id}`, productData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Product updated successfully");
      setEditingProduct(null);
      fetchMyProducts();
      setProductData({ name: "", price: 0, description: "", image: "", category: "", stock: 100 });
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update product");
    }
  };

  // Delete product handler – only allow if the logged-in admin is authorized (the backend checks this)
  const handleDelete = async (productId) => {
    try {
      await API.delete(`/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Product deleted successfully");
      fetchMyProducts();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  // File upload: use API to upload image and set URL in productData
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await API.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        });
        setProductData({ ...productData, image: res.data.imageUrl });
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Image upload failed");
      }
    }
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-green-400 mb-8 text-center">My Product History</h1>
      
      {editingProduct && (
        <div className="bg-gray-800 p-6 rounded-lg mb-8 shadow-xl max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Edit Product</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              placeholder="Product Name"
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              className="w-full p-3 rounded bg-gray-700 text-white"
              required
            />
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Price"
                value={productData.price}
                onChange={(e) => setProductData({ ...productData, price: Number(e.target.value) })}
                className="w-1/2 p-3 rounded bg-gray-700 text-white"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={productData.stock}
                onChange={(e) => setProductData({ ...productData, stock: Number(e.target.value) })}
                className="w-1/2 p-3 rounded bg-gray-700 text-white"
                required
              />
            </div>
            <textarea
              placeholder="Description"
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              className="w-full p-3 rounded bg-gray-700 text-white"
              required
            />
            <div>
              <label className="block mb-1">Image URL</label>
              <input
                type="text"
                placeholder="Enter image URL (or use file upload below)"
                value={productData.image}
                onChange={(e) => setProductData({ ...productData, image: e.target.value })}
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
            <input
              type="text"
              placeholder="Category"
              value={productData.category}
              onChange={(e) => setProductData({ ...productData, category: e.target.value })}
              className="w-full p-3 rounded bg-gray-700 text-white"
              required
            />
            <div className="flex gap-4 justify-center">
              <button type="submit" className="bg-green-500 text-white px-8 py-3 rounded hover:bg-green-600">
                Update Product
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setProductData({ name: "", price: 0, description: "", image: "", category: "", stock: 100 });
                }}
                className="bg-gray-500 text-white px-8 py-3 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        {myProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProducts.map((product) => (
              <div key={product._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-2" />
                <p className="font-semibold text-white">{product.name}</p>
                <p className="text-gray-300">${product.price.toFixed(2)}</p>
                <p className="text-gray-300">Stock: {product.stock}</p>
                {product.createdBy && (
                  <p className="text-gray-300">Added by: {product.createdBy.name}</p>
                )}
                <div className="flex justify-between mt-2">
                  <button onClick={() => handleEdit(product)} className="bg-yellow-500 px-4 py-2 rounded text-white hover:bg-yellow-400">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-400">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No products found in your history.</p>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
