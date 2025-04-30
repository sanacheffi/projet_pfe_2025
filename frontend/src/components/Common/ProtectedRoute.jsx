import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user } = useSelector((state) => state.auth);

  // If not logged in or role not authorized
  if (!user || (roles.length > 0 && !roles.includes(user.role))) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
