
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';
import { attemptSessionRecovery } from '@/services/auth/session-service';

export const useLoginRedirection = () => {
  const { isAuthenticated, hasRole, isLoading, user } = useAuth();
  const [redirectDestination, setRedirectDestination] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const navigate = useNavigate();
  
  // Improved redirect logic as a callback to ensure consistency
  const determineRedirectDestination = useCallback(() => {
    if (!user) return null;
    
    // Add toast notification for clarity
    let roleDisplay = '';
    let destination: string;
    
    // Handle each role type specifically with enhanced consistency
    switch (user.role) {
      case 'admin':
      case 'super_admin':
        destination = '/admin/dashboard';
        roleDisplay = user.role === 'super_admin' ? 'Super Admin' : 'System Admin';
        console.log('Redirecting to admin dashboard (system admin)');
        break;
        
      case 'clinic_admin':
        destination = '/admin/dashboard';
        roleDisplay = 'Clinic Admin';
        console.log('Redirecting to admin dashboard (clinic admin)', user.clinicId);
        break;
        
      case 'coach':
        destination = '/coach/dashboard';
        roleDisplay = 'Coach';
        console.log('Redirecting to coach dashboard');
        break;
        
      case 'client':
        destination = '/client';
        roleDisplay = 'Client';
        console.log('Client user detected, redirecting to /client');
        break;
        
      default:
        console.error(`Unknown role: ${user.role}`);
        toast.error(`Unknown role: ${user.role}`);
        return null;
    }
    
    // Show welcome toast with role information
    toast.success(`Logged in as ${roleDisplay}${user.name ? ': ' + user.name : ''}`);
    
    return destination;
  }, [user]);
  
  // Effect for navigation when auth status changes - improved for consistency
  useEffect(() => {
    if (isAuthenticated && !isLoading && !isRecovering && user) {
      console.log('User authenticated, redirecting...', user.role, 'clinicId:', user.clinicId);
      
      const destination = determineRedirectDestination();
      if (!destination) return;
      
      setRedirectDestination(destination);
      console.log('Redirecting to:', destination);
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, isLoading, isRecovering, user, navigate, determineRedirectDestination]);
  
  // Add session recovery to handle edge cases
  useEffect(() => {
    // Only attempt recovery if we're not already authenticated and not already loading
    if (!isAuthenticated && !isLoading && !isRecovering) {
      const doSessionRecovery = async () => {
        setIsRecovering(true);
        try {
          console.log('Attempting session recovery from useLoginRedirection');
          await attemptSessionRecovery();
          // Auth context will handle the result via auth listener
        } catch (err) {
          console.error('Session recovery failed:', err);
        } finally {
          setIsRecovering(false);
        }
      };
      
      doSessionRecovery();
    }
  }, [isAuthenticated, isLoading, isRecovering]);
  
  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Authentication check timeout - attempting recovery');
        // Instead of forcing reload, attempt recovery first
        attemptSessionRecovery()
          .then(result => {
            if (!result.recovered) {
              console.log('Recovery failed after timeout, refreshing page');
              window.location.reload();
            }
          })
          .catch(() => window.location.reload());
      }
    }, 15000); // 15 second timeout for slower connections (increased from 10s)
    
    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  return {
    isLoading: isLoading || isRecovering,
    isAuthenticated,
    redirectDestination
  };
};
