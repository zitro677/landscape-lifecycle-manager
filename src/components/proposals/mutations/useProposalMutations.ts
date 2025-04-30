
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProposal, updateProposal } from "../api/proposalApi";
import { ProposalFormData } from "../types";
import { toast } from "sonner";

export function useProposalMutations() {
  const queryClient = useQueryClient();

  // For creating a proposal
  const createProposalMutation = useMutation({
    mutationFn: createProposal,
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["proposals"] });
        toast.success("Proposal created successfully");
      } else {
        toast.error("Failed to create proposal, please try again");
      }
    },
    onError: (error: any) => {
      toast.error("Error creating proposal: " + (error.message || "An unexpected error occurred"));
    }
  });

  // For updating a proposal - fixed to match the updated API
  const updateProposalMutation = useMutation({
    mutationFn: updateProposal,
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["proposals"] });
        toast.success("Proposal updated successfully");
      } else {
        toast.error("Failed to update proposal, please try again");
      }
    },
    onError: (error: any) => {
      toast.error("Error updating proposal: " + (error.message || "An unexpected error occurred"));
    }
  });

  return {
    createProposal: createProposalMutation.mutateAsync,
    updateProposalMutation,
    isPending: createProposalMutation.isPending || updateProposalMutation.isPending,
  };
}
