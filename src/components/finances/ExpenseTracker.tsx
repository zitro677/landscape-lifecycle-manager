
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "../ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Download } from "lucide-react";
import { format } from "date-fns";

// Mock data for expenses
const mockExpenses = [
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
];

const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [newExpense, setNewExpense] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    category: "Materials",
    amount: "",
    vendor: "",
    description: "",
    deductible: true,
  });

  const addExpense = () => {
    if (!newExpense.vendor || !newExpense.amount) return;

    const expense = {
      id: `EXP-${String(expenses.length + 1).padStart(3, "0")}`,
      date: newExpense.date,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount as string),
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

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: any) => {
        return `$${row.getValue("amount").toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      },
    },
    {
      accessorKey: "deductible",
      header: "Deductible",
      cell: ({ row }: any) => {
        return row.getValue("deductible") ? "Yes" : "No";
      },
    },
  ];

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  // Calculate deductible expenses
  const deductibleExpenses = expenses
    .filter((expense) => expense.deductible)
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="card-shadow">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
            <p className="text-2xl font-bold mt-2">
              ${totalExpenses.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Deductible Expenses</h3>
            <p className="text-2xl font-bold mt-2">
              ${deductibleExpenses.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">Potential Tax Savings</h3>
            <p className="text-2xl font-bold mt-2">
              ${(deductibleExpenses * 0.3).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Based on 30% tax rate</p>
          </CardContent>
        </Card>
      </div>

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
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newExpense.date}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, date: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newExpense.category}
                      onValueChange={(value) =>
                        setNewExpense({ ...newExpense, category: value })
                      }
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Materials">Materials</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Fuel">Fuel</SelectItem>
                        <SelectItem value="Labor">Labor</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Insurance">Insurance</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newExpense.amount}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, amount: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="vendor">Vendor</Label>
                    <Input
                      id="vendor"
                      value={newExpense.vendor}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, vendor: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newExpense.description}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, description: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="deductible"
                    checked={newExpense.deductible}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, deductible: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="deductible">Tax Deductible</Label>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={addExpense}>Save Expense</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="card-shadow">
        <CardContent className="p-6">
          <DataTable
            columns={columns}
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
