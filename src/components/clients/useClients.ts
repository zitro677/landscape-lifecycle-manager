import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Client {
  id: string;
  name: string;
  email?: string;
  address?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

// Type for creating a new client
export interface NewClientData {
  name: string; // Name is required
  email?: string;
  address?: string;
  phone?: string;
}

export const useClients = () => {
  const queryClient = useQueryClient();

  // Fetch all clients with error handling for recursion issues
  const { 
    data: clients = [], // Default to empty array if no data 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      try {
        // Try the standard query first
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .order("name");

        if (error) {
          // Log the error for debugging
          console.error("Error fetching clients:", error);
          
          // If there's a recursion error related to user_roles, try a more direct approach
          if (error.code === "42P17" && error.message.includes("user_roles")) {
            console.log("Detected recursion error, trying alternative fetch method");
            
            // Get the current user to use their ID directly
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
              throw new Error("User not authenticated");
            }
            
            // Try a simpler query without involving user_roles policies
            const { data: directData, error: directError } = await supabase
              .from("clients")
              .select("id, name, email, phone, address, created_at, updated_at")
              .eq("user_id", user.id)
              .order("name");
              
            if (directError) {
              console.error("Error in alternative client fetch:", directError);
              throw directError;
            }
            
            return directData as Client[];
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

  // Fetch a single client
  const fetchClient = async (id: string) => {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching client:", error);
      toast.error("Failed to load client details");
      throw error;
    }

    return data as Client;
  };

  // Create a new client
  const createClient = useMutation({
    mutationFn: async (client: NewClientData) => {
      // Get the user ID from the auth state
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User is not authenticated");
      }

      const { data, error } = await supabase
        .from("clients")
        .insert({
          ...client,
          user_id: user.id // Add the user_id from the authenticated user
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating client:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client created successfully");
    },
    onError: () => {
      toast.error("Failed to create client");
    },
  });

  // Update a client
  const updateClient = useMutation({
    mutationFn: async ({ id, ...clientData }: { id: string } & NewClientData) => {
      const { data, error } = await supabase
        .from("clients")
        .update(clientData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating client:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client updated successfully");
    },
    onError: () => {
      toast.error("Failed to update client");
    },
  });

  // Delete a client
  const deleteClient = async (id: string) => {
    try {
      // Check if client is used in invoices
      const { data: invoices, error: invoiceError } = await supabase
        .from("invoices")
        .select("id")
        .eq("client_id", id);

      if (invoiceError) {
        throw invoiceError;
      }

      if (invoices && invoices.length > 0) {
        toast.error("Cannot delete client that has associated invoices");
        return;
      }

      // Delete the client
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client deleted successfully");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client");
    }
  };

  return {
    clients: clients || [],
    isLoading,
    error,
    fetchClient,
    createClient,
    updateClient,
    deleteClient,
    refetch, // Expose the refetch function
  };
};
