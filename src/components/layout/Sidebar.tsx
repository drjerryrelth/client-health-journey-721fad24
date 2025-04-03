
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { BookMarked, Menu, X } from "lucide-react";
import SidebarNav from "./sidebar/SidebarNav";
import SidebarProfile from "./sidebar/SidebarProfile";
import { adminNavItems, clinicAdminNavItems } from "./sidebar/AdminNavItems";
import { coachNavItems } from "./sidebar/CoachNavItems";
import { clientNavItems } from "./sidebar/ClientNavItems";
import { UserRole } from "@/types";
import { toast } from 'sonner';

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isMobile = false, onClose }: SidebarProps) {
  const { user, hasRole, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  let navItems = clientNavItems;
  let userRole: UserRole = user.role;
  
  // Use a separate variable for display text that doesn't need to conform to UserRole type
  let displayRoleText: string = userRole;
  
  // FIXED: Strict separation of role-based navigation
  if (user.role === 'admin' || user.role === 'super_admin') {
    navItems = adminNavItems;
    displayRoleText = user.role === 'super_admin' ? 'Super Admin' : 'System Admin';
  } else if (user.role === 'clinic_admin') {
    navItems = clinicAdminNavItems;
    
    // Extra protection: If clinic admin somehow gets to a system-admin only route, block it
    if (location.pathname.includes('/admin/clinics') || 
        location.pathname.includes('/admin/admin-users')) {
      toast.error("You don't have permission to access this page");
      window.location.href = '/admin/dashboard';
    }
    
    displayRoleText = 'Clinic Admin';
  } else if (user.role === 'coach') {
    navItems = coachNavItems;
    displayRoleText = 'Coach';
  } else {
    displayRoleText = 'Client';
  }
  
  console.log("Sidebar user info:", {
    role: user.role,
    clinicId: user.clinicId,
    displayRoleText
  });

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
        onLogout={logout} 
        userRole={displayRoleText}
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
