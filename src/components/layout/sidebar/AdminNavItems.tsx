
import {
  BarChart3,
  Building2,
  Calendar,
  ClipboardList,
  Users,
  FileText,
  Settings,
  Activity,
  Folders,
  UserCog,
  Palette,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

// Navigation items for system administrators (admin, super_admin)
// CRITICAL: These items are ONLY for system admins, never clinic admins
export const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart3,
  },
  {
    title: "Clinics",
    href: "/admin/clinics",
    icon: Building2,
  },
  {
    title: "Coaches",
    href: "/admin/coaches",
    icon: Users,
  },
  {
    title: "Clients",
    href: "/admin/clients",
    icon: Users,
  },
  {
    title: "Programs",
    href: "/admin/programs",
    icon: ClipboardList,
  },
  {
    title: "Check-ins",
    href: "/admin/check-ins",
    icon: Calendar,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Activities",
    href: "/admin/activities",
    icon: Activity,
  },
  {
    title: "Resources",
    href: "/admin/resources",
    icon: Folders,
  },
  {
    title: "Clinic Customization",
    href: "/admin/clinic-customization",
    icon: Palette,
  },
  {
    title: "Admin Users",
    href: "/admin/admin-users",
    icon: UserCog,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

// Navigation items for clinic administrators - SPECIFICALLY different from system admins
// IMPORTANT: Clinic admins should NEVER see Clinics or Admin Users
export const clinicAdminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart3,
  },
  {
    title: "Coaches",
    href: "/admin/coaches",
    icon: Users,
  },
  {
    title: "Clients",
    href: "/admin/clients",
    icon: Users,
  },
  {
    title: "Programs",
    href: "/admin/programs",
    icon: ClipboardList,
  },
  {
    title: "Check-ins",
    href: "/admin/check-ins",
    icon: Calendar,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Activities",
    href: "/admin/activities",
    icon: Activity,
  },
  {
    title: "Resources",
    href: "/admin/resources",
    icon: Folders,
  },
  // {
  //   title: "Clinic Customization",
  //   href: "/admin/clinic-customization",
  //   icon: Palette,
  // },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];
