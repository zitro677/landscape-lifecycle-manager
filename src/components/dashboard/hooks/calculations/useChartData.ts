
export const useChartData = (projects: any[], invoices: any[]) => {
  // Generate revenue data for the last 6 months
  const months = [];
  const currentDate = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    const monthRevenue = invoices
      .filter(invoice => {
        const invoiceDate = new Date(invoice.issue_date);
        return invoice.status === 'Paid' && 
               invoiceDate.getMonth() === date.getMonth() && 
               invoiceDate.getFullYear() === date.getFullYear();
      })
      .reduce((sum, invoice) => sum + parseFloat(invoice.amount?.toString() || '0'), 0);

    months.push({
      name: monthName,
      revenue: monthRevenue,
      expenses: Math.round(monthRevenue * 0.7), // Simplified calculation
    });
  }

  // Generate project status data with correct format
  const statusCounts = projects.reduce((acc, project) => {
    const status = project.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusColors = {
    'Completed': '#10b981',
    'In Progress': '#3b82f6',
    'Planning': '#8b5cf6',
    'On Hold': '#f59e0b',
    'Unknown': '#6b7280'
  };

  const projectStatusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count as number,
    color: statusColors[status as keyof typeof statusColors] || statusColors.Unknown,
  }));

  return {
    revenueData: months,
    projectStatusData,
  };
};
