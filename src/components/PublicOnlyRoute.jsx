import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner, Container } from 'react-bootstrap';

const PublicOnlyRoute = () => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
          <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spinner animation="border" variant="primary" />
          </Container>
        );
      }
  
    // If user is ALREADY logged in, send them to their dashboard
    if (isAuthenticated) {
      if (user.role === 'admin') {
          return <Navigate to="/admin" replace />;
      } else {
          return <Navigate to="/" replace />; // Or /student/dashboard
      }
    }
  
    // If not logged in, allow access to Login/Register
    return <Outlet />;
}

export default PublicOnlyRoute