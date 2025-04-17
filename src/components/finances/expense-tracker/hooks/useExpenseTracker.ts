
import { useState, useEffect } from "react";
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
const EXPENSE_STORAGE_KEY = "expense-tracker-data";

export const useExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentExpenseId, setCurrentExpenseId] = useState<string | null>(null);

  const [newExpense, setNewExpense] = useState<NewExpense>({
    date: format(new Date(), "yyyy-MM-dd"),
    category: "Materials",
    amount: "",
    vendor: "",
    description: "",
    deductible: true,
    miles: "",
  });

  // Load expenses from localStorage on initial load
  useEffect(() => {
    const savedExpenses = localStorage.getItem(EXPENSE_STORAGE_KEY);
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (error) {
        console.error("Failed to parse saved expenses:", error);
        // Fallback to mock data if parsing fails
        setExpenses(mockExpenses);
      }
    } else {
      // If no saved data, use mock data for initial state
      setExpenses(mockExpenses);
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem(EXPENSE_STORAGE_KEY, JSON.stringify(expenses));
    }
  }, [expenses]);

  const addExpense = () => {
    if (!newExpense.vendor) return;

    let finalAmount = 0;
    if (newExpense.category === "Mileage" && newExpense.miles) {
      finalAmount = parseFloat(newExpense.miles) * MILEAGE_RATE;
    } else if (newExpense.amount) {
      finalAmount = parseFloat(newExpense.amount);
    }

    // If we're editing an existing expense
    if (currentExpenseId) {
      const updatedExpenses = expenses.map(expense => {
        if (expense.id === currentExpenseId) {
          return {
            ...expense,
            date: newExpense.date,
            category: newExpense.category,
            amount: finalAmount,
            vendor: newExpense.vendor,
            description: newExpense.description,
            deductible: newExpense.deductible,
            miles: newExpense.category === "Mileage" ? parseFloat(newExpense.miles || "0") : undefined,
          };
        }
        return expense;
      });
      
      setExpenses(updatedExpenses);
      setCurrentExpenseId(null);
      toast.success("Expense updated successfully");
    } else {
      // Adding a new expense
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
      toast.success("Expense added successfully");
    }

    // Reset form
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
    setCurrentExpenseId(expense.id);
    setNewExpense({
      date: expense.date,
      category: expense.category,
      amount: expense.amount.toString(),
      vendor: expense.vendor,
      description: expense.description,
      deductible: expense.deductible,
      miles: expense.miles?.toString() || "",
    });
  };

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
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
