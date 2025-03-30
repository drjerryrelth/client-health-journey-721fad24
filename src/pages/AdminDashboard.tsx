
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Calendar, Building, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import CoachList from '@/components/coaches/CoachList';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Mock statistics for admin
  const stats = [
    { title: 'Total Coaches', value: 8, icon: <Users className="text-primary-500" size={24} /> },
    { title: 'Total Clients', value: 24, icon: <User className="text-secondary-500" size={24} /> },
    { title: 'Active Clinics', value: 3, icon: <Building className="text-orange-500" size={24} /> },
    { title: 'Weekly Check-ins', value: 52, icon: <Calendar className="text-purple-500" size={24} /> },
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}!</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index}>
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
              <CardTitle className="text-lg">Active Coaches</CardTitle>
              <Link to="/coaches">
                <Button variant="outline" size="sm">Manage Coaches</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <CoachList limit={5} />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Recent Activities</CardTitle>
              <Link to="/activities">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
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
