import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import TopBar from './TopBar';
import { UserRole } from '@/types';
import { toast } from 'sonner';
import { isDemoClientEmail } from '@/services/auth/demo/utils';

interface MainLayoutProps {
  requiredRoles?: UserRole[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  requiredRoles = ['admin', 'super_admin', 'clinic_admin', 'coach', 'client'] 
}) => {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Direct role-based path checking on every route change
  useEffect(() => {
    if (!user || isLoading) return;
    
    // Core permissions enforcement - redirects for security violations
    const systemAdminOnlyPaths = ['/admin/clinics', '/admin/admin-users'];
    const adminPaths = ['/admin'];
    const coachPaths = ['/coach'];
    const clientPaths = ['/client'];
    
    const currentPath = location.pathname;
    
    // Enhanced logging for all users to debug access issues
    console.log('Path access check:', {
      path: currentPath,
      role: user.role,
      name: user.name,
      email: user.email, // Log email for debugging
      clinicId: user.clinicId
    });
    
    // Special case for demo client emails
    if (user.email && isDemoClientEmail(user.email) && currentPath.startsWith('/client')) {
      console.log('Demo client email detected, allowing client path access');
      return; // Allow access to client paths for demo clients
    }
    
    // CRITICAL SECURITY ENFORCEMENT - Strict path based checks
    
    // Clinic admin trying to access system admin routes
    if (user.role === 'clinic_admin' && systemAdminOnlyPaths.some(path => currentPath.startsWith(path))) {
      console.error('SECURITY VIOLATION: Clinic admin accessing system admin route:', currentPath);
      toast.error("Access denied. You don't have permission to access this page.");
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    
    // Coach trying to access any admin routes
    if (user.role === 'coach' && adminPaths.some(path => currentPath.startsWith(path))) {
      console.error('SECURITY VIOLATION: Coach accessing admin route:', currentPath);
      toast.error("Access denied. You don't have permission to access this page.");
      navigate('/coach/dashboard', { replace: true });
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
        navigate('/client', { replace: true });
        return;
      }
    }
    
    // Special case for verifying clinic admin access is restricted to their clinic only
    if (user.role === 'clinic_admin' && currentPath.includes('/admin')) {
      // Additional verification could be added here to check if accessing clinic-specific data
      console.log('Clinic admin accessing admin route - verifying access for clinic:', user.clinicId);
    }
  }, [location.pathname, user, isLoading, navigate]);
  
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
  console.log('MainLayout - User email:', user?.email); // Log email for debugging
  console.log('MainLayout - Required roles:', requiredRoles);
  console.log('MainLayout - Current path:', location.pathname);
  
  // CRITICAL SECURITY ENFORCEMENT
  // Check for demo client email specifically
  if (user?.email && isDemoClientEmail(user.email) && requiredRoles.includes('client')) {
    console.log('Demo client account detected, granting access to client routes');
    // Allow access to client pages for demo client email
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
  }
  
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
    
    // Direct users to their appropriate home page based on role
    let redirectPath = '/unauthorized';
    if (user?.role === 'client') redirectPath = '/client';
    else if (user?.role === 'coach') redirectPath = '/coach/dashboard';
    else if (user?.role === 'clinic_admin') redirectPath = '/admin/dashboard';
    else if (user?.role === 'admin' || user?.role === 'super_admin') redirectPath = '/admin/dashboard';
    
    return <Navigate to={redirectPath} replace />;
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
