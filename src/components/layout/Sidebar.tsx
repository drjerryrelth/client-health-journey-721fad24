
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { BookMarked, Menu, Shield, User, Users, Building, X, Home, FileCheck, BarChart3 } from "lucide-react";
import SidebarNav from "./sidebar/SidebarNav";
import SidebarProfile from "./sidebar/SidebarProfile";
import { adminNavItems, clinicAdminNavItems } from "./sidebar/AdminNavItems";
import { coachNavItems } from "./sidebar/CoachNavItems";
import { clientNavItems } from "./sidebar/ClientNavItems";
import { UserRole } from "@/types";
import { toast } from 'sonner';
import { NavItem } from "./sidebar/AdminNavItems";

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isMobile = false, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  // CRITICAL SECURITY CHECK: Determine nav items based on strict role checking
  let navItems = clientNavItems; // Default fallback
  let userRole: UserRole = user.role;
  let displayRoleText: string = userRole;
  let roleIcon = User;
  
  // Strict role-based navigation
  if (user.role === 'admin' || user.role === 'super_admin') {
    navItems = adminNavItems;
    displayRoleText = user.role === 'super_admin' ? 'Super Admin' : 'System Admin';
    roleIcon = Shield;
  } else if (user.role === 'clinic_admin') {
    navItems = clinicAdminNavItems; // Clinic admin gets a more limited set of navigation items
    displayRoleText = 'Clinic Admin';
    roleIcon = Building;
    
    // Emergency redirect if a clinic admin somehow accesses a system admin route
    // This is a critical security measure
    if (location.pathname.includes('/admin/clinics') || 
        location.pathname.includes('/admin/admin-users')) {
      console.error('SECURITY VIOLATION: Clinic admin attempting to access system admin route:', location.pathname);
      toast.error("You don't have permission to access this page");
      // Force a redirect
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 10);
    }
  } else if (user.role === 'coach') {
    navItems = coachNavItems;
    displayRoleText = 'Coach';
    roleIcon = Users;
  } else if (user.role === 'client') {
    navItems = clientNavItems;
    displayRoleText = 'Client';
    roleIcon = User;
  } else {
    displayRoleText = 'Unknown Role';
    console.error('Unknown user role detected:', user.role);
  }
  
  console.log("Sidebar user info:", {
    role: user.role,
    clinicId: user.clinicId,
    displayRoleText,
    name: user.name
  });

  const handleLogout = () => {
    // Additional logging before logout
    console.log("User logging out:", {
      name: user.name,
      role: user.role,
      clinicId: user.clinicId
    });
    
    // Perform logout
    logout();
    
    // Show feedback toast
    toast.success("Logged out successfully");
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen border-r bg-background",
        isMobile ? "fixed inset-y-0 left-0 z-50 w-72" : "w-72",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <Link to="/" className="flex items-center gap-2">
          <BookMarked className="h-6 w-6 text-primary" />
          <span className="font-semibold">Client Health Tracker™</span>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <SidebarNav items={navItems} onClose={isMobile ? onClose : undefined} />
      <SidebarProfile 
        user={user} 
        onLogout={handleLogout} 
        userRole={displayRoleText}
        roleIcon={roleIcon}
      />
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      {open && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden">
          <Sidebar isMobile onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
