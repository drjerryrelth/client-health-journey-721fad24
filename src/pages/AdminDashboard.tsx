import React from 'react';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Calendar, Building, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock statistics for admin with navigation paths
  const stats = [
    { 
      title: 'Total Coaches', 
      value: 8, 
      icon: <Users className="text-primary-500" size={24} />,
      path: '/clinics'  // This now directs to clinics for coach management
    },
    { 
      title: 'Total Clients', 
      value: 24, 
      icon: <User className="text-secondary-500" size={24} />,
      path: '/clients'
    },
    { 
      title: 'Active Clinics', 
      value: 3, 
      icon: <Building className="text-orange-500" size={24} />,
      path: '/clinics'
    },
    { 
      title: 'Weekly Check-ins', 
      value: 52, 
      icon: <Calendar className="text-purple-500" size={24} />,
      path: '/check-ins'
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
    toast({
      title: "Coming Soon",
      description: "The activities page is under development",
    });
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}!</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              <div className="text-2xl font-bold">{stat.value}</div>
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
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3">Wellness Center</td>
                      <td className="py-3">4</td>
                      <td className="py-3">18</td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3">Practice Naturals</td>
                      <td className="py-3">3</td>
                      <td className="py-3">12</td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3">Health Partners</td>
                      <td className="py-3">2</td>
                      <td className="py-3">9</td>
                      <td className="py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Activity size={16} className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Coach Lisa added 2 new clients</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Activity size={16} className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">New clinic registered: Wellness Center</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Activity size={16} className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Coach Michael created a new program</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
