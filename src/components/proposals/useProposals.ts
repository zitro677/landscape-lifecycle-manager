
import { useProposalQueries } from "./queries/useProposalQueries";

export function useProposals() {
  const queryResult = useProposalQueries();
  
  // Log the number of proposals retrieved
  console.log("useProposals hook called, returned proposals:", queryResult.proposals?.length || 0);
  console.log("Raw proposals data:", queryResult.proposals);
  
  return queryResult;
}
