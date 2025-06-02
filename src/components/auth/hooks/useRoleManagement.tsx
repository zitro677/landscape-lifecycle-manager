
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

export type UserRole = 'admin' | 'read_only' | null;

export const useRoleManagement = (user: User | null) => {
  const [userRole, setUserRole] = useState<UserRole>(null);

  // Function to fetch user role - now using direct query since RLS is fixed
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
        // For specific users, ensure they get admin role
        if (user?.email === 'greenplanetlandscaping01@gmail.com' || user?.email === 'zitro677.lo87@gmail.com') {
          console.log('Setting admin role for recognized user:', user.email);
          const adminSuccess = await ensureAdminRole(userId);
          if (adminSuccess) {
            setUserRole('admin');
            return;
          }
        }
        // Set as read_only if no role found or error occurs
        setUserRole('read_only');
        return;
      }

      console.log('User role fetched:', data.role);
      setUserRole(data.role as UserRole);
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      // Fallback: set as read_only if there's an error
      setUserRole('read_only');
    }
  };

  // Function to ensure admin role for specific users
  const ensureAdminRole = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role: 'admin' 
        })
        .select();

      if (error) {
        console.error("Error ensuring admin role:", error);
        return false;
      }

      console.log("Admin role ensured for user:", userId);
      return true;
    } catch (error) {
      console.error("Error in ensureAdminRole:", error);
      return false;
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
