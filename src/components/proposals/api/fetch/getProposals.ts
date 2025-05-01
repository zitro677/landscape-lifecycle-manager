
import { supabase } from "@/integrations/supabase/client";
import { Proposal } from "../../types";
import { toast } from "sonner";

export const getProposals = async (): Promise<Proposal[]> => {
  try {
    // Get the current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      throw new Error("Authentication error: " + sessionError.message);
    }
    
    if (!sessionData?.session?.user?.id) {
      console.error("No authenticated user found");
      toast.error("You need to be logged in to view proposals");
      throw new Error("User not authenticated");
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
