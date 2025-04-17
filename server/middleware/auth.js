// server/middleware/auth.js
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Admin = require("../models/Admin");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    // Remove the "Bearer " prefix and trim any extra whitespace
    token = req.headers.authorization.slice(7).trim();
  }
  
  console.log("Type of extracted token:", typeof token);
  console.log("Extracted token:", token);

  if (!token || typeof token !== "string") {
    res.status(401);
    throw new Error("Not authorized, no valid token provided");
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user =
      (await User.findById(decoded.id).select("-password")) ||
      (await Admin.findById(decoded.id).select("-password"));
      
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }
    
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    res.status(401);
    throw new Error("Not authorized, token failed: " + error.message);
  }
});

module.exports = { protect };
