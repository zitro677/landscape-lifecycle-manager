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

  // Log the raw data for debugging
  console.log("useProposalQueries - Raw Query Result:", proposalsQuery);
  console.log("useProposalQueries - Proposals Data:", proposalsQuery.data);
  console.log("useProposalQueries - Is Loading:", proposalsQuery.isLoading);
  console.log("useProposalQueries - Is Error:", proposalsQuery.isError);
  
  if (proposalsQuery.isError) {
    console.error("useProposalQueries - Error:", proposalsQuery.error);
  }

  return {
    proposals: proposalsQuery.data || [],
    isLoading: proposalsQuery.isLoading,
    isError: proposalsQuery.isError,
    error: proposalsQuery.error,
    refetch: proposalsQuery.refetch,
    isSuccess: proposalsQuery.isSuccess,
    status: proposalsQuery.status,
  };
}

export { getProposalById };
