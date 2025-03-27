
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Invoice, InvoiceItem, InvoiceStatus } from "./types";
import { toast } from "sonner";

// Fetch all invoices
export const useInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data: invoices, error } = await supabase
        .from("invoices")
        .select(`
          *,
          clients (
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching invoices:", error);
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
    },
  });
};

// Fetch a single invoice with its items
export const useInvoice = (id: string | undefined) => {
  return useQuery({
    queryKey: ["invoices", id],
    queryFn: async () => {
      if (!id) return null;

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
        throw error;
      }

      return invoice as unknown as Invoice & { items: InvoiceItem[] };
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
      invoice: Omit<Invoice, "id" | "created_at" | "updated_at">;
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
