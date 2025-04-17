import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, isAdmin, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product._id} 
          product={product} 
          isAdmin={isAdmin}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductList;
