import React from 'react';

const ProductCard = ({ product, onAddToCart, isAdmin }) => {
  const handleAdd = () => {
    if (onAddToCart) onAddToCart(product);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
      <p className="text-gray-400 mb-4">${product.price.toFixed(2)}</p>
      
      {!isAdmin ? (
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add to Cart
        </button>
      ) : (
        <div className="flex gap-2">
          <button className="bg-yellow-500 px-3 py-1 rounded">Edit</button>
          <button className="bg-red-500 px-3 py-1 rounded">Delete</button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
