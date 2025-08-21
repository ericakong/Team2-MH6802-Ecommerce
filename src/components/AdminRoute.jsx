// AdminRoute.jsx
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminRoute() {
    const { isAdmin } = useContext(AuthContext);
    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}