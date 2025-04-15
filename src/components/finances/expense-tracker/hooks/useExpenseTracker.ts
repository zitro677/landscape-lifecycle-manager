import { useState } from "react";
import { format } from "date-fns";

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
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "EXP-001",
      date: "2023-11-15",
      category: "Materials",
      amount: 1250.75,
      vendor: "Home Depot",
      description: "Lumber for Johnson project",
      deductible: true,
    },
    {
      id: "EXP-002",
      date: "2023-11-10",
      category: "Equipment",
      amount: 459.99,
      vendor: "Tool Depot",
      description: "New electric trimmer",
      deductible: true,
    },
    {
      id: "EXP-003",
      date: "2023-11-05",
      category: "Fuel",
      amount: 89.50,
      vendor: "Shell Gas",
      description: "Fuel for trucks",
      deductible: true,
    },
    {
      id: "EXP-004",
      date: "2023-11-01",
      category: "Labor",
      amount: 2800.00,
      vendor: "Contract Workers",
      description: "Weekly labor payment",
      deductible: true,
    },
    {
      id: "EXP-005",
      date: "2023-10-28",
      category: "Office",
      amount: 125.30,
      vendor: "Office Supply Co",
      description: "Office supplies",
      deductible: true,
    },
    {
      id: "EXP-006",
      date: "2023-10-25",
      category: "Marketing",
      amount: 350.00,
      vendor: "Facebook",
      description: "Ad campaign for fall season",
      deductible: true,
    },
    {
      id: "EXP-007",
      date: "2023-10-20",
      category: "Insurance",
      amount: 750.00,
      vendor: "ABC Insurance",
      description: "Monthly premium",
      deductible: true,
    },
  ]);

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

  // Calculate statistics
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
