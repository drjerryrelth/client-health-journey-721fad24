
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
import Messages from '@/pages/Messages';
import Unauthorized from '@/pages/Unauthorized';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';
import { isDemoEmail, isDemoClientEmail } from '@/services/auth/demo';

const ClientRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Log the client route access for debugging
  useEffect(() => {
    if (user) {
      console.log('Client route access attempt:', {
        path: location.pathname,
        userId: user.id,
        email: user.email,
        role: user.role
      });
    }
  }, [location.pathname, user]);
  
  // Allow access for demo clients
  if (user?.email && isDemoClientEmail(user.email)) {
    console.log('Demo client account detected, allowing access');
    return (
      <Routes>
        <Route element={<MainLayout requiredRoles={['client']} />}>
          <Route index element={<ClientDashboard />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="messages" element={<Messages />} />
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
  }
  
  // If not a demo client, check role permissions
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
        <Route path="messages" element={<Messages />} />
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
