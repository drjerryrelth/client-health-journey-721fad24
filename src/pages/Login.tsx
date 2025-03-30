
import React, { useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const Login = () => {
  const { isAuthenticated, hasRole, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Effect for navigation when auth status changes
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('User authenticated, redirecting...');
      if (hasRole('client')) {
        navigate('/client-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, hasRole, navigate]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-sm text-gray-500">Checking authentication status...</p>
      </div>
    );
  }
  
  // Already logged in - this is a fallback in case the effect doesn't trigger
  if (isAuthenticated) {
    console.log('Already authenticated, redirecting directly');
    if (hasRole('client')) {
      return <Navigate to="/client-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return <LoginForm />;
};

export default Login;
