
import React from "react";

interface SidebarUserRoleProps {
  userRole: string | null;
  isAdmin: boolean;
}

const SidebarUserRole: React.FC<SidebarUserRoleProps> = ({ userRole, isAdmin }) => {
  if (!userRole) return null;

  // Format the role for display - convert from snake_case to Title Case
  const formattedRole = userRole === 'read_only' ? 'Read-Only' : 'Administrator';

  return (
    <div className="mt-6 px-3">
      <div className="rounded-md bg-primary/10 px-3 py-2">
        <p className="text-xs font-medium">Logged in as:</p>
        <p className="text-sm font-semibold">{formattedRole}</p>
        {isAdmin && (
          <p className="text-xs text-muted-foreground mt-1">
            You can view and manage all data
          </p>
        )}
      </div>
    </div>
  );
};

export default SidebarUserRole;
