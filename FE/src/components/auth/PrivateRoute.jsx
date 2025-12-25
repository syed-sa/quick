import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait until user state is restored
  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default PrivateRoute;
