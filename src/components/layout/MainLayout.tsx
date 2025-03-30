
import React from 'react';
import { useAuth } from '@/context/auth';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { UserRole } from '@/types';

interface MainLayoutProps {
  requiredRoles?: UserRole[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ requiredRoles = ['admin', 'coach', 'client'] }) => {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();
  
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
    return <Navigate to="/login" replace />;
  }
  
  // Check role permissions
  const hasPermission = requiredRoles.some(role => hasRole(role));
  if (!hasPermission) {
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
