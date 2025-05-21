
import React from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/badge";

const SidebarHeader: React.FC = () => {
  const { isAdmin } = useAuth();
  
  return (
    <div className="flex h-16 items-center justify-between border-b px-4">
      <div className="flex items-center space-x-2">
        <h2 className="text-lg font-semibold">Landscape Irrigation</h2>
        {isAdmin && (
          <Badge variant="outline" className="bg-primary/10 text-xs">
            Admin
          </Badge>
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
