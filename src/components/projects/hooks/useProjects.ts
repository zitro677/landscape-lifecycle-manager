
import { useState } from "react";

// Mock project data (would come from an API/database in a real app)
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

// Local storage utility functions
const LOCAL_STORAGE_KEY = 'newProjects';

const getLocalProjects = () => {
  try {
    const storedProjects = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedProjects ? JSON.parse(storedProjects) : [];
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
    return [];
  }
};

const saveLocalProjects = (projectsData) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projectsData));
    return true;
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
    return false;
  }
};

// Format and generate a new project
const formatNewProject = (project) => {
  return {
    ...project,
    id: generateProjectId(),
    progress: calculateInitialProgress(project.status),
    startDate: formatDate(project.startDate),
    dueDate: formatDate(project.dueDate),
    budget: formatBudget(project.budget),
    team: project.team || [],
  };
};

// Helper functions for project formatting
const generateProjectId = () => {
  return `PRJ-${new Date().getFullYear()}-${String(projects.length + getLocalProjects().length + 1).padStart(3, '0')}`;
};

const calculateInitialProgress = (status) => {
  switch (status) {
    case 'Completed': return 100;
    case 'Planning': return 10;
    case 'In Progress': return 30;
    case 'On Hold': return 30;
    default: return 0;
  }
};

const formatDate = (dateString) => {
  return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
};

const formatBudget = (budget) => {
  return budget ? `$${budget}` : '$0';
};

// Add a new project
export const addProject = (project) => {
  try {
    const newProject = formatNewProject(project);
    const localProjects = getLocalProjects();
    localProjects.push(newProject);
    saveLocalProjects(localProjects);
    return newProject;
  } catch (error) {
    console.error('Error saving project:', error);
    return null;
  }
};

// Get status color based on project status
export const getStatusColor = (status) => {
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

// Main hook for managing projects
export const useProjects = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("dueDate");
  
  // Combine predefined projects with any user-created projects stored in localStorage
  const allProjects = [...projects, ...getLocalProjects()];

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
