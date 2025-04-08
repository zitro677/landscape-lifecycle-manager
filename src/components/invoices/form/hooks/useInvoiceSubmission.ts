
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCreateInvoice } from "../../useInvoices";
import { formSchema, InvoiceFormValues } from "../formSchema";

export const useInvoiceSubmission = (form: UseFormReturn<z.infer<typeof formSchema>>) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<boolean>(false);
  const createInvoice = useCreateInvoice();

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `INV-${year}-${randomPart}`;
  };

  const onSubmit = async (values: InvoiceFormValues) => {
    setIsLoading(true);
    
    try {
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
        tax_rate: 0.07,  // 7% tax
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

  return { onSubmit, isLoading, authError };
};
