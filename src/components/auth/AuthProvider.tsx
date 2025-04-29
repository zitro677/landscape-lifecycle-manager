
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'read_only';
  created_at: string;
}

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: 'admin' | 'read_only' | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  updateUserRole: (userId: string, role: 'admin' | 'read_only') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<'admin' | 'read_only' | null>(null);

  // Function to fetch user role
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      if (data) {
        setUserRole(data.role);
        console.log('User role set:', data.role);
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
    }
  };

  useEffect(() => {
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Fetch user role when session changes
        if (currentSession?.user) {
          fetchUserRole(currentSession.user.id);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
        
        // Show toast message for auth events
        if (event === 'SIGNED_IN') {
          toast.success("Signed in successfully");
        } else if (event === 'SIGNED_OUT') {
          toast.info("Signed out");
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Current session:", currentSession);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Fetch user role if there's an existing session
      if (currentSession?.user) {
        fetchUserRole(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        userRole,
        isAdmin: userRole === 'admin',
        signOut,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
