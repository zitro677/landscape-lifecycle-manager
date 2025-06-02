
export const useRecentProjects = (projects: any[]) => {
  // Get recent projects (4 most recent by creation date)
  const getRecentProjects = () => {
    return [...projects]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.startDate).getTime();
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.startDate).getTime();
        return dateB - dateA;
      })
      .slice(0, 4)
      .map(project => ({
        id: project.id,
        client: project.client,
        status: project.status,
        dueDate: project.dueDate,
        budget: project.budget
      }));
  };

  return getRecentProjects();
};
