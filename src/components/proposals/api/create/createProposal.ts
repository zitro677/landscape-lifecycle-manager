
import { supabase } from "@/integrations/supabase/client";
import { Proposal, ProposalFormData, ProposalStatus } from "../../types";

export const createProposal = async (proposalData: ProposalFormData): Promise<Proposal | null> => {
  try {
    // Get the current user session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session?.user?.id) {
      throw new Error('No authenticated user found');
    }
    
    const user_id = sessionData.session.user.id;
    
    // Create or update the client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .upsert(
        {
          name: proposalData.client,
          email: proposalData.email,
          phone: proposalData.phone,
          address: proposalData.address,
          user_id: user_id
        },
        { onConflict: 'email' }
      )
      .select('id, name, email, phone, address')
      .single();

    if (clientError) {
      console.error('Error creating client:', clientError);
      throw clientError;
    }

    // Calculate total amount from items
    const totalAmount = proposalData.items.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice),
      0
    );

    // Create the proposal with client information
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .insert({
        client_id: client.id,
        title: `Proposal for ${proposalData.client}`,
        issue_date: proposalData.proposalDate,
        valid_until: proposalData.expirationDate,
        amount: totalAmount,
        content: proposalData.formattedContent || proposalData.scope,
        status: 'Draft' as ProposalStatus,
        user_id: user_id
      })
      .select()
      .single();

    if (proposalError) {
      console.error('Error creating proposal:', proposalError);
      throw proposalError;
    }

    // Add proposal items
    if (proposalData.items.length > 0) {
      const proposalItemsData = proposalData.items.map(item => ({
        proposal_id: proposal.id,
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
      }
    }

    // Add scope and timeline as separate items for better organization
    if (proposalData.scope) {
      await supabase
        .from('proposal_items')
        .insert({
          proposal_id: proposal.id,
          description: proposalData.scope,
          type: 'scope' as const
        });
    }

    if (proposalData.timeline) {
      await supabase
        .from('proposal_items')
        .insert({
          proposal_id: proposal.id,
          description: proposalData.timeline,
          type: 'timeline' as const
        });
    }

    if (proposalData.notes) {
      await supabase
        .from('proposal_items')
        .insert({
          proposal_id: proposal.id,
          description: proposalData.notes,
          type: 'note' as const
        });
    }

    // Return the created proposal
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
    console.error('Error in createProposal:', error);
    return null;
  }
};
