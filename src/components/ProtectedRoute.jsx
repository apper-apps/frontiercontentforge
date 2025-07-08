import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/Loading';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null; // App.jsx will handle showing login
  }

  return children;
};

export default ProtectedRoute;