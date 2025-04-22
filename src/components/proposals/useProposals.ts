
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

  const getProposalById = async (id: string): Promise<Proposal | null> => {
    try {
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

      if (error) {
        console.error("Error fetching proposal:", error);
        throw error;
      }

      if (!proposal) {
        return null;
      }

      // Process items to extract scope, timeline, and notes
      let scope = "";
      let timeline = "";
      let notes = "";
      const items: any[] = [];

      if (proposal.proposal_items) {
        proposal.proposal_items.forEach((item: any) => {
          if (item.type === 'scope') {
            scope = item.description || "";
          } else if (item.type === 'timeline') {
            timeline = item.description || "";
          } else if (item.type === 'note') {
            notes = item.description || "";
          } else if (item.type === 'item') {
            items.push(item);
          }
        });
      }

      return {
        ...proposal,
        client_name: proposal.clients?.name || proposal.title?.replace("Proposal for ", "") || "",
        client_email: proposal.clients?.email || "",
        client_address: proposal.clients?.address || "",
        scope,
        timeline,
        notes,
        items
      };
    } catch (error) {
      console.error("Error fetching proposal by ID:", error);
      throw error;
    }
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
      toast.error("Error creating proposal: " + error.message);
      throw error;
    }
  };

  const updateProposal = async (id: string, formData: ProposalFormData) => {
    try {
      // Get user ID from the session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("You must be logged in to update a proposal");
      }

      // Calculate the total amount from items
      const amount = formData.items.reduce(
        (sum, item) => sum + (item.quantity * item.unitPrice),
        0
      );

      // Format the proposal data for database update
      const proposalData = {
        title: `Proposal for ${formData.client}`,
        content: formData.formattedContent || formData.scope,
        amount,
        issue_date: formData.proposalDate,
        valid_until: formData.expirationDate,
        updated_at: new Date().toISOString(),
      };

      // Update proposal
      const { data: proposal, error: proposalError } = await supabase
        .from("proposals")
        .update(proposalData)
        .eq("id", id)
        .select()
        .single();

      if (proposalError) throw proposalError;

      // Delete existing proposal items
      const { error: deleteError } = await supabase
        .from('proposal_items')
        .delete()
        .eq('proposal_id', id);

      if (deleteError) throw deleteError;

      // Insert updated proposal items
      const itemsToInsert = [
        // Scope
        {
          proposal_id: id,
          type: 'scope' as const,
          description: formData.scope,
        },
        // Timeline
        {
          proposal_id: id,
          type: 'timeline' as const,
          description: formData.timeline,
        },
        // Notes
        {
          proposal_id: id,
          type: 'note' as const,
          description: formData.notes,
        },
        // Items & Services
        ...formData.items.map(item => ({
          proposal_id: id,
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

      toast.success("Proposal updated successfully");
      return proposal;
    } catch (error: any) {
      console.error("Error updating proposal:", error);
      toast.error("Error updating proposal: " + error.message);
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
      toast.success("Proposal created successfully");
    },
    onError: (error: any) => {
      toast.error("Error creating proposal: " + (error.message || "An unexpected error occurred"));
    }
  });

  // Mutation to update an existing proposal
  const updateProposalMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProposalFormData }) => {
      return updateProposal(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    }
  });

  return {
    proposals: proposalsQuery.data || [],
    isLoading: proposalsQuery.isLoading,
    isError: proposalsQuery.isError,
    error: proposalsQuery.error,
    createProposal: createProposalMutation.mutate,
    updateProposal,
    getProposalById,
    isPending: createProposalMutation.isPending || updateProposalMutation.isPending
  };
};
