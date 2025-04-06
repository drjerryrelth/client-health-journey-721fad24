
import React from 'react';
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
  
  // Additional checking for clinic admin access attempts to system admin routes
  React.useEffect(() => {
    if (user?.role === 'clinic_admin') {
      // System admin only paths that clinic admins should NEVER access
      const systemAdminOnlyPaths = ['/admin/clinics', '/admin/admin-users'];
      
      // Check if current path starts with any of the restricted paths
      const isRestrictedPath = systemAdminOnlyPaths.some(path => 
        location.pathname.startsWith(path)
      );
      
      if (isRestrictedPath) {
        console.error('SECURITY VIOLATION: Clinic admin attempting to access system admin route:', location.pathname);
        toast.error("Access denied. You don't have permission to access this page.");
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 100);
      }
    }
    
    // Additional check for coach users trying to access admin routes
    if (user?.role === 'coach' && location.pathname.startsWith('/admin')) {
      console.error('SECURITY VIOLATION: Coach attempting to access admin route:', location.pathname);
      toast.error("Access denied. You don't have permission to access this page.");
      setTimeout(() => {
        window.location.href = '/coach/dashboard';
      }, 100);
    }
    
    // Additional check for client users trying to access admin or coach routes
    if (user?.role === 'client') {
      if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/coach')) {
        console.error('SECURITY VIOLATION: Client attempting to access admin or coach route:', location.pathname);
        toast.error("Access denied. You don't have permission to access this page.");
        setTimeout(() => {
          window.location.href = '/client';
        }, 100);
      }
    }
  }, [location.pathname, user?.role]);
  
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
  console.log('MainLayout - Required roles:', requiredRoles);
  console.log('MainLayout - Current path:', location.pathname);
  
  // CRITICAL SECURITY ENFORCEMENT
  // Emergency check to prevent unauthorized access to admin routes
  if (user?.role === 'clinic_admin') {
    // System admin only paths that clinic admins should NEVER access
    const systemAdminOnlyPaths = ['/admin/clinics', '/admin/admin-users'];
    
    // Check if current path starts with any of the restricted paths
    const isRestrictedPath = systemAdminOnlyPaths.some(path => 
      location.pathname.startsWith(path)
    );
    
    if (isRestrictedPath) {
      console.error('SECURITY VIOLATION: Blocking clinic admin from accessing system admin route:', location.pathname);
      toast.error("Access denied. You don't have permission to access this page.");
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Check for coach users trying to access admin routes
  if (user?.role === 'coach' && location.pathname.startsWith('/admin')) {
    console.error('SECURITY VIOLATION: Blocking coach from accessing admin route:', location.pathname);
    toast.error("Access denied. You don't have permission to access this page.");
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Check for client users trying to access admin or coach routes
  if (user?.role === 'client') {
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/coach')) {
      console.error('SECURITY VIOLATION: Blocking client from accessing admin or coach route:', location.pathname);
      toast.error("Access denied. You don't have permission to access this page.");
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // CRITICAL SECURITY FIX: Apply specialized role checking logic
  let hasPermission = false;
  
  // If user is a clinic_admin, they can ONLY access clinic_admin routes
  if (user?.role === 'clinic_admin') {
    // Clinic admins can ONLY access routes that explicitly include clinic_admin role
    hasPermission = requiredRoles.includes('clinic_admin');
    
    // Additional check - block clinic admins from system admin pages
    if (requiredRoles.includes('admin') && !requiredRoles.includes('clinic_admin')) {
      console.error('SECURITY VIOLATION: Blocking clinic admin from accessing system admin route');
      hasPermission = false;
    }
  } 
  // For coach users, only allow access to coach routes
  else if (user?.role === 'coach') {
    // Coaches can ONLY access routes that explicitly include coach role
    hasPermission = requiredRoles.includes('coach');
    
    // Block coaches from admin routes
    if (requiredRoles.includes('admin') || requiredRoles.includes('clinic_admin')) {
      console.error('SECURITY VIOLATION: Blocking coach from accessing admin route');
      hasPermission = false;
    }
  }
  // For client users, only allow access to client routes
  else if (user?.role === 'client') {
    // Clients can ONLY access routes that explicitly include client role
    hasPermission = requiredRoles.includes('client');
    
    // Block clients from admin and coach routes
    if (requiredRoles.includes('admin') || requiredRoles.includes('clinic_admin') || requiredRoles.includes('coach')) {
      console.error('SECURITY VIOLATION: Blocking client from accessing admin or coach route');
      hasPermission = false;
    }
  }
  // For other roles, use the standard hasRole method
  else {
    hasPermission = requiredRoles.some(role => hasRole(role));
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
