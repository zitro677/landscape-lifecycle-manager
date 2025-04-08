
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { formSchema } from "./formSchema";
import { useInvoiceClients } from "./hooks/useInvoiceClients";
import { useInvoiceItems } from "./hooks/useInvoiceItems";
import { useInvoiceCalculations } from "./hooks/useInvoiceCalculations";
import { useInvoiceSubmission } from "./hooks/useInvoiceSubmission";

export const useInvoiceForm = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const defaultDueDate = format(
    new Date(new Date().setDate(new Date().getDate() + 30)),
    "yyyy-MM-dd"
  );

  const form = useForm<any>({
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

  const { clients, isLoading: clientsLoading, handleClientChange } = useInvoiceClients(form);
  const { items, addItem, removeItem } = useInvoiceItems(form);
  const { subtotal, tax, total } = useInvoiceCalculations(items);
  const { onSubmit, isLoading: submissionLoading, authError } = useInvoiceSubmission(form);

  const isLoading = clientsLoading || submissionLoading;

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
