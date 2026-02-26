
import { supabase } from "@/integrations/supabase/client";
import { Proposal, ProposalFormData } from "../../types";
import { getAuthenticatedUserId } from "../utils/sessionUtils";
import { updateClient } from "../create/clientOperations";
import { calculateTotalAmount } from "../create/proposalCreation";
import { addProposalLineItems } from "../create/proposalItemOperations";

export const updateProposal = async ({ id, data }: { id: string, data: ProposalFormData }): Promise<Proposal | null> => {
  try {
    const userId = await getAuthenticatedUserId();
    
    const { data: currentProposal, error: fetchError } = await supabase
      .from('proposals')
      .select('client_id')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const client = await updateClient(currentProposal.client_id, {
      name: data.client,
      email: data.email,
      phone: data.phone,
      address: data.address
    }, userId);

    const totalAmount = calculateTotalAmount(data.items);

    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .update({
        title: `Proposal for ${data.client}`,
        issue_date: data.proposalDate,
        valid_until: data.expirationDate,
        amount: totalAmount,
        scope: data.scope,
        timeline: data.timeline,
        notes: data.notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (proposalError) throw proposalError;

    // Delete existing items then re-insert
    const { error: deleteError } = await supabase
      .from('proposal_items')
      .delete()
      .eq('proposal_id', id);

    if (deleteError) throw deleteError;

    await addProposalLineItems(id, data.items);

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
