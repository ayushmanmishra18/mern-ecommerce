// src/pages/OrderHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/orders/myorders");
        setOrders(data);
      } catch (error) {
        toast.error("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center text-white">Loading orders...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-green-400 mb-8">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-center text-gray-400">No orders found.</p>
      ) : (
        <motion.div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 p-6 rounded-lg"
            >
              <div className="flex justify-between items-center mb-4 text-white">
                <div>
                  <h2 className="text-xl font-bold">Order #{order._id}</h2>
                  <p className="text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={`/order/${order._id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition-colors"
                >
                  View Details
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-300">
                <div>
                  <p>Total: ${order.totalPrice.toFixed(2)}</p>
                  <p>Status: {order.isPaid ? "Paid" : "Pending"}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default OrderHistory;
