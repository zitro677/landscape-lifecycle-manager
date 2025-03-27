
import React from "react";
import { motion } from "framer-motion";
import InvoiceCard from "./InvoiceCard";

interface Invoice {
  id: string;
  client: string;
  date: string;
  dueDate: string;
  amount: string;
  status: string;
}

interface InvoicesListProps {
  invoices: Invoice[];
}

const InvoicesList: React.FC<InvoicesListProps> = ({ invoices }) => {
  return (
    <div className="space-y-4">
      {invoices.map((invoice, index) => (
        <InvoiceCard key={invoice.id} invoice={invoice} index={index} />
      ))}

      {invoices.length === 0 && (
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
