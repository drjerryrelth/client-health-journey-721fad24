
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLoader from '@/components/dashboard/DashboardLoader';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { hasRole, isLoading, user } = useAuth();
  
  useEffect(() => {
    if (!isLoading && user) {
      console.log('Dashboard redirecting based on role:', user.role);
      // Redirect to the appropriate dashboard based on role
      if (hasRole('admin') || hasRole('super_admin')) {
        navigate('/admin/dashboard', { replace: true });
      } else if (hasRole('coach')) {
        navigate('/coach/dashboard', { replace: true });
      } else if (hasRole('client')) {
        navigate('/client/dashboard', { replace: true });
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
