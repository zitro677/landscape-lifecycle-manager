import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Invoice, InvoiceItem, InvoiceStatus } from "./types";
import { toast } from "sonner";

// Fetch all invoices
export const useInvoices = () => {
  const result = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      try {
        // First try the standard query
        const { data: invoices, error } = await supabase
          .from("invoices")
          .select(`
            *,
            clients (
              name,
              email,
              address
            ),
            items:invoice_items(*)
          `)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching invoices:", error);
          
          // If there's a recursion error related to user_roles, try a more direct approach
          if (error.code === "42P17" && error.message.includes("user_roles")) {
            console.log("Detected recursion error, trying alternative fetch method for invoices");
            
            // Get the current user to use their ID directly
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
              throw new Error("User not authenticated");
            }
            
            // Try a simpler query without joining tables that might trigger the recursion
            const { data: directData, error: directError } = await supabase
              .from("invoices")
              .select("*")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false });
              
            if (directError) {
              console.error("Error in alternative invoice fetch:", directError);
              throw directError;
            }
            
            // Fetch clients data separately
            const { data: clientsData } = await supabase
              .from("clients")
              .select("id, name, email, address");
            
            // Fetch invoice items separately
            const { data: itemsData } = await supabase
              .from("invoice_items")
              .select("*");
            
            // Manually join the data
            const enhancedInvoices = directData.map(invoice => {
              const client = clientsData?.find(c => c.id === invoice.client_id);
              const items = itemsData?.filter(item => item.invoice_id === invoice.id);
              
              return {
                ...invoice,
                client_name: client?.name || "Unknown Client",
                clients: client || null,
                items: items || [],
              };
            });
            
            return enhancedInvoices as Invoice[];
          }
          
          throw error;
        }

        // Format invoices data
        return invoices.map((invoice) => ({
          ...invoice,
          client_name: invoice.clients?.name || "Unknown Client",
          // Format date strings for display
          issue_date: invoice.issue_date,
          due_date: invoice.due_date,
          // Format amount for display
          amount: invoice.amount,
        })) as Invoice[];
      } catch (err) {
        console.error("Invoice fetch error:", err);
        throw err;
      }
    },
  });

  return {
    invoices: result.data || [],
    isLoading: result.isLoading,
    error: result.error,
    refetch: result.refetch
  };
};

// Fetch a single invoice with its items
export const useInvoice = (id: string | undefined) => {
  return useQuery({
    queryKey: ["invoices", id],
    queryFn: async () => {
      if (!id) return null;

      try {
        const { data: invoice, error } = await supabase
          .from("invoices")
          .select(`
            *,
            clients (
              name,
              email,
              address
            ),
            items:invoice_items(*)
          `)
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching invoice:", error);
          
          // If recursion error, try alternative approach
          if (error.code === "42P17" && error.message.includes("user_roles")) {
            console.log("Detected recursion error, trying alternative fetch method for single invoice");
            
            // Get invoice without joins
            const { data: invoiceData, error: invoiceError } = await supabase
              .from("invoices")
              .select("*")
              .eq("id", id)
              .single();
              
            if (invoiceError) throw invoiceError;
            
            // Get client data separately
            const { data: clientData } = await supabase
              .from("clients")
              .select("name, email, address")
              .eq("id", invoiceData.client_id)
              .single();
              
            // Get items separately
            const { data: itemsData } = await supabase
              .from("invoice_items")
              .select("*")
              .eq("invoice_id", id);
              
            // Combine the data
            return {
              ...invoiceData,
              clients: clientData || null,
              items: itemsData || [],
              client_name: clientData?.name || "Unknown Client"
            } as Invoice;
          }
          
          throw error;
        }

        return invoice as Invoice;
      } catch (err) {
        console.error("Error in useInvoice:", err);
        throw err;
      }
    },
    enabled: !!id,
  });
};

// Create a new invoice
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      invoice,
      items,
    }: {
      invoice: Omit<Invoice, "id" | "created_at" | "updated_at" | "items">;
      items: Omit<InvoiceItem, "id" | "invoice_id" | "created_at" | "updated_at">[];
    }) => {
      // 1. Insert the invoice
      const { data: newInvoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert(invoice)
        .select()
        .single();

      if (invoiceError) {
        throw invoiceError;
      }

      // 2. Insert the invoice items
      if (items.length > 0) {
        const itemsWithInvoiceId = items.map((item) => ({
          ...item,
          invoice_id: newInvoice.id,
        }));

        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(itemsWithInvoiceId);

        if (itemsError) {
          throw itemsError;
        }
      }

      return newInvoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice created successfully");
    },
    onError: (error) => {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    },
  });
};

// Update an existing invoice
export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      invoice,
      items,
    }: {
      id: string;
      invoice: Partial<Invoice>;
      items: Omit<InvoiceItem, "id" | "invoice_id" | "created_at" | "updated_at">[];
    }) => {
      // 1. Update the invoice
      const { data: updatedInvoice, error: invoiceError } = await supabase
        .from("invoices")
        .update({
          ...invoice,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

      if (invoiceError) {
        throw invoiceError;
      }

      // 2. Delete existing items for this invoice
      const { error: deleteError } = await supabase
        .from("invoice_items")
        .delete()
        .eq("invoice_id", id);

      if (deleteError) {
        throw deleteError;
      }

      // 3. Insert the new invoice items
      if (items.length > 0) {
        const itemsWithInvoiceId = items.map((item) => ({
          ...item,
          invoice_id: id,
        }));

        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(itemsWithInvoiceId);

        if (itemsError) {
          throw itemsError;
        }
      }

      return updatedInvoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice updated successfully");
    },
    onError: (error) => {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update invoice");
    },
  });
};

// Update an invoice status
export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: InvoiceStatus }) => {
      const { data, error } = await supabase
        .from("invoices")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice status updated");
    },
    onError: (error) => {
      console.error("Error updating invoice status:", error);
      toast.error("Failed to update invoice status");
    },
  });
};

// Delete an invoice
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("invoices").delete().eq("id", id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    },
  });
};
