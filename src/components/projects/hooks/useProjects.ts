
import { useState } from "react";

// This would typically come from an API/database
export const projects = [
  {
    id: "PRJ-2023-001",
    name: "Johnson Backyard Renovation",
    client: "Johnson Family",
    status: "In Progress",
    progress: 65,
    startDate: "2023-10-10",
    dueDate: "2023-12-15",
    budget: "$8,500",
    team: ["John Smith", "Maria Garcia"],
  },
  {
    id: "PRJ-2023-002",
    name: "Oakridge Community Park",
    client: "Oakridge Community Center",
    status: "Planning",
    progress: 20,
    startDate: "2023-11-05",
    dueDate: "2024-02-28",
    budget: "$24,000",
    team: ["John Smith", "Maria Garcia", "Robert Chen", "Lisa Johnson"],
  },
  {
    id: "PRJ-2023-003",
    name: "Peterson Landscape Design",
    client: "Peterson Residence",
    status: "Completed",
    progress: 100,
    startDate: "2023-09-01",
    dueDate: "2023-10-30",
    budget: "$6,200",
    team: ["Maria Garcia", "Lisa Johnson"],
  },
  {
    id: "PRJ-2023-004",
    name: "Sunset Hills Park Maintenance",
    client: "Sunset Hills HOA",
    status: "In Progress",
    progress: 45,
    startDate: "2023-10-01",
    dueDate: "2023-12-20",
    budget: "$15,300",
    team: ["John Smith", "Robert Chen"],
  },
  {
    id: "PRJ-2023-005",
    name: "Martinez Garden Redesign",
    client: "Martinez Family",
    status: "On Hold",
    progress: 30,
    startDate: "2023-09-15",
    dueDate: "2023-11-30",
    budget: "$5,750",
    team: ["Maria Garcia"],
  },
];

// Added local storage for persisting new projects
const getLocalProjects = () => {
  try {
    const storedProjects = localStorage.getItem('newProjects');
    return storedProjects ? JSON.parse(storedProjects) : [];
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
    return [];
  }
};

export const addProject = (project) => {
  try {
    const newProject = {
      ...project,
      id: `PRJ-${new Date().getFullYear()}-${String(projects.length + 1).padStart(3, '0')}`,
      progress: project.status === 'Completed' ? 100 : (project.status === 'Planning' ? 10 : 30),
      // Format dates consistently with existing projects
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      dueDate: project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : '',
      // Format budget with dollar sign
      budget: project.budget ? `$${project.budget}` : '$0',
      // Default team if none provided
      team: project.team || [],
    };
    
    const localProjects = getLocalProjects();
    localProjects.push(newProject);
    localStorage.setItem('newProjects', JSON.stringify(localProjects));
    return newProject;
  } catch (error) {
    console.error('Error saving project:', error);
    return null;
  }
};

export const useProjects = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("dueDate");
  
  // Combine predefined projects with any user-created projects stored in localStorage
  const allProjects = [...projects, ...getLocalProjects()];

  const getStatusColor = (status: string) => {
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

  const filteredProjects = allProjects.filter((project) => {
    if (statusFilter === "all") return true;
    return project.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOrder === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortOrder === "progress") {
      return b.progress - a.progress;
    } else if (sortOrder === "budget") {
      return (
        parseFloat(b.budget.replace("$", "").replace(",", "")) -
        parseFloat(a.budget.replace("$", "").replace(",", ""))
      );
    }
    return 0;
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
