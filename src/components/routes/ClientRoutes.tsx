
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ClientDashboard from '@/pages/ClientDashboard';

const ClientRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<ClientDashboard />} />
      </Route>
    </Routes>
  );
};

export default ClientRoutes;
