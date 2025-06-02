
export const useChartData = (projects: any[], invoices: any[]) => {
  // Generate revenue data from invoices
  const revenueData = invoices
    .filter(invoice => invoice.status === 'Paid' && invoice.issue_date)
    .reduce((acc: any[], invoice) => {
      const date = new Date(invoice.issue_date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      const existingEntry = acc.find(entry => entry.month === monthYear);
      if (existingEntry) {
        existingEntry.revenue += parseFloat(invoice.amount?.toString() || '0');
      } else {
        acc.push({
          month: monthYear,
          revenue: parseFloat(invoice.amount?.toString() || '0'),
        });
      }
      
      return acc;
    }, [])
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  // Generate project status data
  const statusCounts = projects.reduce((acc: any, project) => {
    const status = project.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const projectStatusData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count: count as number,
  }));

  return {
    revenueData,
    projectStatusData,
  };
};
