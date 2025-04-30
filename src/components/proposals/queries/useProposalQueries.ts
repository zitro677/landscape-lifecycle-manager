
import { useQuery } from "@tanstack/react-query";
import { getProposals, getProposalById } from "../api/proposalApi";

export function useProposalQueries() {
  const proposalsQuery = useQuery({
    queryKey: ["proposals"],
    queryFn: getProposals,
    // Retry configuration to handle authentication issues
    retry: (failureCount, error) => {
      // Only retry a few times to avoid infinite loops
      return failureCount < 3;
    }
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
