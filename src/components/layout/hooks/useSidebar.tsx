
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

export const useSidebar = () => {
  const { signOut, isAdmin, userRole } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("You have been logged out");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to log out");
    }
  };

  return {
    isAdmin,
    userRole,
    handleSignOut,
  };
};
