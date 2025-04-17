// src/pages/Cart.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, clearCart, setCart } from '../redux/cartSlice';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // If needed, fetch the cart from the backend on component mount.
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('/api/cart', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        // Expecting res.data to be in the shape: { items, total }
        dispatch(setCart(res.data));
      } catch (error) {
        toast.error('Failed to load cart.');
      }
    };

    if (user) {
      fetchCart();
    }
  }, [user, dispatch]);

  // Now include items even if product details are missing
  const validItems = items; // removed filtering on product existence

  const handleIncrement = async (item) => {
    const productId = item.product?._id || item.productId;
    try {
      const res = await axios.post(
        '/api/cart',
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      dispatch(setCart(res.data)); // update state with the latest cart from backend
    } catch (error) {
      toast.error('Failed to update cart.');
    }
  };
  

  const handleDecrement = (item) => {
    const productId = item.product?._id || item.productId;
    dispatch(removeItem(productId));
  };

  const handleCheckout = async () => {
    try {
      await axios.post(
        '/api/orders',
        {
          orderItems: validItems.map((item) => ({
            // Use fallback values if product details are missing
            name: item.product ? item.product.name : `Product (${item.productId})`,
            qty: item.quantity,
            price: item.product ? item.product.price : 0,
          })),
          totalPrice: total,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      toast.success('Order placed successfully!');
      dispatch(clearCart());
      navigate('/order-history');
    } catch (error) {
      toast.error('Order failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-4xl font-bold text-green-400 mb-8 text-center">Your Cart</h1>
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <AnimatePresence>
          {validItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-400"
            >
              Your cart is empty 😔
            </motion.div>
          ) : (
            validItems.map((item) => (
              <motion.div
                key={item.product?._id || item.productId}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-700 mb-4"
              >
                <div className="flex items-center space-x-4">
                  {item.product && item.product.image ? (
                    <img
                      src={item.product.image.startsWith("http") ? item.product.image : item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-700 rounded text-gray-400">
                      No Image
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {item.product ? item.product.name : `Product (${item.productId})`}
                    </h2>
                    <p className="text-gray-400">
                      ${item.product ? item.product.price.toFixed(2) : "0.00"} x {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => handleDecrement(item)}
                    className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-white"
                  >
                    –
                  </button>
                  <span className="text-white font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(item)}
                    className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-white"
                  >
                    +
                  </button>
                  <button
                    onClick={() => dispatch(removeItem(item.product?._id || item.productId))}
                    className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-white"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        {validItems.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-right">
            <div className="text-2xl text-blue-400 mb-4">Total: ${total.toFixed(2)}</div>
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
              <button
                onClick={handleCheckout}
                className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-400 transition-colors text-lg font-semibold"
              >
                Proceed to Payment
              </button>
              <button
                onClick={() => dispatch(clearCart())}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-400 transition-colors text-lg font-semibold"
              >
                Clear Cart
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cart;
