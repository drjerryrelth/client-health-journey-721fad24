import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart3,
  ClipboardList,
  Users,
  Building,
  User,
  Settings,
  Package,
  CalendarCheck,
  FileText,
  Activity,
  BookOpen,
  Home,
  Menu,
  X,
  MessageSquare,
  BookMarked,
  UserCircle,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isMobile = false, onClose }: SidebarProps) {
  const { user, hasRole, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const adminItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Clients",
      href: "/clients",
      icon: Users,
    },
    {
      title: "Clinics",
      href: "/clinics",
      icon: Building,
    },
    {
      title: "Coaches",
      href: "/coaches",
      icon: User,
    },
    {
      title: "Programs",
      href: "/programs",
      icon: Package,
    },
    {
      title: "Check-ins",
      href: "/check-ins",
      icon: CalendarCheck,
    },
    {
      title: "Reports",
      href: "/reports",
      icon: BarChart3,
    },
    {
      title: "Activities",
      href: "/activities",
      icon: Activity,
    },
    {
      title: "Resources",
      href: "/resources",
      icon: BookOpen,
    },
    {
      title: "Meal Plan Generator",
      href: "/meal-plan-generator",
      icon: ClipboardList,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const coachItems = [
    {
      title: "Dashboard",
      href: "/coach-dashboard",
      icon: Home,
    },
    {
      title: "Clients",
      href: "/coach/clients",
      icon: Users,
    },
    {
      title: "Check-ins",
      href: "/coach/check-ins",
      icon: CalendarCheck,
    },
    {
      title: "Reports",
      href: "/coach/reports",
      icon: BarChart3,
    },
    {
      title: "Resources",
      href: "/coach/resources",
      icon: BookOpen,
    },
    {
      title: "Meal Plan Generator",
      href: "/coach/meal-plan-generator",
      icon: ClipboardList,
    },
    {
      title: "Settings",
      href: "/coach/settings",
      icon: Settings,
    },
  ];

  const clientItems = [
    {
      title: "Dashboard",
      href: "/client-dashboard",
      icon: Home,
    },
    {
      title: "Check-in",
      href: "/check-in",
      icon: CalendarCheck,
    },
    {
      title: "Progress",
      href: "/progress",
      icon: BarChart3,
    },
    {
      title: "My Program",
      href: "/my-program",
      icon: Package,
    },
    {
      title: "Messages",
      href: "/client/messages",
      icon: MessageSquare,
    },
    {
      title: "Resources",
      href: "/client/resources",
      icon: BookOpen,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: UserCircle,
    },
  ];

  let navItems = clientItems;

  if (hasRole("admin") || hasRole("super_admin")) {
    navItems = adminItems;
  } else if (hasRole("coach")) {
    navItems = coachItems;
  }

  const handleLogout = async () => {
    await logout();
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
          <span className="font-semibold">Client Health Tracker</span>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                location.pathname === item.href && "bg-accent text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full bg-primary/10 p-1">
            <UserCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
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
