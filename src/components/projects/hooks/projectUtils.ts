
// Helper functions for project formatting and calculations

export const generateProjectId = (projectsCount: number) => {
  return `PRJ-${new Date().getFullYear()}-${String(projectsCount + 1).padStart(3, '0')}`;
};

export const calculateInitialProgress = (status: string) => {
  switch (status) {
    case 'Completed': return 100;
    case 'Planning': return 10;
    case 'In Progress': return 30;
    case 'On Hold': return 30;
    default: return 0;
  }
};

export const formatDate = (dateString: string | Date | undefined) => {
  return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
};

export const formatBudget = (budget: string | number | undefined) => {
  if (!budget) return '$0';
  return typeof budget === 'string' && budget.startsWith('$') ? budget : `$${budget}`;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Planning":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "On Hold":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};
