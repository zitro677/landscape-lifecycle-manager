
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Proposal } from "./types";
import { toast } from "sonner";

interface ProposalStatusManagerProps {
  proposal: Proposal;
}

const ProposalStatusManager = ({ proposal }: ProposalStatusManagerProps) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const updateProposalStatus = async (status: string) => {
    const { error } = await supabase
      .from("proposals")
      .update({ status })
      .eq("id", proposal.id);

    if (error) throw error;
    return { ...proposal, status };
  };

  const deleteProposal = async () => {
    if (!confirm("Are you sure you want to delete this proposal?")) {
      return;
    }

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("proposals")
        .delete()
        .eq("id", proposal.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast.success("Proposal deleted successfully");
    } catch (error: any) {
      console.error("Error deleting proposal:", error);
      toast.error(error.message || "Failed to delete proposal");
    } finally {
      setIsDeleting(false);
    }
  };

  const statusMutation = useMutation({
    mutationFn: updateProposalStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update status: ${error.message}`);
    }
  });

  const markAsApproved = () => {
    statusMutation.mutate("Approved", {
      onSuccess: () => toast.success("Proposal marked as approved")
    });
  };

  const markAsRejected = () => {
    statusMutation.mutate("Rejected", {
      onSuccess: () => toast.success("Proposal marked as rejected")
    });
  };

  const markAsSent = () => {
    statusMutation.mutate("Sent", {
      onSuccess: () => toast.success("Proposal marked as sent")
    });
  };

  const deleteProposalHandler = () => {
    deleteProposal();
  };

  return {
    markAsApproved,
    markAsRejected,
    markAsSent,
    deleteProposalHandler,
    isDeleting
  };
};

export default ProposalStatusManager;
