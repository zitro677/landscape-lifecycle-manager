
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTaxCalculator } from "./tax-calculator/hooks/useTaxCalculator";
import { TaxIncomeSection } from "./tax-calculator/components/TaxIncomeSection";
import { TaxExpensesSection } from "./tax-calculator/components/TaxExpensesSection";
import { TaxResultsSection } from "./tax-calculator/components/TaxResultsSection";

const TaxCalculator: React.FC = () => {
  const {
    income,
    setIncome,
    expenses,
    handleExpenseChange,
    filingStatus,
    setFilingStatus,
    taxResults,
    yearFilter,
    setYearFilter,
  } = useTaxCalculator();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <TaxIncomeSection
            income={income}
            setIncome={setIncome}
            filingStatus={filingStatus}
            setFilingStatus={setFilingStatus}
            yearFilter={yearFilter}
            setYearFilter={setYearFilter}
          />
          <TaxExpensesSection
            expenses={expenses}
            handleExpenseChange={handleExpenseChange}
          />
        </div>

        <div className="space-y-6">
          <TaxResultsSection taxResults={taxResults} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="w-full sm:w-auto">
          Generate Tax Report for {yearFilter}
        </Button>
      </div>
    </motion.div>
  );
};

export default TaxCalculator;
