
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';
import { attemptSessionRecovery } from '@/services/auth/session-service';
import { isDemoClientEmail, isDemoCoachEmail } from '@/services/auth/demo/utils';

export const useLoginRedirection = () => {
  const { isAuthenticated, hasRole, isLoading, user, initialAuthCheckComplete } = useAuth();
  const [redirectDestination, setRedirectDestination] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryAttempted, setRecoveryAttempted] = useState(false);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const navigate = useNavigate();
  
  // Improved redirect logic as a callback to ensure consistency
  const determineRedirectDestination = useCallback(() => {
    if (!user) return null;
    
    console.log('Determining redirect destination for user:', {
      email: user.email,
      role: user.role,
      clinicId: user.clinicId
    });
    
    // Special handling for demo client emails - highest priority
    if (user.email && isDemoClientEmail(user.email)) {
      console.log('Demo client email detected, redirecting to client portal');
      return '/client';
    }
    
    // Special handling for demo coach emails
    if (user.email && isDemoCoachEmail(user.email)) {
      console.log('Demo coach email detected, redirecting to coach dashboard');
      return '/coach/dashboard';
    }
    
    // Handle each role type specifically with enhanced consistency
    switch (user.role) {
      case 'admin':
      case 'super_admin':
        console.log('Redirecting to admin dashboard (system admin)');
        return '/admin/dashboard';
        
      case 'clinic_admin':
        console.log('Redirecting to admin dashboard (clinic admin)', user.clinicId);
        return '/admin/dashboard';
        
      case 'coach':
        console.log('Redirecting to coach dashboard');
        return '/coach/dashboard';
        
      case 'client':
        console.log('Client user detected, redirecting to /client');
        return '/client';
        
      default:
        console.error(`Unknown role: ${user.role}`);
        toast.error(`Unknown role: ${user.role}`);
        return null;
    }
  }, [user]);
  
  // Effect for navigation when auth status changes - improved for consistency
  useEffect(() => {
    // Only redirect if auth check is complete and we haven't attempted redirection yet
    if (isAuthenticated && !isLoading && !isRecovering && user && initialAuthCheckComplete && !redirectAttempted) {
      console.log('User authenticated, determining redirect destination:', {
        role: user.role, 
        clinicId: user.clinicId, 
        email: user.email
      });
      
      const destination = determineRedirectDestination();
      if (!destination) return;
      
      setRedirectDestination(destination);
      setRedirectAttempted(true);
      console.log('Redirecting to:', destination);
      
      // Use a small timeout to ensure state updates happen first
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 0);
    }
  }, [
    isAuthenticated, 
    isLoading, 
    isRecovering, 
    user, 
    navigate, 
    determineRedirectDestination, 
    initialAuthCheckComplete, 
    redirectAttempted
  ]);
  
  // Reset redirect attempted flag when user changes
  useEffect(() => {
    if (user?.id) {
      setRedirectAttempted(false);
    }
  }, [user?.id]);
  
  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading && !isRecovering) {
        console.log('Authentication check timeout - allowing access anyway');
        setIsRecovering(false);
        setRecoveryAttempted(true);
      }
    }, 8000); // 8 second timeout
    
    return () => clearTimeout(timeoutId);
  }, [isLoading, isRecovering]);

  return {
    isLoading: isLoading || isRecovering,
    isAuthenticated,
    redirectDestination
  };
};
