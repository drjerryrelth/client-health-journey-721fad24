
import React, { useEffect, useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { Navigate } from 'react-router-dom';
import { useLoginRedirection } from '@/hooks/use-login-redirection';
import { attemptSessionRecovery } from '@/services/auth/session-service';

const Login = () => {
  const { isLoading, isAuthenticated, redirectDestination } = useLoginRedirection();
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryFailed, setRecoveryFailed] = useState(false);
  
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
  
  // Immediately show login form if recovery failed
  if (recoveryFailed && !isAuthenticated) {
    return <LoginForm />;
  }
  
  // Show loading state - but only briefly
  if ((isLoading || isRecovering) && !recoveryFailed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-sm text-gray-500">Checking authentication status...</p>
      </div>
    );
  }
  
  // Already logged in - redirect based on role
  if (isAuthenticated && redirectDestination) {
    console.log('User is authenticated, redirecting to:', redirectDestination);
    return <Navigate to={redirectDestination} replace />;
  }
  
  return <LoginForm />;
};

export default Login;
