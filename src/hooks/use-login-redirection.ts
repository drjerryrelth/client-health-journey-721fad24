
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

export const useLoginRedirection = () => {
  const { isAuthenticated, hasRole, isLoading, user } = useAuth();
  const [redirectDestination, setRedirectDestination] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Improved redirect logic as a callback to ensure consistency
  const determineRedirectDestination = useCallback(() => {
    if (!user) return null;
    
    // Add toast notification for clarity
    let roleDisplay = '';
    let destination: string;
    
    // Handle each role type specifically
    if (user.role === 'admin' || user.role === 'super_admin') {
      destination = '/admin/dashboard';
      roleDisplay = user.role === 'super_admin' ? 'Super Admin' : 'System Admin';
      console.log('Redirecting to admin dashboard (system admin)');
    } else if (user.role === 'clinic_admin') {
      destination = '/admin/dashboard';
      roleDisplay = 'Clinic Admin';
      console.log('Redirecting to admin dashboard (clinic admin)');
      
      // Enhanced logging for clinic admins
      if (user.clinicId) {
        console.log('Clinic admin for clinic:', user.clinicId, 'Name:', user.name);
      } else {
        console.warn('Clinic admin without clinicId detected!');
      }
    } else if (user.role === 'coach') {
      destination = '/coach/dashboard';
      roleDisplay = 'Coach';
      console.log('Redirecting to coach dashboard');
    } else if (user.role === 'client') {
      destination = '/client'; // Client root path
      roleDisplay = 'Client';
      console.log('Client user detected, redirecting to /client');
    } else {
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
    if (isAuthenticated && !isLoading && user) {
      console.log('User authenticated, redirecting...', user.role, 'clinicId:', user.clinicId);
      
      const destination = determineRedirectDestination();
      if (!destination) return;
      
      setRedirectDestination(destination);
      console.log('Redirecting to:', destination);
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, isLoading, user, navigate, determineRedirectDestination]);
  
  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Authentication check timeout - resetting loading state');
        window.location.reload(); // Force reload if stuck in loading state
      }
    }, 10000); // 10 second timeout for slower connections
    
    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  return {
    isLoading,
    isAuthenticated,
    redirectDestination
  };
};
