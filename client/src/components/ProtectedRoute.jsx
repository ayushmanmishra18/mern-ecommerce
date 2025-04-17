import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAdmin = false }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" />;
  if (isAdmin && !user.isAdmin) return <Navigate to="/" />;
  return <Outlet />;
};

export default ProtectedRoute;
