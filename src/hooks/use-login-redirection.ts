
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';
import { attemptSessionRecovery } from '@/services/auth/session-service';
import { isDemoClientEmail } from '@/services/auth/demo/utils';

export const useLoginRedirection = () => {
  const { isAuthenticated, hasRole, isLoading, user } = useAuth();
  const [redirectDestination, setRedirectDestination] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryAttempted, setRecoveryAttempted] = useState(false);
  const navigate = useNavigate();
  
  // Improved redirect logic as a callback to ensure consistency
  const determineRedirectDestination = useCallback(() => {
    if (!user) return null;
    
    // Special handling for demo client emails - highest priority
    if (user.email && isDemoClientEmail(user.email)) {
      console.log('Demo client email detected, redirecting to client portal');
      toast.success(`Logged in as Client: ${user.name || 'Demo Client'}`);
      return '/client';
    }
    
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
      console.log('User authenticated, redirecting...', user.role, 'clinicId:', user.clinicId, 'email:', user.email);
      
      const destination = determineRedirectDestination();
      if (!destination) return;
      
      setRedirectDestination(destination);
      console.log('Redirecting to:', destination);
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, isLoading, isRecovering, user, navigate, determineRedirectDestination]);
  
  // Add session recovery to handle edge cases - with improved state tracking
  useEffect(() => {
    // Only attempt recovery if we're not already authenticated, not already loading, 
    // not already recovering, and haven't attempted recovery yet
    if (!isAuthenticated && !isLoading && !isRecovering && !recoveryAttempted) {
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
          setRecoveryAttempted(true); // Mark that we've attempted recovery
        }
      };
      
      doSessionRecovery();
    }
  }, [isAuthenticated, isLoading, isRecovering, recoveryAttempted]);
  
  // Add timeout to prevent infinite loading - with better fallback
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading && !isRecovering) {
        console.log('Authentication check timeout - attempting recovery');
        // Instead of forcing reload, attempt recovery first
        setIsRecovering(true);
        attemptSessionRecovery()
          .then(result => {
            if (!result.recovered) {
              console.log('Recovery failed after timeout, forcing login flow');
              setIsRecovering(false);
              // Don't reload page, just force login flow by marking recovery as attempted
              setRecoveryAttempted(true);
            } else {
              setIsRecovering(false);
            }
          })
          .catch(() => {
            console.log('Recovery exception after timeout, forcing login flow');
            setIsRecovering(false);
            setRecoveryAttempted(true);
          });
      }
    }, 20000); // 20 second timeout for slower connections (increased from 15s)
    
    return () => clearTimeout(timeoutId);
  }, [isLoading, isRecovering]);

  return {
    isLoading: isLoading || isRecovering,
    isAuthenticated,
    redirectDestination
  };
};
