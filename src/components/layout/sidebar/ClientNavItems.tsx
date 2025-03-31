
import React from "react";
import {
  Home,
  CalendarCheck,
  BarChart3,
  Package,
  MessageSquare,
  BookOpen,
  UserCircle,
} from "lucide-react";
import { NavItem } from "./AdminNavItems";

export const clientNavItems: NavItem[] = [
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
