
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/auth';
import ClientDashboard from './ClientDashboard';
import ClientMessages from '@/components/client/ClientMessages';
import ClientResources from '@/components/client/ClientResources';
import ClientJournal from '@/components/client/ClientJournal';
import MyProgram from './MyProgram';
import MyProfile from './MyProfile';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, LineChart, Book, MessageSquare, Calendar, FileText } from 'lucide-react';

const ClientPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine which tab should be active based on the current path
  const getDefaultTab = () => {
    if (currentPath.includes('/messages')) return 'messages';
    if (currentPath.includes('/journal')) return 'journal';
    if (currentPath.includes('/resources')) return 'resources';
    if (currentPath.includes('/program')) return 'program';
    if (currentPath.includes('/profile')) return 'profile';
    return 'dashboard';
  };
  
  const handleTabChange = (value: string) => {
    switch (value) {
      case 'dashboard':
        navigate('/client');
        break;
      case 'messages':
        navigate('/client/messages');
        break;
      case 'resources':
        navigate('/client/resources');
        break;
      case 'journal':
        navigate('/client/journal');
        break;
      case 'program':
        navigate('/client/program');
        break;
      case 'profile':
        navigate('/client/profile');
        break;
      default:
        navigate('/client');
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Portal</h1>
        <p className="text-gray-500">Welcome back, {user?.name}!</p>
      </div>

      <Tabs defaultValue={getDefaultTab()} value={getDefaultTab()} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LineChart size={16} />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span>Messages</span>
          </TabsTrigger>
          <TabsTrigger value="program" className="flex items-center gap-2">
            <Book size={16} />
            <span>My Program</span>
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <FileText size={16} />
            <span>Food Journal</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Resources</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span>Profile</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <ClientDashboard />
        </TabsContent>
        
        <TabsContent value="messages">
          <ClientMessages />
        </TabsContent>
        
        <TabsContent value="resources">
          <ClientResources />
        </TabsContent>
        
        <TabsContent value="journal">
          <ClientJournal />
        </TabsContent>
        
        <TabsContent value="program">
          <MyProgram />
        </TabsContent>
        
        <TabsContent value="profile">
          <MyProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientPortal;
