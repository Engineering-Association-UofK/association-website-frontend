import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicOnlyRoute = () => {
    const { user, loading, isAuthenticated } = useAuth();
  
    // If user is ALREADY logged in, send them to their dashboard
    if (isAuthenticated) {
      if (user.type === 'admin') {
          return <Navigate to="/admin" replace />;
      } else {
          return <Navigate to="/" replace />; // Or /student/dashboard
      }
    }
  
    // If not logged in, allow access to Login/Register
    return <Outlet />;
}

export default PublicOnlyRoute