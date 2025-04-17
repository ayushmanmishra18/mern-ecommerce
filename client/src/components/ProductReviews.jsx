// src/components/ProductReviews.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import API from "../utils/axiosInstance";
import { toast } from "react-toastify";

const ProductReviews = ({ product, refreshProduct }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { user } = useSelector((state) => state.auth);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/products/${product._id}/reviews`, { rating: Number(rating), comment });
      toast.success("Review added successfully");
      refreshProduct();
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add review");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      {product.reviews && product.reviews.length > 0 ? (
        product.reviews.map((review) => (
          <div key={review._id} className="border-b border-gray-700 py-2">
            <p className="font-semibold">{review.name}</p>
            <p>Rating: {review.rating}/5</p>
            <p>{review.comment}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet</p>
      )}
      {user && (
        <form onSubmit={submitReview} className="mt-4">
          <h3 className="text-xl font-bold">Add a Review</h3>
          <div>
            <label className="block">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mt-2">
            <label className="block">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>
          <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductReviews;
