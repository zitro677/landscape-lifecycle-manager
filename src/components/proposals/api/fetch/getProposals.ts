
import { supabase } from "@/integrations/supabase/client";
import { Proposal } from "../../types";

export const getProposals = async (): Promise<Proposal[]> => {
  try {
    // Get the current user session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session?.user?.id) {
      console.error("No authenticated user found");
      return [];
    }
    
    const userId = sessionData.session.user.id;
    console.log('Fetching proposals for user:', userId);
    
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        clients!client_id (
          name,
          email,
          address,
          phone
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching proposals:", error);
      return [];
    }

    console.log('Fetched proposals:', data);

    // Enhance each proposal with client details directly in the proposal object
    const proposalsWithClientNames = data.map(proposal => ({
      ...proposal,
      client_name: proposal.clients?.name || 'Unknown Client', // Default to 'Unknown Client' if no name
    }));

    console.log('Processed proposals with client names:', proposalsWithClientNames);
    return proposalsWithClientNames as Proposal[];
  } catch (error) {
    console.error("Unexpected error fetching proposals:", error);
    return [];
  }
};
