
export const useOverviewStats = (projects: any[], invoices: any[], proposals: any[]) => {
  const calculateOverviewStats = () => {
    // Calculate total revenue from completed projects and paid invoices
    const completedProjects = projects.filter(p => p.status === "Completed");
    const completedProjectsRevenue = completedProjects.reduce((sum, project) => {
      const budget = typeof project.budget === 'string' 
        ? parseFloat(project.budget.replace(/[$,]/g, '')) 
        : project.budget || 0;
      return sum + budget;
    }, 0);

    const paidInvoices = invoices.filter(inv => inv.status === "Paid");
    const paidInvoicesRevenue = paidInvoices.reduce((sum, invoice) => {
      return sum + (parseFloat(invoice.amount) || 0);
    }, 0);

    const totalRevenue = completedProjectsRevenue + paidInvoicesRevenue;

    // Calculate active projects
    const activeProjects = projects.filter(p => 
      p.status === "In Progress" || p.status === "Planning").length;
    
    // Calculate projects due in the next 7 days
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const dueSoonProjects = projects.filter(p => {
      if (!p.dueDate) return false;
      const dueDate = new Date(p.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    }).length;

    // Calculate pending invoices amount
    const pendingInvoices = invoices.filter(inv => 
      inv.status === "Pending" || inv.status === "Sent");
    const pendingInvoicesAmount = pendingInvoices.reduce((sum, invoice) => {
      return sum + (parseFloat(invoice.amount) || 0);
    }, 0);

    // Calculate proposal statistics
    const newProposalCount = proposals.length;
    const pendingProposals = proposals.filter(p => 
      p.status === "Pending" || p.status === "Sent").length;

    return {
      totalRevenue: `$${totalRevenue.toLocaleString()}`,
      revenueTrend: totalRevenue > 0 ? 12 : 0, // Placeholder trend
      activeProjects,
      dueSoonProjects,
      pendingInvoices: `$${pendingInvoicesAmount.toLocaleString()}`,
      pendingInvoicesCount: pendingInvoices.length,
      newProposals: newProposalCount,
      pendingApprovals: pendingProposals
    };
  };

  return calculateOverviewStats();
};
