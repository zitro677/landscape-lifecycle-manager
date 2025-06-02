
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

  return {
    totalRevenue,
    activeProjects,
    pendingInvoices,
    pendingProposals,
  };
};
