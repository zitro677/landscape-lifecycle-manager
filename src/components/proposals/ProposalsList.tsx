
import React from "react";
import { motion } from "framer-motion";
import ProposalCard from "./ProposalCard";
import { Proposal } from "./types";
import { format } from "date-fns";

interface ProposalsListProps {
  proposals: Proposal[];
  isLoading: boolean;
  isError: boolean;
  filteredAndSortedProposals: Proposal[];
}

const ProposalsList: React.FC<ProposalsListProps> = ({
  filteredAndSortedProposals,
  isLoading,
  isError
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading proposals...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading proposals. Please try again.</p>
      </div>
    );
  }

  if (filteredAndSortedProposals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-muted-foreground">No proposals found.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAndSortedProposals.map((proposal, index) => (
        <ProposalCard 
          key={proposal.id} 
          proposal={{
            id: proposal.id || `PROP-${index}`,
            client: proposal.client_name || proposal.title?.replace("Proposal for ", "") || "Unknown Client",
            date: proposal.issue_date || format(new Date(proposal.created_at || ""), "yyyy-MM-dd"),
            amount: proposal.amount ? `$${proposal.amount.toLocaleString()}` : "$0.00",
            status: proposal.status || "Draft",
            expirationDate: proposal.valid_until || "-"
          }} 
          index={index} 
        />
      ))}
    </div>
  );
};

export default ProposalsList;
