
import React from "react";
import { motion } from "framer-motion";

interface FinancialStatsProps {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  profitMargin: string;
  yearFilter: string;
}

const FinancialStats: React.FC<FinancialStatsProps> = ({
  totalIncome,
  totalExpenses,
  netIncome,
  profitMargin,
  yearFilter,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass-card rounded-lg p-6"
      >
        <h3 className="text-sm font-medium text-muted-foreground">Total Income</h3>
        <p className="text-2xl font-bold mt-2 truncate" title={`$${totalIncome.toLocaleString()}`}>
          ${totalIncome.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-1">For {yearFilter}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="glass-card rounded-lg p-6"
      >
        <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
        <p className="text-2xl font-bold mt-2 truncate" title={`$${totalExpenses.toLocaleString()}`}>
          ${totalExpenses.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-1">For {yearFilter}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="glass-card rounded-lg p-6"
      >
        <h3 className="text-sm font-medium text-muted-foreground">Net Income</h3>
        <p className="text-2xl font-bold mt-2 truncate" title={`$${netIncome.toLocaleString()}`}>
          ${netIncome.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-1">For {yearFilter}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="glass-card rounded-lg p-6"
      >
        <h3 className="text-sm font-medium text-muted-foreground">Profit Margin</h3>
        <p className="text-2xl font-bold mt-2 truncate" title={`${profitMargin}%`}>
          {profitMargin}%
        </p>
        <p className="text-xs text-muted-foreground mt-1">For {yearFilter}</p>
      </motion.div>
    </div>
  );
};

export default FinancialStats;
