// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Fetches the dashboard data from the server and updates the component state.
   * If a server error occurs, redirects the user to the admin login page.
   * If the request was successful, sets the loading state to false.

/*******  24cdb3eb-50fc-4cc7-aa46-1749e36bf6ea  *******/
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/api/admin/dashboard");
        setDashboardData(res.data);
      } catch (error) {
        toast.error("Failed to load dashboard data");
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [navigate]);

  if (loading) return <div className="text-center text-white">Loading dashboard...</div>;
  if (!dashboardData) return <div className="text-center text-white">No dashboard data available.</div>;

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-2xl font-bold">Total Products</h2>
          <p className="text-xl">{dashboardData.productCount}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-2xl font-bold">Total Orders</h2>
          <p className="text-xl">{dashboardData.orderCount}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-2xl font-bold">Total Users</h2>
          <p className="text-xl">{dashboardData.userCount}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
