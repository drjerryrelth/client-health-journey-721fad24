
import React from 'react';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, Building, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useDashboardStats, useRecentActivities } from '@/hooks/use-dashboard-stats';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { 
    data: dashboardStats, 
    isLoading: isLoadingStats, 
    error: statsError 
  } = useDashboardStats();
  
  const { 
    data: recentActivities, 
    isLoading: isLoadingActivities
  } = useRecentActivities(3); // Limit to 3 for the dashboard
  
  // Updated statistics with different navigation paths
  const stats = [
    { 
      title: 'Active Clinics', 
      value: dashboardStats?.activeClinicCount || 0, 
      icon: <Building className="text-primary-500" size={24} />,
      path: '/clinics'
    },
    { 
      title: 'Total Coaches', 
      value: dashboardStats?.totalCoachCount || 0, 
      icon: <Users className="text-secondary-500" size={24} />,
      path: '/coaches'
    },
    { 
      title: 'Weekly Activities', 
      value: dashboardStats?.weeklyActivitiesCount || 0, 
      icon: <Activity className="text-purple-500" size={24} />,
      path: '/activities'
    },
  ];
  
  const handleStatClick = (path: string) => {
    navigate(path);
  };
  
  const handleManageClinics = () => {
    navigate("/clinics");
  };
  
  const handleViewAllActivities = () => {
    navigate("/activities");
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}!</p>
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
                <div className="text-2xl font-bold text-gray-300 animate-pulse">
                  Loading...
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
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : statsError ? (
                <div className="text-center py-8 text-red-500">
                  Failed to load clinic data
                </div>
              ) : dashboardStats?.clinicsSummary.length === 0 ? (
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
                      {dashboardStats?.clinicsSummary.map((clinic) => (
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
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : recentActivities?.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No recent activities found
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities?.slice(0, 3).map((activity) => (
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
