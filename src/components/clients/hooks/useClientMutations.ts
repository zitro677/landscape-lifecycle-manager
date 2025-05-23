
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NewClientData } from "../types";

// Client mutations (create, update, delete)
export const useClientMutations = () => {
  const queryClient = useQueryClient();
  
  // Create a new client
  const useCreateClient = () => {
    return useMutation({
      mutationFn: async (client: NewClientData) => {
        // Get the user ID from the auth state
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          throw new Error("User is not authenticated");
        }

        const { data, error } = await supabase
          .from("clients")
          .insert({
            ...client,
            user_id: session.user.id // Add the user_id from the authenticated user
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
  };

  // Update a client
  const useUpdateClient = () => {
    return useMutation({
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
  };

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
    useCreateClient,
    useUpdateClient,
    deleteClient
  };
};
