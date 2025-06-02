
export const useChartData = (projects: any[], invoices: any[]) => {
  // Calculate project status data for the chart from real data
  const calculateProjectStatusData = () => {
    const statusCounts: Record<string, number> = {
      "Completed": 0,
      "In Progress": 0,
      "Planning": 0,
      "On Hold": 0
    };

    projects.forEach(project => {
      if (statusCounts[project.status] !== undefined) {
        statusCounts[project.status]++;
      }
    });

    const statusColors: Record<string, string> = {
      "Completed": "#10b981",
      "In Progress": "#0ea5e9",
      "Planning": "#8b5cf6",
      "On Hold": "#f59e0b"
    };

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
      color: statusColors[name]
    }));
  };

  // Generate revenue data from real invoices and projects
  const generateRevenueData = () => {
    const currentDate = new Date();
    const monthsData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      // Calculate revenue from invoices for this month
      const monthRevenue = invoices
        .filter(invoice => {
          const invoiceDate = new Date(invoice.issue_date);
          return invoiceDate.getMonth() === date.getMonth() && 
                 invoiceDate.getFullYear() === date.getFullYear() &&
                 invoice.status === "Paid";
        })
        .reduce((sum, invoice) => sum + (parseFloat(invoice.amount) || 0), 0);

      // For expenses, we'll use a placeholder since we don't have expense data in the current schema
      const monthExpenses = monthRevenue * 0.6; // Placeholder: assume 60% expense ratio

      monthsData.push({
        name: monthName,
        revenue: monthRevenue,
        expenses: monthExpenses
      });
    }
    
    return monthsData;
  };

  return {
    projectStatusData: calculateProjectStatusData(),
    revenueData: generateRevenueData()
  };
};
