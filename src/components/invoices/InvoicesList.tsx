
import React from "react";
import { motion } from "framer-motion";
import InvoiceCard from "./InvoiceCard";
import { Invoice } from "./types";

interface InvoicesListProps {
  invoices: Invoice[];
  isLoading?: boolean;
  isError?: boolean;
  filteredAndSortedInvoices?: Invoice[];
}

const InvoicesList: React.FC<InvoicesListProps> = ({ 
  invoices, 
  isLoading,
  isError,
  filteredAndSortedInvoices
}) => {
  // Use the filteredAndSortedInvoices if provided, otherwise use the raw invoices
  const displayInvoices = filteredAndSortedInvoices || invoices;
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">Loading invoices...</p>
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-red-500">Error loading invoices. Please try again.</p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {displayInvoices.map((invoice, index) => (
        <InvoiceCard key={invoice.id} invoice={invoice} index={index} />
      ))}

      {displayInvoices.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">No invoices found.</p>
        </motion.div>
      )}
    </div>
  );
};

export default InvoicesList;
