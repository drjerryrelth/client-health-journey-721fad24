
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLoader from '@/components/dashboard/DashboardLoader';
import { useAuth } from '@/context/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { hasRole, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      // Redirect to the appropriate dashboard based on role
      if (hasRole('admin') || hasRole('super_admin')) {
        navigate('/admin', { replace: true });
      } else if (hasRole('coach')) {
        navigate('/coach', { replace: true });
      } else if (hasRole('client')) {
        navigate('/client', { replace: true });
      }
    }
  }, [hasRole, isLoading, navigate]);

  return <DashboardLoader />;
};

export default Dashboard;
