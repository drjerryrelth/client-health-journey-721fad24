import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import CoachDashboard from '@/pages/CoachDashboard';
import ClientsPage from '@/pages/admin/ClientsPage';
import CheckInsPage from '@/pages/admin/CheckInsPage';
import ResourcesPage from '@/pages/admin/ResourcesPage';
import CoachSettingsPage from '@/pages/coach/CoachSettingsPage';
import ReportsPage from '@/pages/coach/CoachReportsPage';
import MealPlanGenerator from '@/pages/MealPlanGenerator';
import Messages from '@/pages/Messages';
import Unauthorized from '@/pages/Unauthorized';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

const CoachRoutes = () => {
  const { user } = useAuth();
  
  // If not a coach, redirect to unauthorized
  if (user?.role !== 'coach') {
    console.log('Not a coach, redirecting to unauthorized');
    toast.error('Access denied. You do not have coach permissions.');
    return <Navigate to="/unauthorized" replace />;
  }
  
  console.log('Rendering CoachRoutes for coach user:', user);
  
  return (
    <Routes>
      <Route element={<MainLayout requiredRoles={['coach']} />}>
        <Route index element={<CoachDashboard />} />
        <Route path="dashboard" element={<CoachDashboard />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="check-ins" element={<CheckInsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="messages" element={<Messages />} />
        <Route path="meal-plan-generator" element={<MealPlanGenerator />} />
        <Route path="settings" element={<CoachSettingsPage />} />
      </Route>
      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/coach/dashboard" replace />} />
    </Routes>
  );
};

export default CoachRoutes;
