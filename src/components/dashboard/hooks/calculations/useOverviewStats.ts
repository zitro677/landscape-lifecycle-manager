
export const useOverviewStats = (projects: any[], invoices: any[], proposals: any[]) => {
  // Calculate total revenue from paid invoices
  const totalRevenue = invoices
    .filter(invoice => invoice.status === 'Paid')
    .reduce((sum, invoice) => sum + parseFloat(invoice.amount?.toString() || '0'), 0);

  // Count active projects
  const activeProjects = projects.filter(project => 
    project.status === 'In Progress' || project.status === 'Planning'
  ).length;

  // Count pending invoices
  const pendingInvoices = invoices.filter(invoice => 
    invoice.status === 'Pending' || invoice.status === 'Sent'
  ).length;

  // Count pending proposals
  const pendingProposals = proposals.filter(proposal => 
    proposal.status === 'Sent' || proposal.status === 'Draft'
  ).length;

  // Calculate projects due soon (within next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const dueSoonProjects = projects.filter(project => {
    if (!project.end_date) return false;
    const endDate = new Date(project.end_date);
    return endDate <= nextWeek && endDate >= new Date();
  }).length;

  // Calculate revenue trend (simplified - comparing current vs previous month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthRevenue = invoices
    .filter(invoice => {
      const invoiceDate = new Date(invoice.issue_date);
      return invoice.status === 'Paid' && 
             invoiceDate.getMonth() === currentMonth && 
             invoiceDate.getFullYear() === currentYear;
    })
    .reduce((sum, invoice) => sum + parseFloat(invoice.amount?.toString() || '0'), 0);

  const previousMonthRevenue = invoices
    .filter(invoice => {
      const invoiceDate = new Date(invoice.issue_date);
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return invoice.status === 'Paid' && 
             invoiceDate.getMonth() === prevMonth && 
             invoiceDate.getFullYear() === prevYear;
    })
    .reduce((sum, invoice) => sum + parseFloat(invoice.amount?.toString() || '0'), 0);

  const revenueTrend = previousMonthRevenue > 0 
    ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
    : 0;

  return {
    totalRevenue,
    activeProjects,
    pendingInvoices,
    pendingProposals,
    dueSoonProjects,
    revenueTrend: Math.round(revenueTrend),
    pendingInvoicesCount: pendingInvoices,
    newProposals: pendingProposals,
    pendingApprovals: proposals.filter(p => p.status === 'Sent').length,
  };
};
