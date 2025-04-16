import React, { useState } from "react";
import AnimatedPage from "../shared/AnimatedPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaxCalculator from "./TaxCalculator";
import ExpenseTracker from "./ExpenseTracker";
import FinancesHeader from "./header/FinancesHeader";
import FinancialStats from "./stats/FinancialStats";
import IncomeExpenseChart from "./charts/IncomeExpenseChart";
import ProjectIncomeChart from "./charts/ProjectIncomeChart";
import ExpenseBreakdownChart from "./charts/ExpenseBreakdownChart";
import { monthlyIncomeData, projectIncomeData, expenseBreakdownData } from "./data/FinancialData";
import { InventoryPage } from "./inventory/InventoryPage";

const FinancesPage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<string>("year");
  const [yearFilter, setYearFilter] = useState<string>("2025");

  const totalIncome = monthlyIncomeData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = monthlyIncomeData.reduce((sum, item) => sum + item.expenses, 0);
  const netIncome = totalIncome - totalExpenses;
  const profitMargin = ((netIncome / totalIncome) * 100).toFixed(1);

  return (
    <AnimatedPage>
      <div className="page-container">
        <FinancesHeader
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
        />

        <FinancialStats
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          netIncome={netIncome}
          profitMargin={profitMargin}
          yearFilter={yearFilter}
        />

        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="expenses">Expense Tracking</TabsTrigger>
            <TabsTrigger value="taxes">Tax Calculator</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 pt-4">
            <IncomeExpenseChart data={monthlyIncomeData} yearFilter={yearFilter} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProjectIncomeChart data={projectIncomeData} />
              <ExpenseBreakdownChart data={expenseBreakdownData} />
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="pt-4">
            <ExpenseTracker />
          </TabsContent>

          <TabsContent value="taxes" className="pt-4">
            <TaxCalculator />
          </TabsContent>

          <TabsContent value="inventory" className="pt-4">
            <InventoryPage />
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedPage>
  );
};

export default FinancesPage;
