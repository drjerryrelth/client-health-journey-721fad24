
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Base routes */}
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        
        {/* Main admin routes - these paths must exactly match those in AdminNavItems.tsx */}
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clinics" element={<ClinicsPage />} />
        <Route path="/coaches" element={<CoachesPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/check-ins" element={<CheckInsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/clinic-customization" element={<ClinicCustomizationPage />} />
        <Route path="/meal-plan-generator" element={<MealPlanGenerator />} />
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Admin specific routes */}
        <Route path="clients" element={<ClientsPage />} />
        <Route path="clinics" element={<ClinicsPage />} />
        <Route path="coaches" element={<CoachesPage />} />
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="check-ins" element={<CheckInsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="admin-users" element={<AdminUsersPage />} />
        <Route path="clinic-customization" element={<ClinicCustomizationPage />} />
        <Route path="meal-plan-generator" element={<MealPlanGenerator />} />
        <Route path="settings" element={<SettingsPage />} />
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
