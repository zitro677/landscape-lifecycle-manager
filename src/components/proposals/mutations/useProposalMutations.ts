
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
        // Force an immediate refetch of the proposals
        queryClient.invalidateQueries({ queryKey: ["proposals"] });
        // Also invalidate dashboard data if it exists
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        
        toast.success("Proposal created successfully");
        console.log("Proposal created successfully:", data);
        
        // Force an immediate refetch
        setTimeout(() => {
          queryClient.refetchQueries({ queryKey: ["proposals"] });
        }, 300);
      }
    },
    onError: (error: any) => {
      console.error("Proposal creation error:", error);
      toast.error(`Error creating proposal: ${error.message || "Unknown error"}`);
      throw error;
    }
  });

  // For updating a proposal
  const updateProposalMutation = useMutation({
    mutationFn: updateProposal,
    onSuccess: (data) => {
      if (data) {
        // Force an immediate refetch of the proposals
        queryClient.invalidateQueries({ queryKey: ["proposals"] });
        // Also invalidate dashboard data if it exists
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        
        toast.success("Proposal updated successfully");
        console.log("Proposal updated successfully:", data);
        
        // Force an immediate refetch
        setTimeout(() => {
          queryClient.refetchQueries({ queryKey: ["proposals"] });
        }, 300);
      }
    },
    onError: (error: any) => {
      console.error("Proposal update error:", error);
      toast.error(`Error updating proposal: ${error.message || "Unknown error"}`);
      throw error;
    }
  });

  return {
    createProposal: createProposalMutation.mutateAsync,
    updateProposalMutation,
    isPending: createProposalMutation.isPending || updateProposalMutation.isPending,
  };
}
