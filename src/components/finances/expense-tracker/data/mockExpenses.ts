
import { Expense } from "../hooks/useExpenseTracker";

export const mockExpenses: Expense[] = [
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

