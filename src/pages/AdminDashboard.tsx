
import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, Building, Users, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useDashboardStats, useRecentActivities } from '@/hooks/use-dashboard-stats';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  
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
  
  // Stats with different navigation paths - UPDATED to use correct paths
  const stats = [
    { 
      title: 'Active Clinics', 
      value: dashboardStats?.activeClinicCount || 0, 
      icon: <Building className="text-primary-500" size={24} />,
      path: '/admin/clinics'
    },
    { 
      title: 'Total Coaches', 
      value: dashboardStats?.totalCoachCount || 0, 
      icon: <Users className="text-secondary-500" size={24} />,
      path: '/admin/coaches'
    },
    { 
      title: 'Weekly Activities', 
      value: dashboardStats?.weeklyActivitiesCount || 0, 
      icon: <Activity className="text-purple-500" size={24} />,
      path: '/admin/activities'
    },
  ];
  
  const handleStatClick = (path: string) => {
    navigate(path);
  };
  
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

  // Define an activity icon mapping
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'check_in':
        return <Calendar size={16} className="text-blue-500 mt-1" />;
      case 'clinic_signup':
        return <Building size={16} className="text-green-500 mt-1" />;
      case 'coach_added':
        return <Users size={16} className="text-amber-500 mt-1" />;
      default:
        return <Activity size={16} className="text-gray-500 mt-1" />;
    }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="hover:shadow-md transition-shadow cursor-pointer" 
            onClick={() => handleStatClick(stat.path)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="text-2xl font-bold">
                  <Skeleton className="h-8 w-12" />
                </div>
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Active Clinics</CardTitle>
              <Button onClick={handleManageClinics} variant="outline" size="sm">
                Manage Clinics
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="space-y-2">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-5 w-32" />
                      <div className="flex space-x-4">
                        <Skeleton className="h-5 w-8" />
                        <Skeleton className="h-5 w-8" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isStatsError ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center text-red-500 mb-2">
                    <AlertTriangle size={20} className="mr-2" />
                    <span>Failed to load clinic data</span>
                  </div>
                  <div>
                    <Button 
                      onClick={() => refetchStats()} 
                      variant="outline" 
                      size="sm" 
                      className="ml-2"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : !dashboardStats || dashboardStats.clinicsSummary.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No active clinics found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-sm">
                        <th className="text-left font-medium py-2">Clinic</th>
                        <th className="text-left font-medium py-2">Coaches</th>
                        <th className="text-left font-medium py-2">Clients</th>
                        <th className="text-left font-medium py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardStats.clinicsSummary.map((clinic) => (
                        <tr key={clinic.id} className="border-b hover:bg-gray-50">
                          <td className="py-3">{clinic.name}</td>
                          <td className="py-3">{clinic.coaches}</td>
                          <td className="py-3">{clinic.clients}</td>
                          <td className="py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {clinic.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Recent Activities</CardTitle>
              <Button onClick={handleViewAllActivities} variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingActivities ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <Skeleton className="h-5 w-5 rounded-full mt-1" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isActivitiesError ? (
                <div className="text-center py-4">
                  <div className="inline-flex items-center text-red-500 mb-2">
                    <AlertTriangle size={18} className="mr-2" />
                    <span>Failed to load activities</span>
                  </div>
                  <div>
                    <Button 
                      onClick={() => refetchActivities()} 
                      variant="outline" 
                      size="sm" 
                      className="ml-2"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : !recentActivities || recentActivities.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No recent activities found
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      {getActivityIcon(activity.type)}
                      <div>
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

