
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema, InvoiceItemType } from "../formSchema";

export const useInvoiceItems = (form: UseFormReturn<z.infer<typeof formSchema>>) => {
  const items = form.watch("items") as InvoiceItemType[];

  const addItem = () => {
    form.setValue("items", [
      ...form.getValues("items"),
      { description: "", quantity: 1, unitPrice: 0 } as InvoiceItemType,
    ]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length > 1) {
      form.setValue(
        "items",
        currentItems.filter((_, i) => i !== index) as InvoiceItemType[]
      );
    }
  };

  return { items, addItem, removeItem };
};
