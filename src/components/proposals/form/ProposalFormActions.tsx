
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { proposalFormSchema } from "./formSchema";

type FormData = z.infer<typeof proposalFormSchema>;

interface ProposalFormActionsProps {
  form: UseFormReturn<FormData>;
  isPending: boolean;
}

export const ProposalFormActions: React.FC<ProposalFormActionsProps> = ({ form, isPending }) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate("/proposals")}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Proposals
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Proposal"}
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-8">
        <Button type="button" variant="outline" onClick={() => navigate("/proposals")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Proposal"}
        </Button>
      </div>
    </>
  );
};
