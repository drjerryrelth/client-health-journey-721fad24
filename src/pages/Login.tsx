
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { Navigate } from 'react-router-dom';
import { useLoginRedirection } from '@/hooks/use-login-redirection';

const Login = () => {
  const { isLoading, isAuthenticated, redirectDestination } = useLoginRedirection();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-sm text-gray-500">Checking authentication status...</p>
      </div>
    );
  }
  
  // Already logged in - redirect based on role
  if (isAuthenticated && redirectDestination) {
    return <Navigate to={redirectDestination} replace />;
  }
  
  return <LoginForm />;
};

export default Login;
