
import { supabase } from "@/integrations/supabase/client";
import { Proposal, ProposalFormData } from "../../types";

export const updateProposal = async ({ id, data }: { id: string, data: ProposalFormData }): Promise<Proposal | null> => {
  try {
    // Get the current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      throw new Error('Authentication error: ' + sessionError.message);
    }
    
    if (!sessionData?.session?.user?.id) {
      console.error('No authenticated user found');
      throw new Error('No authenticated user found');
    }
    
    // First, get the current proposal to access the client_id
    const { data: currentProposal, error: fetchError } = await supabase
      .from('proposals')
      .select('client_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching current proposal:', fetchError);
      throw fetchError;
    }

    // Update client information
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .update({
        name: data.client,
        email: data.email,
        phone: data.phone,
        address: data.address
      })
      .eq('id', currentProposal.client_id)
      .select('id, name, email, phone, address')
      .single();

    if (clientError) {
      console.error('Error updating client:', clientError);
      throw clientError;
    }

    // Calculate total amount from items
    const totalAmount = data.items.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice),
      0
    );

    // Update the proposal
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .update({
        title: `Proposal for ${data.client}`,
        issue_date: data.proposalDate,
        valid_until: data.expirationDate,
        amount: totalAmount,
        content: data.formattedContent || data.scope,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (proposalError) {
      console.error('Error updating proposal:', proposalError);
      throw proposalError;
    }

    // Delete all existing items for this proposal
    const { error: deleteError } = await supabase
      .from('proposal_items')
      .delete()
      .eq('proposal_id', id);

    if (deleteError) {
      console.error('Error deleting existing items:', deleteError);
      throw deleteError;
    }

    // Re-add all items
    if (data.items.length > 0) {
      const proposalItemsData = data.items.map(item => ({
        proposal_id: id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        type: 'item' as const
      }));

      const { error: itemsError } = await supabase
        .from('proposal_items')
        .insert(proposalItemsData);

      if (itemsError) {
        console.error('Error adding proposal items:', itemsError);
        throw itemsError;
      }
    }

    // Add scope and timeline as separate items for better organization
    if (data.scope) {
      await supabase
        .from('proposal_items')
        .insert({
          proposal_id: id,
          description: data.scope,
          type: 'scope' as const
        });
    }

    if (data.timeline) {
      await supabase
        .from('proposal_items')
        .insert({
          proposal_id: id,
          description: data.timeline,
          type: 'timeline' as const
        });
    }

    if (data.notes) {
      await supabase
        .from('proposal_items')
        .insert({
          proposal_id: id,
          description: data.notes,
          type: 'note' as const
        });
    }

    // Return the updated proposal with client info
    return {
      ...proposal,
      client_name: client.name,
      clients: {
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address
      }
    };
  } catch (error) {
    console.error('Error in updateProposal:', error);
    throw error;
  }
};
