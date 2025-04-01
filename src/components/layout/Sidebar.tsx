
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { BookMarked, Menu, X } from "lucide-react";
import SidebarNav from "./sidebar/SidebarNav";
import SidebarProfile from "./sidebar/SidebarProfile";
import { adminNavItems, clinicAdminNavItems } from "./sidebar/AdminNavItems";
import { coachNavItems } from "./sidebar/CoachNavItems";
import { clientNavItems } from "./sidebar/ClientNavItems";

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isMobile = false, onClose }: SidebarProps) {
  const { user, hasRole, logout } = useAuth();

  if (!user) return null;

  let navItems = clientNavItems;

  // Determine if this is a clinic admin (admin with clinicId)
  const isClinicAdmin = user.role === 'admin' && user.clinicId !== undefined;
  const isSystemAdmin = (user.role === 'admin' && !user.clinicId) || user.role === 'super_admin';
  
  if (isSystemAdmin) {
    navItems = adminNavItems;
  } else if (isClinicAdmin) {
    navItems = clinicAdminNavItems;
  } else if (hasRole("coach")) {
    navItems = coachNavItems;
  }

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
        userRole={isClinicAdmin ? "Clinic Admin" : user.role}
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
