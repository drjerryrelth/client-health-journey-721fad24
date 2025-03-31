
import React from "react";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut } from "lucide-react";
import { UserData } from "@/types/auth";

interface SidebarProfileProps {
  user: UserData;
  onLogout: () => Promise<void>;
}

const SidebarProfile: React.FC<SidebarProfileProps> = ({ user, onLogout }) => {
  return (
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
        onClick={onLogout}
      >
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </div>
  );
};

export default SidebarProfile;
