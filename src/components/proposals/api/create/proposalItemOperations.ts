
import { supabase } from "@/integrations/supabase/client";

/**
 * Adds line items to a proposal
 */
export const addProposalLineItems = async (proposalId: string, items: {
  description: string;
  quantity: number;
  unitPrice: number;
}[]) => {
  if (items.length === 0) return;
  
  const proposalItemsData = items.map(item => ({
    proposal_id: proposalId,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    amount: item.quantity * item.unitPrice,
  }));

  const { error } = await supabase
    .from('proposal_items')
    .insert(proposalItemsData);

  if (error) {
    console.error('Error adding proposal items:', error);
    throw error;
  }
};
