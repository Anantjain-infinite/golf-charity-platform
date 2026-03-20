import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;