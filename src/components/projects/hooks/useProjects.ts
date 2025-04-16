
import { useState } from "react";
import { getAllProjects } from "./projectData";
import { getStatusColor } from "./projectUtils";
import { addProject, updateProject } from "./projectOperations";

// Re-export for backward compatibility
export { getAllProjects, getStatusColor, addProject, updateProject };

// Main hook for managing projects
export const useProjects = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("dueDate");
  
  // Combine predefined projects with any user-created projects stored in localStorage
  const allProjects = getAllProjects();

  // Filter projects based on status
  const filteredProjects = allProjects.filter((project) => {
    if (statusFilter === "all") return true;
    return project.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Sort projects based on selected sort order
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortOrder) {
      case "dueDate":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "progress":
        return b.progress - a.progress;
      case "budget":
        return parseFloat(b.budget.replace("$", "").replace(",", "")) - 
               parseFloat(a.budget.replace("$", "").replace(",", ""));
      default:
        return 0;
    }
  });

  return {
    projects: allProjects,
    statusFilter,
    setStatusFilter,
    sortOrder,
    setSortOrder,
    getStatusColor,
    sortedProjects,
  };
};
