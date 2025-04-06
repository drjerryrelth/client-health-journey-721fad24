
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ClientPortal from '@/pages/ClientPortal';
import CheckIn from '@/pages/CheckIn';
import ClientProgress from '@/pages/ClientProgress';
import ClientProgramDetails from '@/pages/ClientProgramDetails';
import MyProfile from '@/pages/MyProfile';
import ClientDashboard from '@/pages/ClientDashboard';
import MealPlanGenerator from '@/pages/MealPlanGenerator';
import Unauthorized from '@/pages/Unauthorized';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

const ClientRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Log the client route access for debugging
  useEffect(() => {
    if (user?.role === 'client') {
      console.log('Client accessing route:', {
        path: location.pathname,
        clientId: user.id,
        name: user.name
      });
    }
  }, [location.pathname, user]);
  
  // If not a client, redirect to unauthorized
  if (user?.role !== 'client') {
    console.log('Not a client, redirecting to unauthorized');
    toast.error('Access denied. You do not have client permissions.');
    return <Navigate to="/unauthorized" replace />;
  }
  
  console.log('Rendering ClientRoutes for client user:', user);
  
  return (
    <Routes>
      <Route element={<MainLayout requiredRoles={['client']} />}>
        <Route index element={<ClientDashboard />} />
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="messages" element={<ClientPortal />} />
        <Route path="journal" element={<ClientPortal />} />
        <Route path="resources" element={<ClientPortal />} />
        <Route path="program" element={<ClientPortal />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="check-in" element={<CheckIn />} />
        <Route path="progress" element={<ClientProgress />} />
        <Route path="my-program" element={<ClientProgramDetails />} />
        <Route path="meal-plan-generator" element={<MealPlanGenerator />} />
      </Route>
      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/client" replace />} />
    </Routes>
  );
};

export default ClientRoutes;
