import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DataTable } from "../ui/data-table";
import { DialogTrigger } from "@/components/ui/dialog";
import { Plus, Download } from "lucide-react";
import { ExpenseStats } from "./expense-tracker/components/ExpenseStats";
import { ExpenseForm } from "./expense-tracker/components/ExpenseForm";
import { expenseColumns } from "./expense-tracker/components/ExpenseTableColumns";
import { useExpenseTracker } from "./expense-tracker/hooks/useExpenseTracker";

const ExpenseTracker: React.FC = () => {
  const {
    expenses,
    newExpense,
    setNewExpense,
    addExpense,
    totalExpenses,
    deductibleExpenses,
    potentialTaxSavings,
  } = useExpenseTracker();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <ExpenseStats
        totalExpenses={totalExpenses}
        deductibleExpenses={deductibleExpenses}
        potentialTaxSavings={potentialTaxSavings}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Expense Records</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Expense</span>
              </Button>
            </DialogTrigger>
            <ExpenseForm
              newExpense={newExpense}
              onExpenseChange={setNewExpense}
              onSubmit={addExpense}
            />
          </Dialog>
        </div>
      </div>

      <Card className="card-shadow">
        <CardContent className="p-6">
          <DataTable
            columns={expenseColumns}
            data={expenses}
            searchColumn="vendor"
            searchPlaceholder="Search expenses..."
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExpenseTracker;
