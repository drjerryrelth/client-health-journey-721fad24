
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

export const adminNavItems: NavItem[] = [
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
    title: "Clinic Customization",
    href: "/clinic-customization",
    icon: Palette,
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
