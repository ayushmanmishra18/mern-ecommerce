// src/pages/AdminSignup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/auth/admin/register', { name, email, password });
      toast.success('Admin registered successfully!');
      navigate('/admin/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin registration failed.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form className="bg-gray-800 p-6 rounded-lg w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">Admin Sign Up</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 mb-2 bg-gray-700 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 bg-gray-700 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          className="w-full p-2 mb-4 bg-gray-700 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="mb-4 text-sm text-gray-400"
        >
          {showPassword ? 'Hide Password' : 'Show Password'}
        </button>
        <button type="submit" className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600">
          Sign Up as Admin
        </button>
        <div className="mt-4 text-center">
          <Link to="/admin/login" className="text-green-400 hover:underline">
            Already have an admin account? Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminSignup;
