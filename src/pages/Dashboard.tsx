
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLoader from '@/components/dashboard/DashboardLoader';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';
import { isDemoClientEmail } from '@/services/auth/demo/utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const { hasRole, isLoading, user } = useAuth();
  
  useEffect(() => {
    if (!isLoading && user) {
      console.log('Dashboard redirecting based on role:', user.role, 'clinicId:', user.clinicId);
      
      // Special handling for demo client email addresses
      if (user.email && isDemoClientEmail(user.email)) {
        console.log('Demo client email detected, redirecting to client portal');
        navigate('/client', { replace: true });
        return;
      }
      
      // Strict role-based redirection
      if (user.role === 'admin' || user.role === 'super_admin') {
        console.log('Redirecting to admin dashboard (system admin)');
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'clinic_admin') {
        console.log('Redirecting to admin dashboard (clinic admin)');
        navigate('/admin/dashboard', { replace: true }); 
      } else if (user.role === 'coach') {
        console.log('Redirecting to coach dashboard');
        navigate('/coach/dashboard', { replace: true });
      } else if (user.role === 'client') {
        console.log('Redirecting to client portal');
        navigate('/client', { replace: true });
      } else {
        console.error('Unknown user role:', user.role);
        toast.error(`Unknown role detected: ${user.role}`);
        navigate('/unauthorized', { replace: true });
      }
    }
  }, [hasRole, isLoading, navigate, user]);

  // Display loading state while checking auth status
  return <DashboardLoader />;
};

export default Dashboard;
