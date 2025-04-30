
import { useQuery } from "@tanstack/react-query";
import { getProposals, getProposalById } from "../api/proposalApi";

export function useProposalQueries() {
  const proposalsQuery = useQuery({
    queryKey: ["proposals"],
    queryFn: getProposals,
  });

  return {
    proposals: proposalsQuery.data || [],
    isLoading: proposalsQuery.isLoading,
    isError: proposalsQuery.isError,
    error: proposalsQuery.error,
    refetch: proposalsQuery.refetch,
  };
}

export { getProposalById };
