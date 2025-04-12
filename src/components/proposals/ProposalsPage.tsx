
import React, { useState } from "react";
import AnimatedPage from "../shared/AnimatedPage";
import { useProposals } from "./useProposals";
import ProposalFilters from "./ProposalFilters";
import ProposalStats from "./ProposalStats";
import ProposalsList from "./ProposalsList";
import ProposalsHeader from "./ProposalsHeader";

const ProposalsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  
  const { proposals, isLoading, isError } = useProposals();

  const filteredProposals = proposals.filter((proposal) => {
    if (statusFilter === "all") return true;
    return proposal.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const sortedProposals = [...filteredProposals].sort((a, b) => {
    const dateA = new Date(a.issue_date || a.created_at || "").getTime();
    const dateB = new Date(b.issue_date || b.created_at || "").getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <AnimatedPage>
      <div className="page-container">
        <ProposalsHeader />
        <ProposalStats proposals={proposals} />
        <ProposalFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        <ProposalsList
          proposals={proposals}
          isLoading={isLoading}
          isError={isError}
          filteredAndSortedProposals={sortedProposals}
        />
      </div>
    </AnimatedPage>
  );
};

export default ProposalsPage;
