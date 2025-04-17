// src/pages/Profile.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "/api/auth/update-password",
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-400 mb-4">Profile</h1>
      {user ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <p className="text-lg">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="text-lg">
              <strong>Email:</strong> {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded mb-6"
          >
            Logout
          </button>

          {/* Update Password Section */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Update Password</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-sm">
              <div>
                <label className="block mb-1 text-sm">Current Password</label>
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full p-2 rounded bg-gray-600 text-white text-sm"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">New Password</label>
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full p-2 rounded bg-gray-600 text-white text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={updating}
                className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600 text-sm"
              >
                {updating ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default Profile;
