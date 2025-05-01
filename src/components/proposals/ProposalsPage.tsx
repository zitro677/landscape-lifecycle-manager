
import React, { useState, useEffect } from "react";
import AnimatedPage from "../shared/AnimatedPage";
import { useProposals } from "./useProposals"; 
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
  
  const { proposals, isLoading, isError, error, refetch, status } = useProposals();

  // Force a refetch when the component mounts
  useEffect(() => {
    const loadProposals = async () => {
      const loadingToast = toast.loading("Loading proposals...");
      
      try {
        await refetch();
        toast.dismiss(loadingToast);
        
        if (proposals && proposals.length > 0) {
          toast.success(`Loaded ${proposals.length} proposals`);
        } else {
          toast.info("No proposals found");
        }
      } catch (err) {
        toast.dismiss(loadingToast);
        toast.error("Failed to load proposals");
        console.error("Error refetching proposals:", err);
      }
    };
    
    loadProposals();
    console.log("ProposalsPage mounted, refetching data");
  }, [refetch]);

  // Log the proposals data to help debug
  useEffect(() => {
    console.log("ProposalsPage - Current proposals status:", status);
    console.log("ProposalsPage - isLoading:", isLoading);
    console.log("ProposalsPage - isError:", isError);
    console.log("ProposalsPage - Proposals count:", proposals?.length || 0);
  }, [proposals, isLoading, isError, status]);

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
          <button 
            onClick={() => refetch()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try again
          </button>
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
