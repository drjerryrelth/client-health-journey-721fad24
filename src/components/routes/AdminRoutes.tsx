
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { toast } from 'sonner';

const AdminRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Strict type checking
  const isSystemAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isClinicAdmin = user?.role === 'clinic_admin';
  
  // If not an admin or clinic admin, redirect to unauthorized
  if (!isSystemAdmin && !isClinicAdmin) {
    console.log('Not an admin or clinic admin, redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }
  
  // CRITICAL SECURITY ENFORCEMENT
  // Emergency check to prevent clinic admins from accessing system admin routes
  useEffect(() => {
    if (isClinicAdmin) {
      const currentPath = window.location.pathname;
      // These paths are strictly forbidden for clinic admins
      const forbiddenPaths = ['/admin/clinics', '/admin/admin-users'];
      
      if (forbiddenPaths.some(path => currentPath.startsWith(path))) {
        console.error('SECURITY VIOLATION: Clinic admin attempting to access forbidden route:', currentPath);
        toast.error('Access denied. You do not have permission to access this page.');
        // Force a redirect
        window.location.href = '/admin/dashboard';
      }
    }
  }, [location.pathname, isClinicAdmin]);
  
  // CRITICAL SECURITY ENFORCEMENT: Different routes for different admin types
  // This separation ensures clinic admins can NEVER access system admin routes
  if (isClinicAdmin) {
    console.log('Rendering CLINIC ADMIN routes only - restricted access');
    console.log('Clinic admin info:', {
      name: user?.name,
      clinicId: user?.clinicId
    });
    
    return (
      <Routes>
        {/* Use specialized layout with strict role enforcement */}
        <Route element={<MainLayout requiredRoles={['clinic_admin']} />}>
          {/* Base route */}
          <Route index element={<AdminDashboard />} />
          
          {/* Routes allowed for clinic admins */}
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
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Route>
        
        {/* Emergency catch-all to prevent access to system admin routes */}
        <Route path="clinics/*" element={<Navigate to="/unauthorized" replace />} />
        <Route path="admin-users/*" element={<Navigate to="/unauthorized" replace />} />
      </Routes>
    );
  }
  
  // System admin routes (for 'admin' or 'super_admin')
  console.log('Rendering SYSTEM ADMIN routes (full access)');
  return (
    <Routes>
      <Route element={<MainLayout requiredRoles={['admin', 'super_admin']} />}>
        {/* Base route */}
        <Route index element={<AdminDashboard />} />
        
        {/* All admin routes available to system admins */}
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
