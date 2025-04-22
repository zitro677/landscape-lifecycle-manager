
import { useQuery } from "@tanstack/react-query";
import { fetchProposals, getProposalById } from "../api/proposalApi";

export function useProposalQueries() {
  const proposalsQuery = useQuery({
    queryKey: ["proposals"],
    queryFn: fetchProposals,
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
