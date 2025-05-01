
import { useQuery } from "@tanstack/react-query";
import { getProposals, getProposalById } from "../api/proposalApi";

export function useProposalQueries() {
  const proposalsQuery = useQuery({
    queryKey: ["proposals"],
    queryFn: getProposals,
    // Retry configuration to handle authentication issues
    retry: (failureCount, error) => {
      console.log("Retrying proposals query, attempt:", failureCount, "Error:", error);
      // Only retry a few times to avoid infinite loops
      return failureCount < 3;
    },
    // Keep staleTime at 0 to ensure fresh data
    staleTime: 0,
    // Always refetch when window is focused
    refetchOnWindowFocus: true,
    // Always refetch when component mounts
    refetchOnMount: "always",
    // Set a shorter cache time
    gcTime: 1000 * 60 * 5, // 5 minutes
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
