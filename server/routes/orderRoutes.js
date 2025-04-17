// server/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getOrderById } = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

// Create order
router.post("/", protect, createOrder);
// Get orders for logged-in user
router.get("/myorders", protect, getMyOrders);
// Get single order detail
router.get("/:id", protect, getOrderById);

module.exports = router;
