
import { useProposalMutations } from "./mutations/useProposalMutations";
import { useProposalQueries, getProposalById } from "./queries/useProposalQueries";

export const useProposals = () => {
  const {
    proposals,
    isLoading,
    isError,
    error,
    refetch,
  } = useProposalQueries();

  const {
    createProposal,
    updateProposalMutation,
    isPending,
  } = useProposalMutations();

  return {
    proposals,
    isLoading,
    isError,
    error,
    createProposal,
    updateProposal: updateProposalMutation.mutateAsync,
    getProposalById,
    isPending,
    refetch,
  };
};
