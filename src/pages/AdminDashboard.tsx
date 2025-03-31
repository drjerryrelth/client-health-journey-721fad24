
import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats, useRecentActivities } from '@/hooks/use-dashboard-stats';
import { toast } from 'sonner';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import ClinicsTable from '@/components/admin/dashboard/ClinicsTable';
import ActivityList from '@/components/admin/dashboard/ActivityList';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { 
    data: dashboardStats, 
    isLoading: isLoadingStats, 
    error: statsError,
    refetch: refetchStats,
    isError: isStatsError
  } = useDashboardStats();
  
  const { 
    data: recentActivities, 
    isLoading: isLoadingActivities,
    refetch: refetchActivities,
    isError: isActivitiesError,
    error: activitiesError
  } = useRecentActivities(3); // Limit to 3 for the dashboard

  // Auto-refresh on error after 2 seconds
  useEffect(() => {
    if (isStatsError) {
      const timer = setTimeout(() => {
        console.log('Auto-refreshing dashboard stats due to error');
        refetchStats();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isStatsError, refetchStats]);

  // Log detailed errors for debugging
  useEffect(() => {
    if (statsError) {
      console.error('[AdminDashboard] Stats error details:', statsError);
    }
    if (activitiesError) {
      console.error('[AdminDashboard] Activities error details:', activitiesError);
    }
  }, [statsError, activitiesError]);
  
  const handleManageClinics = () => {
    navigate("/admin/clinics");
  };
  
  const handleViewAllActivities = () => {
    navigate("/admin/activities");
  };

  const handleRefresh = () => {
    refetchStats();
    refetchActivities();
    toast("Dashboard refreshed", {
      description: "Latest data has been loaded from the database."
    });
  };
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name || 'Admin User'}!</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          className="flex items-center gap-1"
          disabled={isLoadingStats || isLoadingActivities}
        >
          <RefreshCw size={16} className={isLoadingStats || isLoadingActivities ? "animate-spin" : ""} />
          <span>Refresh</span>
        </Button>
      </div>
      
      {/* Stats Cards */}
      <DashboardStats 
        stats={dashboardStats}
        isLoading={isLoadingStats}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClinicsTable
            dashboardStats={dashboardStats}
            isLoading={isLoadingStats}
            isError={isStatsError}
            refetch={refetchStats}
            onManageClinics={handleManageClinics}
          />
        </div>
        
        <div>
          <ActivityList
            activities={recentActivities}
            isLoading={isLoadingActivities}
            isError={isActivitiesError}
            refetch={refetchActivities}
            onViewAll={handleViewAllActivities}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
