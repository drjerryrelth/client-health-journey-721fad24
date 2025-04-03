
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ClientPortal from '@/pages/ClientPortal';
import CheckIn from '@/pages/CheckIn';
import ClientProgress from '@/pages/ClientProgress';
import ClientProgramDetails from '@/pages/ClientProgramDetails';
import MyProfile from '@/pages/MyProfile';
import ClientDashboard from '@/pages/ClientDashboard';

const ClientRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout requiredRoles={['client']} />}>
        <Route index element={<ClientPortal />} />
        <Route path="dashboard" element={<ClientPortal />} />
        <Route path="messages" element={<ClientPortal />} />
        <Route path="journal" element={<ClientPortal />} />
        <Route path="resources" element={<ClientPortal />} />
        <Route path="program" element={<ClientPortal />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="check-in" element={<CheckIn />} />
        <Route path="progress" element={<ClientProgress />} />
        <Route path="my-program" element={<ClientProgramDetails />} />
      </Route>
    </Routes>
  );
};

export default ClientRoutes;
