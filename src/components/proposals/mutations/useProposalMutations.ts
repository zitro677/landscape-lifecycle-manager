
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProposal, updateProposal } from "../api/proposalApi";
import { ProposalFormData } from "../types";

export function useProposalMutations() {
  const queryClient = useQueryClient();

  // For creating a proposal
  const createProposalMutation = useMutation({
    mutationFn: createProposal,
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["proposals"] });
      }
    },
    onError: (error: any) => {
      console.error("Proposal creation error:", error);
      throw error;
    }
  });

  // For updating a proposal
  const updateProposalMutation = useMutation({
    mutationFn: updateProposal,
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["proposals"] });
      }
    },
    onError: (error: any) => {
      console.error("Proposal update error:", error);
      throw error;
    }
  });

  return {
    createProposal: createProposalMutation.mutateAsync,
    updateProposalMutation,
    isPending: createProposalMutation.isPending || updateProposalMutation.isPending,
  };
}
