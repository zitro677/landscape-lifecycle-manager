
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

export type UserRole = 'admin' | 'read_only' | null;

export const useRoleManagement = (user: User | null) => {
  const [userRole, setUserRole] = useState<UserRole>(null);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching user role for:", userId);

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole('read_only');
        return;
      }

      console.log('User role fetched:', data.role);
      setUserRole(data.role as UserRole);
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
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

  const updateUserRole = async (userId: string, role: 'admin' | 'read_only'): Promise<boolean> => {
    try {
      if (userRole !== 'admin') {
        toast.error("Only administrators can update user roles");
        return false;
      }

      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role })
        .select();

      if (error) {
        console.error("Error updating user role:", error);
        toast.error("Failed to update user role");
        return false;
      }

      toast.success(`User role updated to ${role}`);
      
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
