
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, userRole, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const closeSidebar = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsMobileOpen(prev => !prev);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      toast.loading("Signing out...");
      await signOut();
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  }, [signOut, navigate]);

  // Debug logging
  useEffect(() => {
    console.log("useSidebar hook - userRole:", userRole);
    console.log("useSidebar hook - isAdmin:", isAdmin);
  }, [userRole, isAdmin]);

  return {
    isMobileOpen,
    setIsMobileOpen,
    closeSidebar,
    toggleSidebar,
    handleSignOut,
    isAdmin,
    userRole,
    user
  };
}
