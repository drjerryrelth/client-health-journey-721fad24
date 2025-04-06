
import React from "react";
import {
  Home,
  Users,
  CalendarCheck,
  BarChart3,
  BookOpen,
  ClipboardList,
  Settings,
} from "lucide-react";
import { NavItem } from "./AdminNavItems";

export const coachNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/coach/dashboard",
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
