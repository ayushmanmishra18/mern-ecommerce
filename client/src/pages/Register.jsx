// src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false); // Track if OTP has been sent
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/auth/register', { name, email, password });
      toast.success('Verification email sent. Please check your inbox.');
      setIsOtpSent(true); // Set OTP sent to true
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      await axios.post('/api/auth/verifyOTP', { email, otp });
      toast.success('Registration successful!');
      navigate('/login');
    } catch (err) {
      toast.error('Invalid OTP');
      setError(err.response?.data?.message || 'OTP verification failed.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form className="bg-gray-800 p-6 rounded-lg w-96" onSubmit={isOtpSent ? handleOtp : handleSubmit}>
        <h2 className="text-2xl mb-4">Register</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {!isOtpSent ? (
          <>
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
              Send Verification Email
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="OTP"
              className="w-full p-2 mb-4 bg-gray-700 rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600">
              Verify OTP
            </button>
          </>
        )}
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-400 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;