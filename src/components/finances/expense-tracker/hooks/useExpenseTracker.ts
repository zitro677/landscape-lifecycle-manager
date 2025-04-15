import { useState } from "react";
import { format } from "date-fns";
import { mockExpenses } from "../data/mockExpenses";

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  vendor: string;
  description: string;
  deductible: boolean;
}

export interface NewExpense {
  date: string;
  category: string;
  amount: string;
  vendor: string;
  description: string;
  deductible: boolean;
}

export const useExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);

  const [newExpense, setNewExpense] = useState<NewExpense>({
    date: format(new Date(), "yyyy-MM-dd"),
    category: "Materials",
    amount: "",
    vendor: "",
    description: "",
    deductible: true,
  });

  const addExpense = () => {
    if (!newExpense.vendor || !newExpense.amount) return;

    const expense: Expense = {
      id: `EXP-${String(expenses.length + 1).padStart(3, "0")}`,
      date: newExpense.date,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      vendor: newExpense.vendor,
      description: newExpense.description,
      deductible: newExpense.deductible,
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({
      date: format(new Date(), "yyyy-MM-dd"),
      category: "Materials",
      amount: "",
      vendor: "",
      description: "",
      deductible: true,
    });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const deductibleExpenses = expenses
    .filter((expense) => expense.deductible)
    .reduce((sum, expense) => sum + expense.amount, 0);
  const potentialTaxSavings = deductibleExpenses * 0.3;

  return {
    expenses,
    newExpense,
    setNewExpense,
    addExpense,
    totalExpenses,
    deductibleExpenses,
    potentialTaxSavings,
  };
};
