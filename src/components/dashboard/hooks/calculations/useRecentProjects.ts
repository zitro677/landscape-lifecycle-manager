
export const useRecentProjects = (projects: any[]) => {
  return projects
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map(project => ({
      id: project.id,
      name: project.name,
      status: project.status,
      budget: project.budget,
      progress: calculateProgress(project),
      created_at: project.created_at,
      end_date: project.end_date,
    }));
};

const calculateProgress = (project: any) => {
  // Simple progress calculation based on status
  switch (project.status) {
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
