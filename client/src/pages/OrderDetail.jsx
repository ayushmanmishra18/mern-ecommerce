// src/pages/OrderDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (error) {
        toast.error("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center text-white">Loading order details...</div>;
  if (!order) return <div className="text-center text-white">Order not found.</div>;

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Order Details</h1>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>

      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-2">Order Items</h2>
        {order.orderItems && order.orderItems.length > 0 ? (
          <ul className="list-disc ml-6">
            {order.orderItems.map((item, index) => (
              <li key={index} className="mb-1">
                {item.name} - {item.qty} x ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No items found in this order.</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
