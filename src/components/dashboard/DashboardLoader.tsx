
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import ProgramInitializer from '@/services/program-initializer';
import AdminRoutes from '@/components/routes/AdminRoutes';
import CoachRoutes from '@/components/routes/CoachRoutes';
import ClientRoutes from '@/components/routes/ClientRoutes';
import Unauthorized from '@/pages/Unauthorized';

const DashboardLoader = () => {
  const { user, isLoading, hasRole } = useAuth();

  React.useEffect(() => {
    // Initialize default programs if user is clinic_admin or system admin with a clinicId
    if (user && ((user.role === 'clinic_admin' || user.role === 'admin' || user.role === 'super_admin') && user.clinicId)) {
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
    console.log('DashboardLoader - No user, redirecting to login');
    return <Navigate to="/login" />;
  }

  console.log('DashboardLoader - User role:', user.role);
  
  // STRICT ENFORCEMENT - Only render routes specific to the user's role
  if (user.role === 'admin' || user.role === 'super_admin') {
    return <AdminRoutes />;
  } else if (user.role === 'clinic_admin') {
    // Ensure clinic admins can only see clinic admin routes
    return <AdminRoutes />;
  } else if (user.role === 'coach') {
    return <CoachRoutes />;
  } else if (user.role === 'client') {
    console.log('Rendering client routes');
    return <ClientRoutes />;
  } else {
    console.error('Unknown user role:', user.role);
    return <Unauthorized />;
  }
};

export default DashboardLoader;
