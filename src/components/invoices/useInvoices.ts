
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Invoice } from "./types";

export const useInvoices = () => {
  const { 
    data: invoices = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      try {
        // Get the current session for the user ID
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error("No authenticated user session");
        }

        try {
          // Standard query with joins
          const { data, error } = await supabase
            .from("invoices")
            .select(`
              *,
              clients!client_id (
                name,
                email
              )
            `)
            .eq('user_id', session.user.id)
            .order("issue_date", { ascending: false });

          if (error) {
            throw error;
          }

          return data.map((invoice: any) => ({
            ...invoice,
            client_name: invoice.clients?.name || "Unknown Client",
          })) as Invoice[];

        } catch (error: any) {
          // If recursion error, try a simpler approach
          if (error.message && error.message.includes('infinite recursion')) {
            console.log("Detected recursion error in invoices, using alternate query");

            // Get invoices directly without joins
            const { data: invoicesData, error: invoicesError } = await supabase
              .from("invoices")
              .select("*")
              .eq('user_id', session.user.id)
              .order("issue_date", { ascending: false });

            if (invoicesError) {
              throw invoicesError;
            }

            // If we have invoices with client IDs, get the clients separately
            if (invoicesData && invoicesData.length > 0) {
              const clientIds = invoicesData
                .filter(inv => inv.client_id)
                .map(inv => inv.client_id);

              if (clientIds.length > 0) {
                const { data: clientsData, error: clientsError } = await supabase
                  .from('clients')
                  .select('id, name')
                  .in('id', clientIds);

                if (clientsError) {
                  console.error("Error fetching client data for invoices:", clientsError);
                }

                // Map client names to invoices
                return invoicesData.map((invoice: any) => {
                  const client = clientsData?.find(c => c.id === invoice.client_id);
                  return {
                    ...invoice,
                    client_name: client?.name || 'Unknown Client',
                  };
                }) as Invoice[];
              }
            }

            // If no client IDs or no clients data, just return invoices
            return (invoicesData || []).map((invoice: any) => ({
              ...invoice,
              client_name: 'Unknown Client',
            })) as Invoice[];
          } else {
            // For other errors, just propagate
            throw error;
          }
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        toast.error("Failed to load invoices");
        throw err;
      }
    },
  });

  return {
    invoices: invoices || [],
    isLoading,
    error,
    refetch,
  };
};

// Add individual invoice query function
export const useInvoice = (invoiceId?: string) => {
  return useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: async () => {
      if (!invoiceId) return null;
      
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error("No authenticated user session");
        }

        // First try to get the invoice with client info
        try {
          const { data, error } = await supabase
            .from("invoices")
            .select(`
              *,
              clients!client_id (
                name,
                email,
                address
              ),
              items:invoice_items(*)
            `)
            .eq('id', invoiceId)
            .eq('user_id', session.user.id)
            .single();

          if (error) throw error;
          return data;
        } catch (error: any) {
          // If recursion error or any other error, try a simpler approach
          console.log("Using alternate query approach for single invoice");
          
          // Get invoice without joins
          const { data: invoice, error: invoiceError } = await supabase
            .from("invoices")
            .select("*")
            .eq('id', invoiceId)
            .eq('user_id', session.user.id)
            .single();
            
          if (invoiceError) throw invoiceError;
          
          // Get client separately if needed
          if (invoice.client_id) {
            const { data: client, error: clientError } = await supabase
              .from('clients')
              .select('*')
              .eq('id', invoice.client_id)
              .single();
              
            if (!clientError && client) {
              invoice.clients = client;
            }
          }
          
          // Get invoice items
          const { data: items, error: itemsError } = await supabase
            .from('invoice_items')
            .select('*')
            .eq('invoice_id', invoiceId);
            
          if (!itemsError && items) {
            invoice.items = items;
          }
          
          return invoice;
        }
      } catch (err) {
        console.error("Error fetching invoice:", err);
        toast.error("Failed to load invoice");
        throw err;
      }
    },
    enabled: !!invoiceId,
  });
};

// Create invoice mutation
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      invoice, 
      items 
    }: { 
      invoice: Partial<Invoice>; 
      items: Array<{ description: string; quantity: number; unit_price: number }>;
    }) => {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No authenticated user session");
      }
      
      // Insert the invoice
      const { data, error } = await supabase
        .from("invoices")
        .insert(invoice)
        .select()
        .single();
        
      if (error) throw error;
      
      // Insert invoice items
      if (items && items.length > 0) {
        const invoiceItems = items.map(item => ({
          invoice_id: data.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }));
        
        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(invoiceItems);
          
        if (itemsError) {
          console.error("Error creating invoice items:", itemsError);
          throw itemsError;
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

// Update invoice mutation
export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      invoice, 
      items 
    }: { 
      id: string; 
      invoice: Partial<Invoice>; 
      items: Array<{ description: string; quantity: number; unit_price: number }>;
    }) => {
      // Update invoice
      const { data, error } = await supabase
        .from("invoices")
        .update(invoice)
        .eq("id", id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Delete existing invoice items
      const { error: deleteError } = await supabase
        .from("invoice_items")
        .delete()
        .eq("invoice_id", id);
        
      if (deleteError) throw deleteError;
      
      // Insert new invoice items
      if (items && items.length > 0) {
        const invoiceItems = items.map(item => ({
          invoice_id: id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }));
        
        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(invoiceItems);
          
        if (itemsError) throw itemsError;
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", variables.id] });
    },
  });
};

// Update invoice status mutation
export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("invoices")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

// Delete invoice mutation
export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // First delete associated invoice items
      const { error: itemsError } = await supabase
        .from("invoice_items")
        .delete()
        .eq("invoice_id", id);
        
      if (itemsError) throw itemsError;
      
      // Then delete the invoice
      const { error } = await supabase
        .from("invoices")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};
