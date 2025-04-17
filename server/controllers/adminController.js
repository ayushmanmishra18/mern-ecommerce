// server/controllers/adminController.js
const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const Order = require("../models/Orders");
const User = require("../models/User");

/**
 * @desc    Create admin (fallback route; registration should go through /api/auth/admin/register)
 * @route   POST /api/admin/first-admin
 * @access  Protected (admin)
 */
const createAdmin = asyncHandler(async (req, res) => {
  res.status(400).json({ message: "Use /api/auth/admin/register for admin registration" });
});

/**
 * @desc    Get admin dashboard data (counts)
 * @route   GET /api/admin/dashboard
 * @access  Protected (admin)
 */
const getDashboard = asyncHandler(async (req, res) => {
  const productCount = await Product.countDocuments({});
  const orderCount = await Order.countDocuments({});
  const userCount = await User.countDocuments({});
  res.json({ productCount, orderCount, userCount });
});

module.exports = { createAdmin, getDashboard };
