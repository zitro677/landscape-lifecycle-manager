
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { z } from "zod";
import { proposalFormSchema, ProposalItemType } from "./formSchema";
import { Proposal, ProposalFormData } from "../types";
import { useProposals } from "../useProposals";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const useProposalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { createProposal, updateProposal, getProposalById, isPending } = useProposals();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(id ? true : false);
  
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

  // Effect to load existing proposal data if editing
  useEffect(() => {
    const loadProposal = async () => {
      if (!id) return;
      
      setIsEditMode(true);
      setIsLoading(true);
      
      try {
        const proposal = await getProposalById(id);
        
        if (proposal) {
          console.log("Loaded proposal for editing:", proposal);
          
          // Extract proposal items
          const items = proposal.items?.map(item => ({
            description: item.description || "",
            quantity: item.quantity || 1,
            unitPrice: item.unit_price || 0
          } as ProposalItemType)) || [];
          
          // If no items found, add a default empty one
          if (items.length === 0) {
            items.push({
              description: "",
              quantity: 1,
              unitPrice: 0
            } as ProposalItemType);
          }
          
          // Set form values
          form.reset({
            client: proposal.client_name || proposal.title?.replace("Proposal for ", "") || "",
            email: proposal.clients?.email || "",
            address: proposal.clients?.address || "",
            proposalDate: proposal.issue_date || today,
            expirationDate: proposal.valid_until || defaultExpirationDate,
            items: items,
            scope: proposal.scope || "",
            timeline: proposal.timeline || "",
            notes: proposal.notes || ""
          });
        } else {
          console.error("Proposal not found:", id);
          navigate("/proposals");
        }
      } catch (error) {
        console.error("Error loading proposal:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProposal();
  }, [id, navigate, form, getProposalById]);

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
    
    // Format the content to include section markers for proper parsing later
    let formattedContent = values.scope;
    
    if (values.timeline && values.timeline.trim()) {
      formattedContent += `\n\nTimeline: ${values.timeline}`;
    }
    
    if (values.items && values.items.length > 0) {
      formattedContent += "\n\nItems:";
      values.items.forEach(item => {
        formattedContent += `\n- ${item.description}: ${item.quantity} x $${item.unitPrice.toFixed(2)}`;
      });
    }
    
    if (values.notes && values.notes.trim()) {
      formattedContent += `\n\nNotes: ${values.notes}`;
    }
    
    // Update proposal content with the formatted string
    proposalData.formattedContent = formattedContent;
    
    if (isEditMode && id) {
      await updateProposal(id, proposalData);
    } else {
      await createProposal(proposalData);
    }
    
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
    isPending,
    isEditMode,
    isLoading
  };
};
