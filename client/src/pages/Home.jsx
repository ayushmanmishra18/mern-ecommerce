import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-5xl font-bold mb-4">Welcome to GreenCart</h1>
      <p className="text-lg mb-8 text-center max-w-xl">
        Explore the latest products and enjoy seamless shopping. Experience a modern, secure, and intuitive e-commerce platform.
      </p>
      <div className="flex space-x-4">
        <Link to="/products" className="bg-blue-500 px-6 py-3 rounded-lg text-lg hover:bg-blue-600">
          Shop Now
        </Link>
        <Link to="/login" className="bg-gray-700 px-6 py-3 rounded-lg text-lg hover:bg-gray-600">
          Login / Register
        </Link>
      </div>
      <div className="mt-12">
        <p className="text-gray-400">Fast delivery • Secure checkout • 24/7 support</p>
      </div>
    </div>
  );
};

export default Home;
