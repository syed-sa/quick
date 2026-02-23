// components/auth/PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until user state is restored
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
    </div>
  );

  if (!user) {
    // Save the attempted location with search params
    return (
      <Navigate 
        to="/auth" 
        state={{ 
          from: location.pathname + location.search,
          message: "Please sign in to continue with our services"
        }} 
        replace 
      />
    );
  }

  return children;
};

export default PrivateRoute;