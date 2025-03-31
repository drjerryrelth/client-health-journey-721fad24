
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';
import Unauthorized from './Unauthorized';
import MainLayout from '@/components/layout/MainLayout';
import ClientsPage from './admin/ClientsPage';
import ProgramsPage from './admin/ProgramsPage';
import CoachesPage from './admin/CoachesPage';
import CheckInsPage from './admin/CheckInsPage';
import ClinicsPage from './admin/ClinicsPage';
import ResourcesPage from './admin/ResourcesPage';
import ReportsPage from './admin/ReportsPage';
import SettingsPage from './admin/SettingsPage';
import ActivitiesPage from './admin/ActivitiesPage';
import AdminUsersPage from './admin/AdminUsersPage';
import ProgramInitializer from '@/services/program-initializer';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
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

  return (
    <Routes>
      {user.role === 'admin' || user.role === 'super_admin' ? (
        <Route element={<MainLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="coaches" element={<CoachesPage />} />
          <Route path="check-ins" element={<CheckInsPage />} />
          <Route path="clinics" element={<ClinicsPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="admin-users" element={<AdminUsersPage />} />
        </Route>
      ) : user.role === 'client' ? (
        <Route element={<MainLayout />}>
          <Route index element={<ClientDashboard />} />
        </Route>
      ) : (
        <Route index element={<Unauthorized />} />
      )}
    </Routes>
  );
};

export default Dashboard;
