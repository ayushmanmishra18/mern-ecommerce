// server/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { createAdmin, getDashboard } = require("../controllers/adminController");
const { adminProtect } = require("../middleware/adminAuth");

// Fallback route for first-admin creation (if needed)
router.post("/first-admin", createAdmin);

// Admin dashboard route (protected)
router.get("/dashboard", adminProtect, getDashboard);

module.exports = router;
