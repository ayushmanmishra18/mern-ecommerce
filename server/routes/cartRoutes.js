// server/routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.delete("/:productId", protect, removeFromCart);

module.exports = router;
