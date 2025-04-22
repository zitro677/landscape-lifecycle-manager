
import { supabase } from "@/integrations/supabase/client";
import { Proposal, ProposalFormData } from "../types";
import { toast } from "sonner";

// Fetches all proposals
export const fetchProposals = async (): Promise<Proposal[]> => {
  const { data: proposals, error } = await supabase
    .from("proposals")
    .select(`
      *,
      clients!fk_proposals_client_id (
        name,
        email,
        address
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return proposals.map(proposal => ({
    ...proposal,
    client_name: proposal.clients?.name || proposal.title?.replace("Proposal for ", "") || ""
  }));
};

// Fetches a single proposal by id
export const getProposalById = async (id: string): Promise<Proposal | null> => {
  const { data: proposal, error } = await supabase
    .from("proposals")
    .select(`
      *,
      clients!fk_proposals_client_id (
        name,
        email,
        address
      ),
      proposal_items(*)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!proposal) return null;

  let scope = "";
  let timeline = "";
  let notes = "";
  const items: any[] = [];
  if (proposal.proposal_items) {
    proposal.proposal_items.forEach((item: any) => {
      if (item.type === "scope") scope = item.description || "";
      else if (item.type === "timeline") timeline = item.description || "";
      else if (item.type === "note") notes = item.description || "";
      else if (item.type === "item") items.push(item);
    });
  }
  return {
    ...proposal,
    client_name: proposal.clients?.name || proposal.title?.replace("Proposal for ", "") || "",
    scope,
    timeline,
    notes,
    items
  };
};

// Creates a new proposal
export const createProposal = async (formData: ProposalFormData) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("You must be logged in to create a proposal");

  const amount = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const timestamp = new Date().getTime().toString().slice(-6);

  const proposalData = {
    user_id: session.user.id,
    title: `Proposal for ${formData.client}`,
    content: formData.formattedContent || formData.scope,
    amount,
    issue_date: formData.proposalDate,
    valid_until: formData.expirationDate,
    status: "Draft",
  };

  const { data: proposal, error: proposalError } = await supabase
    .from("proposals")
    .insert(proposalData)
    .select()
    .single();
  if (proposalError) throw proposalError;

  const itemsToInsert = [
    { proposal_id: proposal.id, type: "scope" as const, description: formData.scope },
    { proposal_id: proposal.id, type: "timeline" as const, description: formData.timeline },
    { proposal_id: proposal.id, type: "note" as const, description: formData.notes },
    ...formData.items.map(item => ({
      proposal_id: proposal.id,
      type: "item" as const,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice
    }))
  ];

  const { error: itemsError } = await supabase.from("proposal_items").insert(itemsToInsert);
  if (itemsError) throw itemsError;

  toast.success("Proposal created successfully");
  return proposal;
};

// Updates an existing proposal
export const updateProposal = async (id: string, formData: ProposalFormData) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("You must be logged in to update a proposal");

  const amount = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const proposalData = {
    title: `Proposal for ${formData.client}`,
    content: formData.formattedContent || formData.scope,
    amount,
    issue_date: formData.proposalDate,
    valid_until: formData.expirationDate,
    updated_at: new Date().toISOString(),
  };

  const { data: proposal, error: proposalError } = await supabase
    .from("proposals")
    .update(proposalData)
    .eq("id", id)
    .select()
    .single();
  if (proposalError) throw proposalError;

  await supabase.from("proposal_items").delete().eq("proposal_id", id);

  const itemsToInsert = [
    { proposal_id: id, type: "scope" as const, description: formData.scope },
    { proposal_id: id, type: "timeline" as const, description: formData.timeline },
    { proposal_id: id, type: "note" as const, description: formData.notes },
    ...formData.items.map(item => ({
      proposal_id: id,
      type: "item" as const,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice
    }))
  ];

  const { error: itemsError } = await supabase.from("proposal_items").insert(itemsToInsert);
  if (itemsError) throw itemsError;

  toast.success("Proposal updated successfully");
  return proposal;
};
