
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProposal, updateProposal } from "../api/proposalApi";
import { ProposalFormData } from "../types";
import { toast } from "sonner";

export function useProposalMutations() {
  const queryClient = useQueryClient();

  // For creating a proposal
  const createProposalMutation = useMutation({
    mutationFn: createProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Proposal created successfully");
    },
    onError: (error: any) => {
      toast.error("Error creating proposal: " + (error.message || "An unexpected error occurred"));
    }
  });

  // For updating a proposal
  const updateProposalMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProposalFormData }) => {
      return updateProposal(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Proposal updated successfully");
    },
    onError: (error: any) => {
      toast.error("Error updating proposal: " + (error.message || "An unexpected error occurred"));
    }
  });

  return {
    createProposal: createProposalMutation.mutate,
    updateProposalMutation,
    isPending: createProposalMutation.isPending || updateProposalMutation.isPending,
  };
}
