
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import CoachDashboard from '@/pages/CoachDashboard';
import ClientsPage from '@/pages/admin/ClientsPage';
import CheckInsPage from '@/pages/admin/CheckInsPage';
import ResourcesPage from '@/pages/admin/ResourcesPage';

const CoachRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<CoachDashboard />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="check-ins" element={<CheckInsPage />} />
        <Route path="resources" element={<ResourcesPage />} />
      </Route>
    </Routes>
  );
};

export default CoachRoutes;
