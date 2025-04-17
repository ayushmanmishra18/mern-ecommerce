// server/routes/products.js
const express = require("express");
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect } = require("../middleware/auth");
const { adminProtect } = require("../middleware/adminAuth");

// Public route to get products
router.get("/", getProducts);

// Admin-only routes for creating/updating products
router.post("/", adminProtect, createProduct);
router.put("/:id", adminProtect, updateProduct);

// Deletion: protected for both admins and users; deletion logic inside controller
router.delete("/:id", protect, deleteProduct);

module.exports = router;
