
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ProgramInitializer from '@/services/program-initializer';
import AdminRoutes from '@/components/routes/AdminRoutes';
import CoachRoutes from '@/components/routes/CoachRoutes';
import ClientRoutes from '@/components/routes/ClientRoutes';
import Unauthorized from '@/pages/Unauthorized';

const DashboardLoader = () => {
  const { user, isLoading, hasRole } = useAuth();

  React.useEffect(() => {
    // Initialize default programs if user is admin or super_admin
    if (user && (user.role === 'admin' || user.role === 'super_admin') && user.clinicId) {
      ProgramInitializer.initializeDefaultPrograms(user.clinicId)
        .catch(err => console.error('Failed to initialize programs:', err));
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  console.log('Dashboard component - user role:', user.role);

  // Only render routes specific to the user's role
  if (hasRole('admin') || hasRole('super_admin')) {
    return <AdminRoutes />;
  } else if (hasRole('coach')) {
    return <CoachRoutes />;
  } else if (hasRole('client')) {
    return <ClientRoutes />;
  } else {
    return <Unauthorized />;
  }
};

export default DashboardLoader;
