const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');

// Get user's cart
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, products: [] });
  }
  const items = cart.products.map(item => ({
    product: item.productId,
    quantity: item.quantity,
  }));
  const total = cart.products.reduce((acc, item) => {
    if (item.productId && item.productId.price) {
      return acc + (item.productId.price * item.quantity);
    }
    return acc;
  }, 0);
  res.json({ items, total });
});

// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  // Validate productId and quantity
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error('Invalid product id');
  }
  if (!quantity || quantity <= 0) {
    res.status(400);
    throw new Error('Quantity must be greater than zero');
  }

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, products: [] });
  }
  // Find if product already exists in cart
  const index = cart.products.findIndex(item => item.productId.toString() === productId);
  if (index > -1) {
    cart.products[index].quantity += quantity;
  } else {
    cart.products.push({ productId, quantity });
  }
  await cart.save();

  // Re-populate cart for response
  cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
  const items = cart.products.map(item => ({
    product: item.productId,
    quantity: item.quantity,
  }));
  const total = cart.products.reduce((acc, item) => {
    if (item.productId && item.productId.price) {
      return acc + (item.productId.price * item.quantity);
    }
    return acc;
  }, 0);
  res.json({ items, total });
});

// Remove or decrement item from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Validate productId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    res.status(400);
    throw new Error('Invalid product id');
  }

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  const itemIndex = cart.products.findIndex(item => item.productId.toString() === productId);
  if (itemIndex > -1) {
    if (cart.products[itemIndex].quantity > 1) {
      cart.products[itemIndex].quantity--;
    } else {
      cart.products.splice(itemIndex, 1);
    }
    await cart.save();
  } else {
    // Optionally, send a not found message for the product
    res.status(404);
    throw new Error('Product not found in cart');
  }
  // Re-populate cart for response
  cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
  const items = cart.products.map(item => ({
    product: item.productId,
    quantity: item.quantity,
  }));
  const total = cart.products.reduce((acc, item) => {
    if (item.productId && item.productId.price) {
      return acc + (item.productId.price * item.quantity);
    }
    return acc;
  }, 0);
  res.json({ items, total });
});

module.exports = { getCart, addToCart, removeFromCart };
