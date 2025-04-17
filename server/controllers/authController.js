// server/controllers/authController.js
const User = require("../models/User");
const Admin = require("../models/Admin");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const nodemailer = require("nodemailer");

// Generate a verification token (JWT with a short expiry, e.g., 1 hour)
const generateVerificationToken = (payload, expiresIn = "1h") =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

/**
 * @desc    Register new user (without email verification for simplicity)
 * @route   POST /api/auth/register
 * @access  Public
 */


// Register User
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  const adminExists = await Admin.findOne({ email });
  if (userExists || adminExists) {
    res.status(400);
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: false,
  });

  const otp = await exports.generateOTP(email);

  if (user) {
    res.status(201).json({
      message: "User registered successfully. OTP sent to email.",
      otpSent: true, // useful for frontend
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


// Generate and Send OTP
exports.generateOTP = asyncHandler(async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiration = new Date(Date.now() + 15 * 60 * 1000);

  const result = await User.findOneAndUpdate(
    { email },
    { otp, otpExpiration },
    { new: true }
  );

  if (!result) {
    throw new Error("Failed to update OTP for user");
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP Code',
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Your OTP Code</h2>
        <p>Please use the following OTP to verify your email:</p>
        <h3>${otp}</h3>
        <p>This OTP will expire in 15 minutes.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP Email sent:", info.response);
    console.log("Generated OTP for", email, "is", otp);
  } catch (err) {
    console.error("Email sending failed:", err.message);
    throw new Error("Failed to send OTP");
  }

  return otp;
});

// Verify OTP
exports.verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  console.log("Stored OTP:", user.otp);
  console.log("Entered OTP:", otp);
  console.log("Expires At:", user.otpExpiration);
  console.log("Now:", new Date());

  if (
    user.otp === otp &&
    user.otpExpiration &&
    user.otpExpiration > new Date()
  ) {
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (with HTTPS)
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "OTP verified successfully",
      token
    });
  } else {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }
});

/**
 * @desc    Register new admin (without email verification)
 * @route   POST /api/auth/admin/register
 * @access  Public
 */
exports.registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const adminExists = await Admin.findOne({ email });
  const userExists = await User.findOne({ email });
  if (adminExists || userExists) {
    res.status(400);
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword,
    isVerified: true,
  });

  if (admin) {
    const token = generateToken(admin._id, "admin");
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (with HTTPS)
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
});

/**
 * @desc    Login for users and admins (email & password only)
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      res.status(401);
      throw new Error("Please verify your email before logging in");
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  }

  let admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    return res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      isAdmin: true,
      token: generateToken(admin._id, "admin"),
    });
  }

  res.status(401);
  throw new Error("Invalid email or password");
});


/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Protected
 */
const getUserProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
exports.getUserProfile = getUserProfile;

/**
 * @desc    Update password
 * @route   PUT /api/auth/update-password
 * @access  Protected
 */
// In server/controllers/authController.js, update the updatePassword function:
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  // Check which model to query based on the isAdmin flag
  let user;
  if (req.user.isAdmin) {
    user = await require("../models/Admin").findById(req.user._id);
  } else {
    user = await require("../models/User").findById(req.user._id);
  }

  if (user && (await user.matchPassword(currentPassword))) {
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } else {
    res.status(400);
    throw new Error("Current password is incorrect");
  }
});
exports.updatePassword = updatePassword;

/**
 * @desc    Logout user (JWT is stateless; instruct client to remove token)
 * @route   POST /api/auth/logout
 * @access  Protected
 */
const logoutUser = asyncHandler(async (req, res) => {
  res.json({ message: "Logged out successfully" });
});
exports.logoutUser = logoutUser;
