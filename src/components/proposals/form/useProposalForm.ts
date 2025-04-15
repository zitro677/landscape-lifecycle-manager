
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { z } from "zod";
import { proposalFormSchema, ProposalItemType } from "./formSchema";
import { ProposalFormData } from "../types";
import { useProposals } from "../useProposals";
import { useNavigate } from "react-router-dom";

export const useProposalForm = () => {
  const navigate = useNavigate();
  const { createProposal, isPending } = useProposals();
  const today = format(new Date(), "yyyy-MM-dd");
  const defaultExpirationDate = format(
    new Date(new Date().setDate(new Date().getDate() + 30)),
    "yyyy-MM-dd"
  );

  // Initialize form with default values that match the schema types
  const form = useForm<z.infer<typeof proposalFormSchema>>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      client: "",
      email: "",
      address: "",
      proposalDate: today,
      expirationDate: defaultExpirationDate,
      items: [
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
        } as ProposalItemType,
      ],
      scope: "",
      timeline: "",
      notes: "",
    },
  });

  const items = form.watch("items");
  
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const taxRate = 0.07; // 7% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const addItem = () => {
    form.setValue("items", [
      ...form.getValues("items"),
      { description: "", quantity: 1, unitPrice: 0 } as ProposalItemType,
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

  const onSubmit = async (values: z.infer<typeof proposalFormSchema>) => {
    const proposalData: ProposalFormData = {
      client: values.client,
      email: values.email,
      address: values.address,
      proposalDate: values.proposalDate,
      expirationDate: values.expirationDate,
      items: values.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      })),
      scope: values.scope,
      timeline: values.timeline,
      notes: values.notes
    };
    
    await createProposal(proposalData);
    navigate("/proposals");
  };

  return {
    form,
    items,
    subtotal,
    tax,
    total,
    addItem,
    removeItem,
    onSubmit,
    isPending
  };
};

