
import React from 'react';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Calendar, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import ClientList from '@/components/clients/ClientList';
import RecentCheckIns from '@/components/check-ins/RecentCheckIns';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock statistics
  const stats = [
    { title: 'Total Clients', value: 24, icon: <Users className="text-primary-500" size={24} />, path: '/coach/clients' },
    { title: 'Active Programs', value: 3, icon: <List className="text-secondary-500" size={24} />, path: '/coach/programs' },
    { title: 'Today\'s Check-ins', value: 8, icon: <Calendar className="text-orange-500" size={24} />, path: '/coach/check-ins' },
    { title: 'Avg. Progress Rate', value: '67%', icon: <Activity className="text-purple-500" size={24} />, path: '/coach/reports' },
  ];
  
  const handleStatClick = (path: string) => {
    navigate(path);
  };
  
  const handleViewAllClients = () => {
    navigate('/coach/clients');
  };
  
  const handleViewAllCheckIns = () => {
    navigate('/coach/check-ins');
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coach Dashboard</h1>
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
              <CardTitle className="text-lg">Recent Clients</CardTitle>
              <Button onClick={handleViewAllClients} variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <ClientList limit={5} />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Recent Check-ins</CardTitle>
              <Button onClick={handleViewAllCheckIns} variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <RecentCheckIns limit={5} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
