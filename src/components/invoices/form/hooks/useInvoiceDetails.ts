import { format, addDays } from "date-fns";
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../formSchema";
import { generateSequentialNumber } from "@/lib/generateSequentialNumber";

type PaymentTerm = {
  value: string;
  label: string;
  days: number;
};

export const useInvoiceDetails = (form: UseFormReturn<z.infer<typeof formSchema>>) => {
  const [selectedTerm, setSelectedTerm] = useState<string>("net30");

  const paymentTerms: PaymentTerm[] = [
    { value: "net15", label: "Net 15", days: 15 },
    { value: "net30", label: "Net 30", days: 30 },
    { value: "net60", label: "Net 60", days: 60 },
    { value: "dueOnReceipt", label: "Due on Receipt", days: 0 },
  ];

  const [invoiceNumber, setInvoiceNumber] = useState<string>("");

  useEffect(() => {
    generateSequentialNumber("invoices", "INV", "invoice_number").then(setInvoiceNumber);
  }, []);

  const updateDueDate = (termValue: string) => {
    const selectedTermOption = paymentTerms.find(term => term.value === termValue);
    if (selectedTermOption) {
      const invoiceDate = form.getValues("invoiceDate");
      const dueDate = format(
        addDays(new Date(invoiceDate), selectedTermOption.days),
        "yyyy-MM-dd"
      );
      form.setValue("dueDate", dueDate, { shouldValidate: true });
      setSelectedTerm(termValue);
    }
  };

  useEffect(() => {
    // Initialize with default term
    updateDueDate(selectedTerm);
  }, [form.watch("invoiceDate")]);

  const handlePaymentTermChange = (value: string) => {
    updateDueDate(value);
  };

  return {
    invoiceNumber,
    paymentTerms,
    selectedTerm,
    handlePaymentTermChange,
  };
};
