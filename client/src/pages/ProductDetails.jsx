// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        toast.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-12 text-white">Loading product details...</div>;
  if (!product) return <div className="text-center py-12 text-white">Product not found.</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <img src={product.image} alt={product.name} className="w-full h-96 object-contain rounded-lg" />
          </div>
        </div>
        <div className="space-y-6 text-white">
          <h1 className="text-4xl font-bold text-green-400">{product.name}</h1>
          <p className="text-gray-300 text-lg">{product.description}</p>
          <div className="text-3xl font-bold text-blue-400">${product.price.toFixed(2)}</div>
          {/* You can add an "Add to Cart" button here if you want */}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
