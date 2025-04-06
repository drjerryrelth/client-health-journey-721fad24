
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import CoachDashboard from '@/pages/CoachDashboard';
import ClientsPage from '@/pages/admin/ClientsPage';
import CheckInsPage from '@/pages/admin/CheckInsPage';
import ResourcesPage from '@/pages/admin/ResourcesPage';
import CoachSettingsPage from '@/pages/coach/CoachSettingsPage';
import ReportsPage from '@/pages/coach/CoachReportsPage';
import MealPlanGenerator from '@/pages/MealPlanGenerator';
import Unauthorized from '@/pages/Unauthorized';

const CoachRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout requiredRoles={['coach']} />}>
        <Route index element={<CoachDashboard />} />
        <Route path="dashboard" element={<CoachDashboard />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="check-ins" element={<CheckInsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="meal-plan-generator" element={<MealPlanGenerator />} />
        <Route path="settings" element={<CoachSettingsPage />} />
      </Route>
      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Unauthorized />} />
    </Routes>
  );
};

export default CoachRoutes;
