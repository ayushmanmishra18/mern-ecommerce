import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../redux/productSlice';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (productId) => {
    dispatch(deleteProduct(productId));
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      {items.map((product) => (
        <div key={product._id} className="flex justify-between items-center py-2 border-b border-gray-700">
          <span className="text-white">{product.name}</span>
          <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-3 py-1 rounded">
            Delete
          </button>
        </div>
      ))}
    </div> 
  );
};

export default ProductsPage;
