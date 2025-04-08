
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCreateInvoice } from "../useInvoices";
import { formSchema, InvoiceFormValues } from "./formSchema";

export const useInvoiceForm = () => {
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");
  const defaultDueDate = format(
    new Date(new Date().setDate(new Date().getDate() + 30)),
    "yyyy-MM-dd"
  );
  const createInvoice = useCreateInvoice();
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const [authError, setAuthError] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: "",
      client: "",
      email: "",
      address: "",
      invoiceDate: today,
      dueDate: defaultDueDate,
      items: [
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
      notes: "",
    },
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching clients...");
        
        const { data, error } = await supabase
          .from("clients")
          .select("id, name, email, address");

        if (error) {
          console.error("Error fetching clients:", error);
          toast.error("Error loading clients");
          return;
        }

        console.log("Clients loaded:", data);
        setClients(data || []);
      } catch (err) {
        console.error("Exception fetching clients:", err);
        toast.error("Failed to load clients");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const items = form.watch("items");
  
  const subtotal = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );
  const taxRate = 0.07; // 7% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleClientChange = async (clientId: string) => {
    try {
      console.log("Client selected:", clientId);
      form.setValue("client_id", clientId, { shouldValidate: true });
      
      // Find the client in our already loaded clients array
      const selectedClient = clients.find(client => client.id === clientId);
      
      if (selectedClient) {
        console.log("Client details:", selectedClient);
        form.setValue("client", selectedClient.name, { shouldValidate: true });
        form.setValue("email", selectedClient.email || "", { shouldValidate: true });
        form.setValue("address", selectedClient.address || "", { shouldValidate: true });
      } else {
        // Fallback to fetching from database if not found in local array
        const { data, error } = await supabase
          .from("clients")
          .select("name, email, address")
          .eq("id", clientId)
          .single();

        if (error) {
          console.error("Error fetching client details:", error);
          toast.error("Error loading client details");
          return;
        }

        if (data) {
          console.log("Client details from DB:", data);
          form.setValue("client", data.name, { shouldValidate: true });
          form.setValue("email", data.email || "", { shouldValidate: true });
          form.setValue("address", data.address || "", { shouldValidate: true });
        }
      }
    } catch (err) {
      console.error("Error in handleClientChange:", err);
      toast.error("Failed to load client details");
    }
  };

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `INV-${year}-${randomPart}`;
  };

  const onSubmit = async (values: InvoiceFormValues) => {
    setIsLoading(true);
    
    try {
      // Check if user is authenticated
      if (!user) {
        console.error("User is not authenticated");
        setAuthError(true);
        setIsLoading(false);
        return;
      }
      
      const totalAmount = values.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );
      
      const invoiceData = {
        user_id: user.id,
        client_id: values.client_id,
        project_id: null,
        proposal_id: null,
        invoice_number: generateInvoiceNumber(),
        issue_date: values.invoiceDate,
        due_date: values.dueDate,
        amount: totalAmount,
        tax_rate: taxRate,
        notes: values.notes,
        status: "Pending",
      };
      
      console.log("Submitting invoice:", invoiceData);
      
      const invoiceItems = values.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      }));
      
      await createInvoice.mutateAsync({
        invoice: invoiceData,
        items: invoiceItems,
      });
      
      toast.success("Invoice created successfully");
      navigate("/invoices");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    form.setValue("items", [
      ...form.getValues("items"),
      { description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length > 1) {
      form.setValue(
        "items",
        currentItems.filter((_, i) => i !== index)
      );
    }
  };

  return {
    form,
    clients,
    isLoading,
    authError,
    items,
    subtotal,
    tax,
    total,
    handleClientChange,
    onSubmit,
    addItem,
    removeItem,
  };
};
