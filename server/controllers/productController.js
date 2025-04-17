// server/controllers/productController.js
const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

// GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const filter = {};
  // If query parameter createdBy is present, filter products by creator
  if (req.query.createdBy) {
    filter.createdBy = req.query.createdBy;
  }
  const products = await Product.find(filter).lean();
  res.status(200).json(products);
});

// GET /api/products/:id
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, stock } = req.body;
  if (!name || !price) {
    res.status(400);
    throw new Error("Product name and price are required");
  }
  const product = new Product({
    name,
    price,
    description,
    image: image || "https://via.placeholder.com/150",
    category,
    stock,
    createdBy: req.user._id,
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, stock } = req.body;
  let product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Allow update if admin or if the creator matches the logged-in user
  if (!req.user.isAdmin && product.createdBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this product");
  }
  product.name = name || product.name;
  product.price = price || product.price;
  product.description = description || product.description;
  product.image = image || product.image;
  product.category = category || product.category;
  product.stock = stock || product.stock;
  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Only allow deletion if admin or if the product was created by the logged-in user
  if (!req.user.isAdmin && product.createdBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this product");
  }
  await product.deleteOne();
  res.json({ message: "Product removed" });
});
