
import { supabase } from "@/integrations/supabase/client";
import { Proposal, ProposalFormData } from "../types";

export const getProposals = async (): Promise<Proposal[]> => {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        clients (
          name,
          email,
          address,
          phone
        )
      `);

    if (error) {
      console.error("Error fetching proposals:", error);
      return [];
    }

    // Enhance each proposal with client details directly in the proposal object
    const proposalsWithClientNames = data.map(proposal => ({
      ...proposal,
      client_name: proposal.clients?.name || 'Unknown Client', // Default to 'Unknown Client' if no name
    }));

    return proposalsWithClientNames;
  } catch (error) {
    console.error("Unexpected error fetching proposals:", error);
    return [];
  }
};

export const getProposalById = async (id: string): Promise<Proposal | null> => {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        clients (
          name,
          email,
          address,
          phone
        ),
        items: proposal_items (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching proposal:", error);
      return null;
    }

    // Enhance the proposal with client details directly in the proposal object
    const proposalWithClientName = {
      ...data,
      client_name: data.clients?.name || 'Unknown Client', // Default to 'Unknown Client' if no name
    };

    return proposalWithClientName;
  } catch (error) {
    console.error("Unexpected error fetching proposal:", error);
    return null;
  }
};

export const createProposal = async (proposalData: ProposalFormData): Promise<Proposal | null> => {
  try {
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .upsert(
        {
          name: proposalData.client,
          email: proposalData.email,
          phone: proposalData.phone,  // Ensure phone is included in the client data
          address: proposalData.address
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
      .insert([
        {
          client_id: client.id,
          title: `Proposal for ${proposalData.client}`,
          issue_date: proposalData.proposalDate,
          valid_until: proposalData.expirationDate,
          amount: totalAmount,
          content: proposalData.formattedContent || proposalData.scope,
          status: 'Draft'
        }
      ])
      .select()
      .single();

    if (proposalError) {
      console.error('Error creating proposal:', proposalError);
      throw proposalError;
    }

    // Add proposal items
    const proposalItemsData = proposalData.items.map(item => ({
      proposal_id: proposal.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      type: 'item'
    }));

    if (proposalItemsData.length > 0) {
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
          type: 'scope'
        });
    }

    if (proposalData.timeline) {
      await supabase
        .from('proposal_items')
        .insert({
          proposal_id: proposal.id,
          description: proposalData.timeline,
          type: 'timeline'
        });
    }

    if (proposalData.notes) {
      await supabase
        .from('proposal_items')
        .insert({
          proposal_id: proposal.id,
          description: proposalData.notes,
          type: 'note'
        });
    }

    // Return the created proposal
    return {
      ...proposal,
      client_name: client.name,
      clients: {
        name: client.name,
        email: client.email,
        phone: client.phone, // Ensure phone is included
        address: client.address
      }
    };
  } catch (error) {
    console.error('Error in createProposal:', error);
    return null;
  }
};

export const updateProposal = async ({ id, data }: { id: string, data: ProposalFormData }): Promise<Proposal | null> => {
  try {
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
        phone: data.phone, // Ensure phone is updated
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
    const proposalItemsData = data.items.map(item => ({
      proposal_id: id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      type: 'item'
    }));

    if (proposalItemsData.length > 0) {
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
          type: 'scope'
        });
    }

    if (data.timeline) {
      await supabase
        .from('proposal_items')
        .insert({
          proposal_id: id,
          description: data.timeline,
          type: 'timeline'
        });
    }

    if (data.notes) {
      await supabase
        .from('proposal_items')
        .insert({
          proposal_id: id,
          description: data.notes,
          type: 'note'
        });
    }

    // Return the updated proposal
    return {
      ...proposal,
      client_name: client.name,
      clients: {
        name: client.name,
        email: client.email,
        phone: client.phone, // Ensure phone is included
        address: client.address
      }
    };
  } catch (error) {
    console.error('Error in updateProposal:', error);
    return null;
  }
};

export const deleteProposal = async (id: string): Promise<boolean> => {
  try {
    // Get the proposal to retrieve client_id
    const { data: proposalData, error: proposalError } = await supabase
      .from('proposals')
      .select('client_id')
      .eq('id', id)
      .single();

    if (proposalError) {
      console.error('Error fetching proposal for deletion:', proposalError);
      return false;
    }

    // Delete proposal_items associated with the proposal
    const { error: deleteItemsError } = await supabase
      .from('proposal_items')
      .delete()
      .eq('proposal_id', id);

    if (deleteItemsError) {
      console.error('Error deleting proposal items:', deleteItemsError);
      return false;
    }

    // Delete the proposal
    const { error: deleteProposalError } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id);

    if (deleteProposalError) {
      console.error('Error deleting proposal:', deleteProposalError);
      return false;
    }

    // Delete the client (assuming no other proposals are linked to this client)
    const { error: deleteClientError } = await supabase
      .from('clients')
      .delete()
      .eq('id', proposalData.client_id);

    if (deleteClientError) {
      console.error('Error deleting client:', deleteClientError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteProposal:', error);
    return false;
  }
};
