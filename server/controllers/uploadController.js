// server/controllers/uploadController.js
const asyncHandler = require("express-async-handler");

const uploadFile = asyncHandler(async (req, res) => {
  console.log("Upload endpoint triggered.");
  if (!req.file) {
    console.error("No file received. req.file:", req.file);
    res.status(400);
    throw new Error("No file uploaded");
  }
  console.log("File details:", req.file);
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = { uploadFile };
