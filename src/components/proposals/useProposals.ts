
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Proposal, ProposalFormData } from "./types";

export const useProposals = () => {
  const queryClient = useQueryClient();
  
  const fetchProposals = async (): Promise<Proposal[]> => {
    const { data: proposals, error } = await supabase
      .from("proposals")
      .select(`
        *,
        clients (
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
      // Use optional chaining to safely access client name, with fallback values
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
        client_id: null, // This would be set if we had a client ID
        title: `Proposal for ${formData.client}`,
        content: formData.scope,
        amount,
        issue_date: formData.proposalDate,
        valid_until: formData.expirationDate,
        status: "Draft", // Use capitalized first letter to match database constraint
      };

      // Insert into proposals table
      const { data: proposal, error: proposalError } = await supabase
        .from("proposals")
        .insert(proposalData)
        .select()
        .single();

      if (proposalError) {
        throw proposalError;
      }

      return proposal;
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      toast({
        title: "Error creating proposal",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
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
      toast({
        title: "Proposal Created",
        description: "Your proposal has been successfully created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create proposal",
        variant: "destructive",
      });
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
