import { useState } from "react";
import { format } from "date-fns";
import { mockExpenses } from "../data/mockExpenses";
import { toast } from "sonner";

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  vendor: string;
  description: string;
  deductible: boolean;
  miles?: number;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

export interface NewExpense {
  date: string;
  category: string;
  amount: string;
  vendor: string;
  description: string;
  deductible: boolean;
  miles?: string;
}

const MILEAGE_RATE = 0.67;

export const useExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);

  const [newExpense, setNewExpense] = useState<NewExpense>({
    date: format(new Date(), "yyyy-MM-dd"),
    category: "Materials",
    amount: "",
    vendor: "",
    description: "",
    deductible: true,
    miles: "",
  });

  const addExpense = () => {
    if (!newExpense.vendor) return;

    let finalAmount = 0;
    if (newExpense.category === "Mileage" && newExpense.miles) {
      finalAmount = parseFloat(newExpense.miles) * MILEAGE_RATE;
    } else if (newExpense.amount) {
      finalAmount = parseFloat(newExpense.amount);
    }

    const expense: Expense = {
      id: `EXP-${String(expenses.length + 1).padStart(3, "0")}`,
      date: newExpense.date,
      category: newExpense.category,
      amount: finalAmount,
      vendor: newExpense.vendor,
      description: newExpense.description,
      deductible: newExpense.deductible,
      miles: newExpense.category === "Mileage" ? parseFloat(newExpense.miles || "0") : undefined,
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({
      date: format(new Date(), "yyyy-MM-dd"),
      category: "Materials",
      amount: "",
      vendor: "",
      description: "",
      deductible: true,
      miles: "",
    });
  };

  const handleEditExpense = (expense: Expense) => {
    setNewExpense({
      date: expense.date,
      category: expense.category,
      amount: expense.amount.toString(),
      vendor: expense.vendor,
      description: expense.description,
      deductible: expense.deductible,
      miles: expense.miles?.toString() || "",
    });
    // The dialog will be opened by the parent component
    toast.info("Edit expense details and save to update");
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    toast.success("Expense deleted successfully");
  };

  // Add handlers to each expense object
  const expensesWithHandlers = expenses.map(expense => ({
    ...expense,
    onEdit: handleEditExpense,
    onDelete: handleDeleteExpense,
  }));

  return {
    expenses: expensesWithHandlers,
    newExpense,
    setNewExpense,
    addExpense,
    totalExpenses: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    deductibleExpenses: expenses
      .filter((expense) => expense.deductible)
      .reduce((sum, expense) => sum + expense.amount, 0),
    potentialTaxSavings: expenses
      .filter((expense) => expense.deductible)
      .reduce((sum, expense) => sum + expense.amount, 0) * 0.3,
    totalMiles: expenses.reduce((sum, expense) => sum + (expense.miles || 0), 0),
    totalMileageDeduction: expenses.reduce((sum, expense) => sum + (expense.miles || 0), 0) * MILEAGE_RATE,
  };
};
