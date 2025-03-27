
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../shared/AnimatedPage";
import InvoicesHeader from "./InvoicesHeader";
import InvoiceStats from "./InvoiceStats";
import InvoiceFilters from "./InvoiceFilters";
import InvoicesList from "./InvoicesList";
import { useInvoices } from "./useInvoices";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  
  const { data: invoices, isLoading, error } = useInvoices();

  // Filter invoices by status
  const filteredInvoices = invoices ? 
    invoices.filter(invoice => 
      statusFilter === "all" ? true : invoice.status?.toLowerCase() === statusFilter.toLowerCase()
    ) : [];
  
  // Sort invoices by date
  const sortedInvoices = filteredInvoices
    ? [...filteredInvoices].sort((a, b) => {
        const dateA = new Date(a.issue_date).getTime();
        const dateB = new Date(b.issue_date).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      })
    : [];
  
  // Calculate statistics
  const totalAmount = invoices
    ? invoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0)
    : 0;
  
  const pendingAmount = invoices
    ? invoices.filter(invoice => 
        invoice.status === "Pending" || invoice.status === "Overdue"
      ).reduce((sum, invoice) => sum + Number(invoice.amount), 0)
    : 0;
  
  const pendingCount = invoices
    ? invoices.filter(
        invoice => invoice.status === "Pending" || invoice.status === "Overdue"
      ).length
    : 0;

  if (error) {
    return (
      <AnimatedPage>
        <div className="page-container">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading invoices. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="page-container">
        <InvoicesHeader />
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[70px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <>
            <InvoiceStats 
              totalAmount={totalAmount}
              invoicesCount={invoices?.length || 0}
              pendingAmount={pendingAmount}
              pendingCount={pendingCount}
            />
            
            <InvoiceFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            
            <InvoicesList invoices={sortedInvoices} />
          </>
        )}
      </div>
    </AnimatedPage>
  );
};

export default InvoicesPage;
