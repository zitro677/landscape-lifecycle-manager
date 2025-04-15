
import { ColumnDef } from "@tanstack/react-table";
import type { Expense } from "../hooks/useExpenseTracker";

export const expenseColumns: ColumnDef<Expense>[] = [
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
    cell: ({ row }) => {
      return `$${row.getValue<number>("amount").toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
  },
  {
    accessorKey: "deductible",
    header: "Deductible",
    cell: ({ row }) => {
      return row.getValue<boolean>("deductible") ? "Yes" : "No";
    },
  },
];
