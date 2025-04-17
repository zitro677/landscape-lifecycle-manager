
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Proposal, ProposalFormData } from "./types";

export const useProposals = () => {
  const queryClient = useQueryClient();
  
  const fetchProposals = async (): Promise<Proposal[]> => {
    // Use the specific relationship name as mentioned in the error hint
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

    if (error) {
      console.error("Error fetching proposals:", error);
      throw error;
    }

    // Format the proposals to match our expected structure
    return proposals.map(proposal => ({
      ...proposal,
      client_name: proposal.clients?.name || proposal.title?.replace("Proposal for ", "") || ""
    }));
  };

  const createProposal = async (formData: ProposalFormData) => {
    try {
      // Get user ID from the session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("You must be logged in to create a proposal");
      }

      // Calculate the total amount from items
      const amount = formData.items.reduce(
        (sum, item) => sum + (item.quantity * item.unitPrice),
        0
      );

      // Generate a readable proposal number
      const timestamp = new Date().getTime().toString().slice(-6);
      const proposalNumber = `PRO-${timestamp}`;

      // Format the proposal data for database insertion
      const proposalData = {
        user_id: session.user.id,
        title: `Proposal for ${formData.client}`,
        content: formData.formattedContent || formData.scope, // Use formatted content if available
        amount,
        issue_date: formData.proposalDate,
        valid_until: formData.expirationDate,
        status: "Draft",
      };

      // Insert proposal
      const { data: proposal, error: proposalError } = await supabase
        .from("proposals")
        .insert(proposalData)
        .select()
        .single();

      if (proposalError) throw proposalError;

      // Insert proposal items
      const itemsToInsert = [
        // Scope
        {
          proposal_id: proposal.id,
          type: 'scope' as const,
          description: formData.scope,
        },
        // Timeline
        {
          proposal_id: proposal.id,
          type: 'timeline' as const,
          description: formData.timeline,
        },
        // Notes
        {
          proposal_id: proposal.id,
          type: 'note' as const,
          description: formData.notes,
        },
        // Items & Services
        ...formData.items.map(item => ({
          proposal_id: proposal.id,
          type: 'item' as const,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unitPrice,
        })),
      ];

      const { error: itemsError } = await supabase
        .from('proposal_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      return proposal;
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      toast("Error creating proposal: " + error.message);
      throw error;
    }
  };

  // Query to fetch all proposals
  const proposalsQuery = useQuery({
    queryKey: ["proposals"],
    queryFn: fetchProposals
  });

  // Mutation to create a new proposal
  const createProposalMutation = useMutation({
    mutationFn: createProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast("Proposal created successfully");
    },
    onError: (error: any) => {
      toast("Error creating proposal: " + (error.message || "An unexpected error occurred"));
    }
  });

  return {
    proposals: proposalsQuery.data || [],
    isLoading: proposalsQuery.isLoading,
    isError: proposalsQuery.isError,
    error: proposalsQuery.error,
    createProposal: createProposalMutation.mutate,
    isPending: createProposalMutation.isPending
  };
};
