
import React, { useState } from "react";
import AnimatedPage from "../shared/AnimatedPage";
import InvoicesHeader from "./InvoicesHeader";
import InvoiceStats from "./InvoiceStats";
import InvoiceFilters from "./InvoiceFilters";
import InvoicesList from "./InvoicesList";
import {
  mockInvoices,
  filterInvoicesByStatus,
  sortInvoicesByDate,
  calculateTotalAmount,
  calculatePendingAmount,
  getPendingInvoicesCount
} from "./invoiceUtils";

const InvoicesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");

  const filteredInvoices = filterInvoicesByStatus(mockInvoices, statusFilter);
  const sortedInvoices = sortInvoicesByDate(filteredInvoices, sortOrder);
  
  const totalAmount = calculateTotalAmount(mockInvoices);
  const pendingAmount = calculatePendingAmount(mockInvoices);
  const pendingCount = getPendingInvoicesCount(mockInvoices);

  return (
    <AnimatedPage>
      <div className="page-container">
        <InvoicesHeader />
        
        <InvoiceStats 
          totalAmount={totalAmount}
          invoicesCount={mockInvoices.length}
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
      </div>
    </AnimatedPage>
  );
};

export default InvoicesPage;
