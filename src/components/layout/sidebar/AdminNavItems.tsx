
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
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
  Palette,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

// Full admin access to everything
export const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Clients",
    href: "/admin/clients",
    icon: Users,
  },
  {
    title: "Clinics",
    href: "/admin/clinics",
    icon: Building,
  },
  {
    title: "Coaches",
    href: "/admin/coaches",
    icon: User,
  },
  {
    title: "Programs",
    href: "/admin/programs",
    icon: Package,
  },
  {
    title: "Check-ins",
    href: "/admin/check-ins",
    icon: CalendarCheck,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Activities",
    href: "/admin/activities",
    icon: Activity,
  },
  {
    title: "Resources",
    href: "/admin/resources",
    icon: BookOpen,
  },
  {
    title: "Clinic Customization",
    href: "/admin/clinic-customization",
    icon: Palette,
  },
  {
    title: "Meal Plan Generator",
    href: "/admin/meal-plan-generator",
    icon: ClipboardList,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

// Clinic admin has limited access - no access to all clinics
export const clinicAdminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Clients",
    href: "/admin/clients",
    icon: Users,
  },
  {
    title: "Coaches",
    href: "/admin/coaches",
    icon: User,
  },
  {
    title: "Programs",
    href: "/admin/programs",
    icon: Package,
  },
  {
    title: "Check-ins",
    href: "/admin/check-ins",
    icon: CalendarCheck,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Activities",
    href: "/admin/activities",
    icon: Activity,
  },
  {
    title: "Resources",
    href: "/admin/resources",
    icon: BookOpen,
  },
  {
    title: "Clinic Customization",
    href: "/admin/clinic-customization",
    icon: Palette,
  },
  {
    title: "Meal Plan Generator",
    href: "/admin/meal-plan-generator",
    icon: ClipboardList,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];
