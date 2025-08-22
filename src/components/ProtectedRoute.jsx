import { useContext } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, hydrating } = useContext(AuthContext);
  const location = useLocation();

  if (hydrating) return null; // or <LoadingSpinner />

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />;
}
