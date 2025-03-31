
import React, { useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Login = () => {
  const { isAuthenticated, hasRole, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  // Effect for navigation when auth status changes
  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      console.log('User authenticated, redirecting...', user.role);
      
      // Added toast notification for clarity during debugging
      toast.success(`Logged in as ${user.role}`);
      
      if (hasRole('admin') || hasRole('super_admin')) {
        navigate('/dashboard'); // Admin dashboard
      } else if (hasRole('coach')) {
        navigate('/coach-dashboard'); // Coach dashboard
      } else if (hasRole('client')) {
        navigate('/client-dashboard'); // Client dashboard
      } else {
        toast.error(`Unknown role: ${user.role}`);
      }
    }
  }, [isAuthenticated, isLoading, hasRole, navigate, user]);
  
  // Modified to prevent infinite loading - Add a timeout
  useEffect(() => {
    // If still loading after 5 seconds, reset loading state to prevent infinite spinner
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Authentication check timeout - resetting loading state');
        window.location.reload(); // Force reload if stuck in loading state
      }
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [isLoading]);
  
  // Show loading state, but with a more reliable rendering condition
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-sm text-gray-500">Checking authentication status...</p>
      </div>
    );
  }
  
  // Already logged in - this is a fallback in case the effect doesn't trigger
  if (isAuthenticated && user) {
    console.log('Already authenticated, redirecting directly', user.role);
    
    if (hasRole('admin') || hasRole('super_admin')) {
      return <Navigate to="/dashboard" replace />;
    } else if (hasRole('coach')) {
      return <Navigate to="/coach-dashboard" replace />;
    } else if (hasRole('client')) {
      return <Navigate to="/client-dashboard" replace />;
    }
  }
  
  return <LoginForm />;
};

export default Login;
