
// Mock project data and functions to get all projects
import { getLocalProjects } from './projectStorage';

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

// Get all projects (predefined + local)
export const getAllProjects = () => {
  return [...projects, ...getLocalProjects()];
};
