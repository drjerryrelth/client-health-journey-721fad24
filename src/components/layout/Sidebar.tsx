
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, User, Calendar, Home, FileText, 
  Activity, List, Settings, Weight, PlusCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const { user, hasRole } = useAuth();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = React.useState(isMobile);

  // Update collapsed state when screen size changes
  React.useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const isAdmin = hasRole(['admin', 'coach']);
  const isClient = hasRole('client');

  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Clients', path: '/clients', icon: <Users size={20} /> },
    { name: 'Programs', path: '/programs', icon: <List size={20} /> },
    { name: 'Check-ins', path: '/check-ins', icon: <Calendar size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const clientLinks = [
    { name: 'Dashboard', path: '/client-dashboard', icon: <Home size={20} /> },
    { name: 'Check-in', path: '/check-in', icon: <Calendar size={20} /> },
    { name: 'Progress', path: '/progress', icon: <Activity size={20} /> },
    { name: 'My Program', path: '/my-program', icon: <List size={20} /> },
    { name: 'My Profile', path: '/profile', icon: <User size={20} /> },
  ];

  const links = isAdmin ? adminLinks : clientLinks;

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
        
        {isAdmin && (
          <div className="p-4 border-t border-gray-200">
            <NavLink
              to="/add-client"
              className={cn(
                "flex items-center px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors",
                collapsed ? "justify-center" : "space-x-2"
              )}
            >
              <PlusCircle size={20} />
              {!collapsed && <span>Add Client</span>}
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
