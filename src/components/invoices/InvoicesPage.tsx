
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import AnimatedPage from "../shared/AnimatedPage";
import InvoiceCard from "./InvoiceCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Mock data
const invoices = [
  {
    id: "INV-2023-001",
    client: "Johnson Family",
    date: "2023-10-15",
    dueDate: "2023-11-15",
    amount: "$2,450.00",
    status: "Paid",
  },
  {
    id: "INV-2023-002",
    client: "Oakridge Community Center",
    date: "2023-11-01",
    dueDate: "2023-12-01",
    amount: "$8,750.00",
    status: "Pending",
  },
  {
    id: "INV-2023-003",
    client: "Peterson Residence",
    date: "2023-11-10",
    dueDate: "2023-12-10",
    amount: "$3,200.00",
    status: "Pending",
  },
  {
    id: "INV-2023-004",
    client: "Sunset Hills Park",
    date: "2023-10-05",
    dueDate: "2023-11-05",
    amount: "$12,300.00",
    status: "Overdue",
  },
  {
    id: "INV-2023-005",
    client: "Martinez Garden",
    date: "2023-11-20",
    dueDate: "2023-12-20",
    amount: "$4,750.00",
    status: "Pending",
  },
];

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");

  const filteredInvoices = invoices.filter((invoice) => {
    if (statusFilter === "all") return true;
    return invoice.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + parseFloat(invoice.amount.replace("$", "").replace(",", "")),
    0
  );

  const pendingAmount = invoices
    .filter((invoice) => invoice.status === "Pending" || invoice.status === "Overdue")
    .reduce(
      (sum, invoice) => sum + parseFloat(invoice.amount.replace("$", "").replace(",", "")),
      0
    );

  return (
    <AnimatedPage>
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your client invoices
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 md:mt-0"
          >
            <Button
              onClick={() => navigate("/invoices/new")}
              className="w-full md:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" /> Create Invoice
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-primary/10 rounded-lg p-6"
          >
            <h3 className="text-sm font-medium text-primary">Total Amount</h3>
            <p className="text-3xl font-bold mt-2">${totalAmount.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">
              From {invoices.length} invoices
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-yellow-500/10 rounded-lg p-6"
          >
            <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
              Pending Amount
            </h3>
            <p className="text-3xl font-bold mt-2">${pendingAmount.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {invoices.filter((invoice) => invoice.status === "Pending" || invoice.status === "Overdue").length} unpaid invoices
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">More Filters</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuCheckboxItem checked>
                  Show Client Name
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Show Due Date
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Show Amount
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>
                  This Month Only
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  This Year Only
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {sortedInvoices.map((invoice, index) => (
            <InvoiceCard key={invoice.id} invoice={invoice} index={index} />
          ))}

          {sortedInvoices.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">No invoices found.</p>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default InvoicesPage;
