
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { isAuthenticated, hasRole } = useAuth();
  
  // Redirect if already logged in
  if (isAuthenticated) {
    if (hasRole('client')) {
      return <Navigate to="/client-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return <LoginForm />;
};

export default Login;
