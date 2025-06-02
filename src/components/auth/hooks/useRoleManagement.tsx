
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

export type UserRole = 'admin' | 'read_only' | null;

export const useRoleManagement = (user: User | null) => {
  const [userRole, setUserRole] = useState<UserRole>(null);

  // Function to fetch user role using the security definer function
  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching user role for:", userId);
      
      // Use the security definer function to get role without triggering RLS
      const { data, error } = await supabase
        .rpc('get_current_user_role');

      if (error) {
        console.error('Error fetching user role with RPC:', error);
        // Fallback: set as read_only if there's an error
        setUserRole('read_only');
        return;
      }

      console.log('User role from RPC:', data);
      setUserRole(data as UserRole);
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      // Fallback: set as read_only if there's an error
      setUserRole('read_only');
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchUserRole(user.id);
    } else {
      setUserRole(null);
    }
  }, [user]);

  // Function to update user role
  const updateUserRole = async (userId: string, role: 'admin' | 'read_only'): Promise<boolean> => {
    try {
      // Check if the current user is an admin
      if (userRole !== 'admin') {
        toast.error("Only administrators can update user roles");
        return false;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role })
        .select();

      if (error) {
        console.error("Error updating user role:", error);
        toast.error("Failed to update user role");
        return false;
      }

      toast.success(`User role updated to ${role}`);
      
      // If updating the current user's role, update the local state
      if (userId === user?.id) {
        setUserRole(role);
      }
      
      return true;
    } catch (error) {
      console.error("Error in updateUserRole:", error);
      toast.error("An unexpected error occurred");
      return false;
    }
  };

  return {
    userRole,
    isAdmin: userRole === 'admin',
    updateUserRole
  };
};
