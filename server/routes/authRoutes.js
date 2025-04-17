// server/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  registerAdmin,
  authUser,
  getUserProfile,
  updatePassword,
  logoutUser,
  verifyOTP,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/verifyOTP", verifyOTP);               // User registration
router.post("/admin/register", registerAdmin);        // Admin registration
router.post("/login", authUser);                      // Login for both users and admins
router.get("/profile", protect, getUserProfile);
router.put("/update-password", protect, updatePassword);
router.post("/logout", protect, logoutUser);

module.exports = router;
