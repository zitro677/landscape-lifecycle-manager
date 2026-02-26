
import { Proposal, ProposalFormData } from "../../types";
import { getAuthenticatedUserId } from "../utils/sessionUtils";
import { findClientByEmail, updateClient, createClient, getClientById } from "./clientOperations";
import { addProposalLineItems } from "./proposalItemOperations";
import { createProposalRecord, calculateTotalAmount } from "./proposalCreation";

/**
 * Creates a new proposal with all associated data (client, items, etc.)
 */
export const createProposal = async (proposalData: ProposalFormData): Promise<Proposal | null> => {
  try {
    const userId = await getAuthenticatedUserId();
    
    // Find or create client
    let client = await findClientByEmail(proposalData.email, userId);
    
    if (client) {
      client = await updateClient(client.id, {
        name: proposalData.client,
        email: proposalData.email,
        phone: proposalData.phone,
        address: proposalData.address
      }, userId);
    } else {
      client = await createClient({
        name: proposalData.client,
        email: proposalData.email,
        phone: proposalData.phone,
        address: proposalData.address
      }, userId);
    }

    if (!client) {
      throw new Error('Client could not be created or retrieved');
    }

    const totalAmount = calculateTotalAmount(proposalData.items);
    const proposalNumber = `PROP-${Date.now().toString(36).toUpperCase()}`;

    const proposal = await createProposalRecord({
      client_id: client.id,
      title: `Proposal for ${proposalData.client}`,
      issue_date: proposalData.proposalDate,
      valid_until: proposalData.expirationDate,
      amount: totalAmount,
      scope: proposalData.scope,
      timeline: proposalData.timeline,
      notes: proposalData.notes,
      user_id: userId,
      proposal_number: proposalNumber
    });

    // Add proposal line items — fail loudly
    await addProposalLineItems(proposal.id, proposalData.items);

    let clientDetails;
    try {
      clientDetails = await getClientById(client.id);
    } catch (error) {
      console.error('Error fetching client details:', error);
      clientDetails = { name: client.name, email: client.email, phone: client.phone, address: client.address };
    }

    return {
      ...proposal,
      client_name: client.name,
      clients: clientDetails ? {
        name: clientDetails.name,
        email: clientDetails.email,
        phone: clientDetails.phone,
        address: clientDetails.address
      } : {
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address
      }
    };
  } catch (error) {
    console.error('Error in createProposal:', error);
    throw error;
  }
};
