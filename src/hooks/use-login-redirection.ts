
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

export const useLoginRedirection = () => {
  const { isAuthenticated, hasRole, isLoading, user } = useAuth();
  const [redirectDestination, setRedirectDestination] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Effect for navigation when auth status changes
  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      console.log('User authenticated, redirecting...', user.role, 'clinicId:', user.clinicId);
      
      // Add toast notification for clarity
      toast.success(`Logged in as ${user.role}`);
      
      // Determine redirect destination based on role
      let destination: string;
      
      // Check if this is a clinic admin (admin with clinicId)
      const isClinicAdmin = user.role === 'admin' && user.clinicId !== undefined;
      
      if ((user.role === 'admin' && !user.clinicId) || user.role === 'super_admin') {
        destination = '/admin/dashboard';
        console.log('Redirecting to admin dashboard (system admin)');
      } else if (isClinicAdmin) {
        // Clinic admins go to admin dashboard too, but will see limited options
        destination = '/admin/dashboard';
        console.log('Redirecting to admin dashboard (clinic admin)');
      } else if (user.role === 'coach') {
        destination = '/coach/dashboard';
        console.log('Redirecting to coach dashboard');
      } else if (user.role === 'client') {
        destination = '/client'; // Changed from /client/dashboard to /client
        console.log('Client user detected, redirecting to /client');
      } else {
        toast.error(`Unknown role: ${user.role}`);
        return;
      }
      
      setRedirectDestination(destination);
      console.log('Redirecting to:', destination);
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, isLoading, hasRole, navigate, user]);
  
  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Authentication check timeout - resetting loading state');
        window.location.reload(); // Force reload if stuck in loading state
      }
    }, 5000);
    
    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  return {
    isLoading,
    isAuthenticated,
    redirectDestination
  };
};
