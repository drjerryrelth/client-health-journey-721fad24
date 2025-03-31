
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavItem } from "./AdminNavItems";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarNavProps {
  items: NavItem[];
  onClose?: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ items, onClose }) => {
  const location = useLocation();

  return (
    <ScrollArea className="flex-1 py-2">
      <nav className="grid gap-1 px-2">
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            onClick={onClose}
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
  );
};

export default SidebarNav;
