
import React, { useState, useEffect } from "react";
import AnimatedPage from "../shared/AnimatedPage";
import { useProposalQueries } from "./queries/useProposalQueries";
import ProposalFilters from "./ProposalFilters";
import ProposalStats from "./ProposalStats";
import ProposalsList from "./ProposalsList";
import ProposalsHeader from "./ProposalsHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Proposal } from "./types";
import { toast } from "sonner";

const ProposalsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  
  const { proposals, isLoading, isError, error, refetch } = useProposalQueries();

  // Force a refetch when the component mounts
  useEffect(() => {
    // Show toast when the component mounts to indicate loading
    const loadingToast = toast.loading("Loading proposals...");
    
    refetch().then(() => {
      toast.dismiss(loadingToast);
      if (proposals && proposals.length > 0) {
        toast.success(`Loaded ${proposals.length} proposals`);
      }
    }).catch((err) => {
      toast.dismiss(loadingToast);
      toast.error("Failed to load proposals");
      console.error("Error refetching proposals:", err);
    });
    
    console.log("ProposalsPage mounted, refetching data");
  }, [refetch]);

  // Log the proposals data to help debug
  useEffect(() => {
    if (!isLoading) {
      console.log("Proposals data in ProposalsPage:", proposals);
      console.log("Proposals count:", proposals?.length || 0);
    }
  }, [proposals, isLoading]);

  // Ensure proposals is an array before filtering
  const filteredProposals = Array.isArray(proposals) ? proposals.filter((proposal) => {
    if (statusFilter === "all") return true;
    return proposal.status?.toLowerCase() === statusFilter.toLowerCase();
  }) : [];

  // Ensure proposals is an array before sorting
  const sortedProposals = [...filteredProposals].sort((a, b) => {
    const dateA = new Date(a.issue_date || a.created_at || "").getTime();
    const dateB = new Date(b.issue_date || b.created_at || "").getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  if (isError) {
    return (
      <AnimatedPage>
        <div className="page-container">
          <ProposalsHeader />
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading proposals. Please try again.
              {error instanceof Error && (
                <div className="mt-2 text-xs opacity-80">
                  {error.message}
                </div>
              )}
            </AlertDescription>
          </Alert>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="page-container">
        <ProposalsHeader />
        
        {isLoading ? (
          <div className="space-y-4 mt-4">
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[70px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <>
            <ProposalStats proposals={proposals as Proposal[]} />
            
            <ProposalFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            
            <ProposalsList
              proposals={proposals as Proposal[]}
              isLoading={isLoading}
              isError={isError}
              filteredAndSortedProposals={sortedProposals}
            />
          </>
        )}
      </div>
    </AnimatedPage>
  );
};

export default ProposalsPage;
