
import React, { useEffect, useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { Navigate, useNavigate } from 'react-router-dom';
import { useLoginRedirection } from '@/hooks/use-login-redirection';
import { attemptSessionRecovery } from '@/services/auth/session-service';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

const Login = () => {
  const { isLoading, isAuthenticated, redirectDestination } = useLoginRedirection();
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryFailed, setRecoveryFailed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Try session recovery on initial load, but handle failures gracefully
  useEffect(() => {
    let isMounted = true;
    
    const doSessionRecovery = async () => {
      if (isRecovering) return;
      
      setIsRecovering(true);
      try {
        console.log('Login page: Attempting session recovery');
        const result = await attemptSessionRecovery();
        
        if (!isMounted) return;
        
        if (result.recovered) {
          console.log('Login page: Session recovered successfully');
        } else {
          console.log('Login page: No session to recover or recovery failed');
          setRecoveryFailed(true);
        }
      } catch (err) {
        console.error('Login page: Session recovery failed', err);
        if (isMounted) {
          setRecoveryFailed(true);
        }
      } finally {
        if (isMounted) {
          setIsRecovering(false);
        }
      }
    };
    
    doSessionRecovery();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Direct redirection if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is authenticated, redirecting based on role...');
      
      let redirectPath = '/dashboard';
      if (user.role === 'admin' || user.role === 'super_admin') {
        redirectPath = '/admin/dashboard';
      } else if (user.role === 'clinic_admin') {
        redirectPath = '/admin/dashboard';
      } else if (user.role === 'coach') {
        redirectPath = '/coach/dashboard';
      } else if (user.role === 'client') {
        redirectPath = '/client';
      }
      
      console.log('Redirecting to:', redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);
  
  // Immediately show login form if recovery failed
  if (recoveryFailed && !isAuthenticated) {
    return <LoginForm />;
  }
  
  // Show loading state - but only briefly
  if ((isLoading || isRecovering) && !recoveryFailed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
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
