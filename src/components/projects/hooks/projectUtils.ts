
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Not set';
  return new Date(dateString).toLocaleDateString();
};

export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const calculateProgress = (project: any): number => {
  // Simple progress calculation based on status
  switch (project?.status) {
    case 'Planning':
      return 10;
    case 'In Progress':
      return 50;
    case 'Completed':
      return 100;
    case 'On Hold':
      return 25;
    default:
      return 0;
  }
};
