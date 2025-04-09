
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

export const useClients = () => {
  const queryClient = useQueryClient();

  // Fetch all clients
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching clients:", error);
        toast.error("Failed to load clients");
        throw error;
      }

      return data as Client[];
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
    mutationFn: async (client: Omit<Client, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("clients")
        .insert(client)
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
    mutationFn: async ({ id, ...client }: Client) => {
      const { data, error } = await supabase
        .from("clients")
        .update(client)
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
    clients,
    isLoading,
    error,
    fetchClient,
    createClient,
    updateClient,
    deleteClient,
  };
};
