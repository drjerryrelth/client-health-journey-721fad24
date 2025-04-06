
import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import TopBar from './TopBar';
import { UserRole } from '@/types';
import { toast } from 'sonner';

interface MainLayoutProps {
  requiredRoles?: UserRole[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ requiredRoles = ['admin', 'super_admin', 'clinic_admin', 'coach', 'client'] }) => {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();
  const location = useLocation();
  
  // Direct role-based path checking on every route change
  useEffect(() => {
    if (!user || isLoading) return;
    
    // Core permissions enforcement - redirects for security violations
    const adminOnlyPaths = ['/admin/clinics', '/admin/admin-users'];
    const adminPaths = ['/admin'];
    const coachPaths = ['/coach'];
    const clientPaths = ['/client'];
    
    const currentPath = location.pathname;
    
    // Enhanced logging for clinic admins to debug access issues
    if (user.role === 'clinic_admin') {
      console.log('Clinic admin path check:', {
        path: currentPath,
        name: user.name,
        clinicId: user.clinicId
      });
    }
    
    // Clinic admin trying to access system admin routes
    if (user.role === 'clinic_admin' && adminOnlyPaths.some(path => currentPath.startsWith(path))) {
      console.error('SECURITY VIOLATION: Clinic admin accessing system admin route:', currentPath);
      toast.error("Access denied. You don't have permission to access this page.");
      setTimeout(() => window.location.href = '/admin/dashboard', 100);
      return;
    }
    
    // Coach trying to access any admin routes
    if (user.role === 'coach' && adminPaths.some(path => currentPath.startsWith(path))) {
      console.error('SECURITY VIOLATION: Coach accessing admin route:', currentPath);
      toast.error("Access denied. You don't have permission to access this page.");
      setTimeout(() => window.location.href = '/coach/dashboard', 100);
      return;
    }
    
    // Client trying to access admin or coach routes
    if (user.role === 'client') {
      if (
        adminPaths.some(path => currentPath.startsWith(path)) || 
        coachPaths.some(path => currentPath.startsWith(path))
      ) {
        console.error('SECURITY VIOLATION: Client accessing admin or coach route:', currentPath);
        toast.error("Access denied. You don't have permission to access this page.");
        setTimeout(() => window.location.href = '/client', 100);
        return;
      }
    }
    
    // Admin accessing coach/client paths - this is allowed, so no redirect
    // Clinic admin accessing coach paths - this is allowed, so no redirect
    // Coach accessing client paths - this is allowed, so no redirect
  }, [location.pathname, user, isLoading]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    console.log('MainLayout - User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Detailed role and permission logging for debugging
  console.log('MainLayout - User role:', user?.role);
  console.log('MainLayout - User clinicId:', user?.clinicId);
  console.log('MainLayout - User name:', user?.name);
  console.log('MainLayout - Required roles:', requiredRoles);
  console.log('MainLayout - Current path:', location.pathname);
  
  // CRITICAL SECURITY ENFORCEMENT
  // Emergency check to prevent unauthorized access to admin routes
  let hasPermission = false;
  
  // Custom role-checking logic with proper hierarchy enforcement
  if (user) {
    // System admins can access everything
    if (user.role === 'admin' || user.role === 'super_admin') {
      hasPermission = true;
    } 
    // Clinic admins have specific permissions
    else if (user.role === 'clinic_admin') {
      // Block clinic admins from system admin routes
      const isSystemAdminOnlyRoute = 
        requiredRoles.includes('admin') && 
        !requiredRoles.includes('clinic_admin');
        
      if (isSystemAdminOnlyRoute) {
        console.error('SECURITY VIOLATION: Blocking clinic admin from accessing system admin route');
        hasPermission = false;
      } else {
        // Allow clinic admins to access their specific routes
        hasPermission = requiredRoles.includes('clinic_admin');
      }
    }
    // Coach permissions
    else if (user.role === 'coach') {
      // Coaches can only access routes that explicitly include coach role
      hasPermission = requiredRoles.includes('coach');
      
      // Block coaches from admin routes
      if (requiredRoles.includes('admin') || requiredRoles.includes('clinic_admin')) {
        console.error('SECURITY VIOLATION: Blocking coach from accessing admin route');
        hasPermission = false;
      }
    }
    // Client permissions
    else if (user.role === 'client') {
      // Clients can only access routes that explicitly include client role
      hasPermission = requiredRoles.includes('client');
      
      // Block clients from admin and coach routes
      if (requiredRoles.includes('admin') || requiredRoles.includes('clinic_admin') || requiredRoles.includes('coach')) {
        console.error('SECURITY VIOLATION: Blocking client from accessing admin or coach route');
        hasPermission = false;
      }
    }
    // Unknown role - deny access
    else {
      console.error('Unknown user role:', user.role);
      hasPermission = false;
    }
  }
  
  console.log('MainLayout - Has permission:', hasPermission);
  
  if (!hasPermission) {
    toast.error("Access denied. You don't have permission to access this page.");
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
