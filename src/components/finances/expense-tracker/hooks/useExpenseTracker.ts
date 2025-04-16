
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
  miles?: number;
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

  // Calculate total mileage expenses per month/year
  const getMileageStats = () => {
    const mileageExpenses = expenses.filter(e => e.category === "Mileage");
    const totalMiles = mileageExpenses.reduce((sum, exp) => sum + (exp.miles || 0), 0);
    const totalMileageDeduction = totalMiles * MILEAGE_RATE;

    return { totalMiles, totalMileageDeduction };
  };

  const { totalMiles, totalMileageDeduction } = getMileageStats();
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
    totalMiles,
    totalMileageDeduction,
  };
};
