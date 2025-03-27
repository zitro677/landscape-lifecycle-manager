
import React from "react";
import { motion } from "framer-motion";

interface InvoiceStatsProps {
  totalAmount: number;
  invoicesCount: number;
  pendingAmount: number;
  pendingCount: number;
}

const InvoiceStats: React.FC<InvoiceStatsProps> = ({
  totalAmount,
  invoicesCount,
  pendingAmount,
  pendingCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-primary/10 rounded-lg p-6"
      >
        <h3 className="text-sm font-medium text-primary">Total Amount</h3>
        <p className="text-3xl font-bold mt-2">${totalAmount.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground mt-1">
          From {invoicesCount} invoices
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-yellow-500/10 rounded-lg p-6"
      >
        <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
          Pending Amount
        </h3>
        <p className="text-3xl font-bold mt-2">${pendingAmount.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground mt-1">
          {pendingCount} unpaid invoices
        </p>
      </motion.div>
    </div>
  );
};

export default InvoiceStats;
