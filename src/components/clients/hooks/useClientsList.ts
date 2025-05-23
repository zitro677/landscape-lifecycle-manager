
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Client } from "../types";

// Fetch all clients
export const useClientsList = () => {
  const { 
    data: clients = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      try {
        // Get the current user session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error("No authenticated user");
        }

        // Direct query using user ID to avoid recursion issues
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("user_id", session.user.id)
          .order("name");

        if (error) {
          // Check for recursion error and try alternate approach
          if (error.message.includes("infinite recursion")) {
            console.log("Detected recursion error, using alternate query approach");
            
            // Simplified query without joins
            const { data: altData, error: altError } = await supabase
              .from("clients")
              .select("id, name, email, phone, address, created_at, updated_at")
              .eq("user_id", session.user.id)
              .order("name");
              
            if (altError) {
              throw altError;
            }
            
            return altData as Client[];
          }
          
          throw error;
        }

        return data as Client[];
      } catch (err) {
        console.error("Client fetch error:", err);
        toast.error("Failed to load clients");
        throw err;
      }
    },
  });

  return {
    clients: clients || [],
    isLoading,
    error,
    refetch,
  };
};
