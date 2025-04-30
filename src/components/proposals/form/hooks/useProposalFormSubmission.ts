
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { proposalFormSchema } from "../formSchema";
import { ProposalFormData } from "../../types";
import { toast } from "sonner";
import { useProposalMutations } from "../../mutations/useProposalMutations";
import { useNavigate } from "react-router-dom";

export function useProposalFormSubmission(
  form: UseFormReturn<z.infer<typeof proposalFormSchema>>,
  isEditMode: boolean,
  id?: string
) {
  const navigate = useNavigate();
  const { createProposal, updateProposalMutation, isPending } = useProposalMutations();

  const onSubmit = async (values: z.infer<typeof proposalFormSchema>) => {
    try {
      const proposalData: ProposalFormData = {
        client: values.client,
        email: values.email,
        phone: values.phone,
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
      
      console.log("Submitting proposal data:", proposalData);
      
      if (isEditMode && id) {
        await updateProposalMutation.mutateAsync({ id, data: proposalData });
        toast.success("Proposal updated successfully");
      } else {
        await createProposal(proposalData);
        toast.success("Proposal created successfully");
      }
      
      navigate("/proposals");
    } catch (error: any) {
      console.error("Error in form submission:", error);
      toast.error(`Error creating proposal: ${error.message || "Unknown error"}`);
    }
  };

  return {
    onSubmit,
    isPending
  };
}
