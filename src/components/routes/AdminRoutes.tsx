
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import AdminDashboard from '@/pages/AdminDashboard';
import ClientsPage from '@/pages/admin/ClientsPage';
import ProgramsPage from '@/pages/admin/ProgramsPage';
import CoachesPage from '@/pages/admin/CoachesPage';
import CheckInsPage from '@/pages/admin/CheckInsPage';
import ClinicsPage from '@/pages/admin/ClinicsPage';
import ResourcesPage from '@/pages/admin/ResourcesPage';
import ReportsPage from '@/pages/admin/ReportsPage';
import SettingsPage from '@/pages/admin/SettingsPage';
import ActivitiesPage from '@/pages/admin/ActivitiesPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import ClinicCustomizationPage from '@/pages/admin/ClinicCustomizationPage';
import MealPlanGenerator from '@/pages/MealPlanGenerator';
import NotFound from '@/pages/NotFound';
import { useAuth } from '@/context/auth';

const AdminRoutes = () => {
  const { user } = useAuth();
  
  // Check if the user is a clinic admin vs system admin
  const isClinicAdmin = user?.role === 'clinic_admin';
  const isSystemAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  // If clinic admin, render routes that only show clinic-specific data
  if (isClinicAdmin) {
    return (
      <Routes>
        <Route element={<MainLayout requiredRoles={['clinic_admin']} />}>
          {/* Clinic admin can only see their own clinic */}
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="coaches" element={<CoachesPage />} />
          <Route path="programs" element={<ProgramsPage />} />
          <Route path="check-ins" element={<CheckInsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="clinic-customization" element={<ClinicCustomizationPage />} />
          <Route path="meal-plan-generator" element={<MealPlanGenerator />} />
          <Route path="settings" element={<SettingsPage />} />
          
          {/* Clinic admins shouldn't access these routes */}
          <Route path="clinics" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="admin-users" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    );
  }
  
  // System admin routes (original behavior)
  return (
    <Routes>
      <Route element={<MainLayout requiredRoles={['admin', 'super_admin']} />}>
        {/* Base route */}
        <Route index element={<AdminDashboard />} />
        
        {/* Admin routes - these match exactly with AdminNavItems.tsx */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="clinics" element={<ClinicsPage />} />
        <Route path="coaches" element={<CoachesPage />} />
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="check-ins" element={<CheckInsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="clinic-customization" element={<ClinicCustomizationPage />} />
        <Route path="meal-plan-generator" element={<MealPlanGenerator />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="admin-users" element={<AdminUsersPage />} />
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
