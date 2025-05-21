
import React from "react";
import { LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarSignOutProps {
  onSignOut: () => Promise<void>;
  isAdmin: boolean;
}

const SidebarSignOut: React.FC<SidebarSignOutProps> = ({ onSignOut, isAdmin }) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 px-3 space-y-2">
      {isAdmin && (
        <div className="flex items-center text-xs text-muted-foreground px-2 py-1">
          <Shield className="h-3 w-3 mr-1" />
          Administrator Access
        </div>
      )}
      <Button
        variant="ghost"
        className="w-full justify-start text-muted-foreground hover:text-current"
        onClick={onSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};

export default SidebarSignOut;
