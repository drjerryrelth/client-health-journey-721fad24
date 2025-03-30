
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { 
  Users, User, Calendar, Home, FileText, 
  Activity, List, Settings, Weight, PlusCircle, Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Sidebar = () => {
  const { user, hasRole, logout } = useAuth();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = React.useState(isMobile);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Update collapsed state when screen size changes
  React.useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const isAdmin = hasRole('admin');
  const isCoach = hasRole('coach');
  const isClient = hasRole('client');

  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Clinics', path: '/clinics', icon: <Building size={20} /> },
    { name: 'Clients', path: '/clients', icon: <User size={20} /> },
    { name: 'Programs', path: '/programs', icon: <List size={20} /> },
    { name: 'Check-ins', path: '/check-ins', icon: <Calendar size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const coachLinks = [
    { name: 'Dashboard', path: '/coach-dashboard', icon: <Home size={20} /> },
    { name: 'Clients', path: '/coach/clients', icon: <Users size={20} /> },
    { name: 'Programs', path: '/coach/programs', icon: <List size={20} /> },
    { name: 'Check-ins', path: '/coach/check-ins', icon: <Calendar size={20} /> },
    { name: 'Reports', path: '/coach/reports', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/coach/settings', icon: <Settings size={20} /> },
  ];

  const clientLinks = [
    { name: 'Dashboard', path: '/client-dashboard', icon: <Home size={20} /> },
    { name: 'Check-in', path: '/check-in', icon: <Calendar size={20} /> },
    { name: 'Progress', path: '/progress', icon: <Activity size={20} /> },
    { name: 'My Program', path: '/my-program', icon: <List size={20} /> },
    { name: 'My Profile', path: '/profile', icon: <User size={20} /> },
  ];

  const handleAddClick = () => {
    if (isAdmin) {
      navigate('/add-coach');
      toast({
        title: "Coming Soon",
        description: "The Add Coach feature is under development",
      });
    } else if (isCoach) {
      navigate('/add-client');
      toast({
        title: "Coming Soon",
        description: "The Add Client feature is under development",
      });
    }
  };

  let links = clientLinks; // default
  if (isAdmin) links = adminLinks;
  else if (isCoach) links = coachLinks;

  return (
    <div 
      className={cn(
        "h-full bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary-500 flex items-center justify-center">
                <Weight className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">HealthTracker</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 mx-auto rounded-md bg-primary-500 flex items-center justify-center">
              <Weight className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  isActive 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-700 hover:bg-gray-50",
                  collapsed ? "justify-center" : "space-x-3"
                )}
              >
                <span>{link.icon}</span>
                {!collapsed && <span>{link.name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
        
        {(isAdmin || isCoach) && (
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleAddClick}
              className={cn(
                "flex items-center px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors w-full",
                collapsed ? "justify-center" : "space-x-2"
              )}
            >
              <PlusCircle size={20} />
              {!collapsed && <span>{isAdmin ? "Add Coach" : "Add Client"}</span>}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
