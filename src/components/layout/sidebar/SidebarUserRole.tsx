
import React from "react";

interface SidebarUserRoleProps {
  userRole: string | null;
  isAdmin: boolean;
}

const SidebarUserRole: React.FC<SidebarUserRoleProps> = ({ userRole, isAdmin }) => {
  if (!userRole) return null;

  return (
    <div className="mt-6 px-3">
      <div className="rounded-md bg-primary/10 px-3 py-2">
        <p className="text-xs font-medium">Logged in as:</p>
        <p className="text-sm">{isAdmin ? 'Administrator' : 'Read-Only User'}</p>
      </div>
    </div>
  );
};

export default SidebarUserRole;
