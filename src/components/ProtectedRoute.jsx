// ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute() {
    const { isAuthenticated, initializing } = useContext(AuthContext);
    const location = useLocation();

    if (initializing) return null; // or a spinner
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}