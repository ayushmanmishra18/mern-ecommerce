// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef();

  // Calculate total quantity
  const totalQuantity = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-900 p-4 shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold text-green-400 hover:text-green-300 transition duration-300">
          GreenCart
        </Link>
        <div className="flex items-center space-x-8">
          <Link to="/products" className="text-gray-300 hover:text-green-300 transition duration-300 text-lg">
            Products
          </Link>
          {(!user || (user && !user.isAdmin)) && (
            <Link to="/cart" className="text-gray-300 hover:text-green-300 transition duration-300 flex items-center text-lg">
              Cart 🛒
              {totalQuantity > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {totalQuantity}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="bg-green-500 text-black px-5 py-2 rounded-lg hover:bg-green-400 transition duration-300 text-lg">
                Profile
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                  <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => setShowProfileMenu(false)}>
                    View Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">
                    Logout
                  </button>
                  {user.isAdmin && (
                    <>
                      <Link to="/admin/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                        Dashboard
                      </Link>
                      <Link to="/admin/product-history" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                        My Products
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="bg-green-500 text-black px-5 py-2 rounded-lg hover:bg-green-400 transition duration-300 text-lg">
                User
              </Link>
              <Link to="/admin/login" className="bg-green-500 text-black px-5 py-2 rounded-lg hover:bg-green-400 transition duration-300 text-lg">
                Admin
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
