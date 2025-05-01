
import { supabase } from "@/integrations/supabase/client";
import { Proposal } from "../../types";
import { toast } from "sonner";
import { getAuthenticatedUserId } from "../utils/sessionUtils";

export const getProposals = async (): Promise<Proposal[]> => {
  try {
    // Use the utility function to get authenticated user ID
    const userId = await getAuthenticatedUserId();
    
    console.log('Fetching proposals for user:', userId);
    
    // Fix the query to avoid duplicates - use distinct on id
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        clients:client_id (
          name,
          email,
          address,
          phone
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching proposals:", error);
      throw error;
    }

    console.log('Fetched proposals count:', data?.length);
    
    if (data && data.length > 0) {
      console.log('Sample proposal data:', data[0]);
    } else {
      console.log('No proposals found for user');
    }

    // Enhance each proposal with client details directly in the proposal object
    // Ensure we're handling the proposal data correctly
    const proposalsWithClientNames = data ? data.map(proposal => ({
      ...proposal,
      client_name: proposal.clients?.name || 'Unknown Client', 
    })) : [];

    return proposalsWithClientNames as Proposal[];
  } catch (error) {
    console.error("Unexpected error fetching proposals:", error);
    throw error; // Re-throw the error so it can be handled by the query
  }
};
