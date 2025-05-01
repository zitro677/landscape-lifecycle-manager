
import { useProposalQueries } from "./queries/useProposalQueries";
import { useAuth } from "@/components/auth/AuthProvider";

export function useProposals() {
  const { user } = useAuth();
  const queryResult = useProposalQueries();
  
  // Log authentication state and proposals data
  console.log("useProposals hook called - Auth state:", user ? "Authenticated" : "Not authenticated");
  console.log("useProposals hook called - User ID:", user?.id);
  console.log("useProposals returned proposals:", queryResult.proposals?.length || 0);
  
  if (queryResult.proposals?.length) {
    console.log("Sample proposal:", queryResult.proposals[0]);
  }
  
  return queryResult;
}
