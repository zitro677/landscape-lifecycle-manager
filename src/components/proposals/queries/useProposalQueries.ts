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
    },
    // Keep staleTime at 0 to ensure fresh data
    staleTime: 0,
    // Always refetch when window is focused
    refetchOnWindowFocus: true,
    // Add refetchOnMount to ensure data is fetched when component mounts
    refetchOnMount: true
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
