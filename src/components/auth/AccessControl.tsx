
import React from "react";
import { useAuth } from "./AuthProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

type UserRole = 'admin' | 'read_only';

interface AccessControlProps {
  requiredRole: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AccessControl: React.FC<AccessControlProps> = ({
  requiredRole,
  children,
  fallback,
}) => {
  const { userRole, loading } = useAuth();
  
  // While loading, don't render anything
  if (loading) {
    return null;
  }

  // If no role is set, user is not authenticated
  if (!userRole) {
    return fallback || (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertDescription>
          You must be logged in to view this content.
        </AlertDescription>
      </Alert>
    );
  }

  // For admin role, always grant access
  if (userRole === 'admin') {
    return <>{children}</>;
  }

  // For read_only role, check if the required role is also read_only
  if (userRole === 'read_only' && requiredRole === 'read_only') {
    return <>{children}</>;
  }

  // User doesn't have sufficient privileges
  return fallback || (
    <Alert variant="destructive">
      <ShieldAlert className="h-4 w-4" />
      <AlertDescription>
        You don't have permission to access this content.
      </AlertDescription>
    </Alert>
  );
};

export default AccessControl;
