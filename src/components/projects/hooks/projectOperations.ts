
// Functions for adding and updating projects
import { getAllProjects } from './projectData';
import { getLocalProjects, saveLocalProjects } from './projectStorage';

// Format and generate a new project
export const formatNewProject = (project: any) => {
  return {
    ...project,
    id: generateProjectId(),
    progress: calculateInitialProgress(project.status),
    startDate: project.startDate,
    dueDate: project.dueDate,
    budget: formatBudget(project.budget),
    team: project.team || [],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
};

// Generate a unique ID for new projects
const generateProjectId = () => {
  return 'p-' + Math.random().toString(36).substring(2, 11);
};

// Calculate initial progress based on status
const calculateInitialProgress = (status: string) => {
  switch (status) {
    case 'Planning':
      return 0;
    case 'In Progress':
      return 25;
    case 'On Hold':
      return 50;
    case 'Completed':
      return 100;
    default:
      return 0;
  }
};

// Format budget value
export const formatBudget = (budget: string | number) => {
  if (!budget) return '0';
  
  // Remove currency symbol and commas
  const cleanValue = typeof budget === 'string' 
    ? budget.replace(/[$,]/g, '') 
    : budget.toString();
  
  // Convert to number and format
  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? '0' : numValue.toString();
};

// Add a new project
export const addProject = (project: any) => {
  try {
    const newProject = formatNewProject(project);
    const localProjects = getLocalProjects();
    localProjects.push(newProject);
    saveLocalProjects(localProjects);
    console.log("Project added successfully:", newProject);
    return newProject;
  } catch (error) {
    console.error('Error saving project:', error);
    return null;
  }
};

// Update an existing project
export const updateProject = (projectId: string, projectData: any) => {
  try {
    console.log("Updating project:", projectId, projectData);
    
    if (!projectId) {
      console.error("No project ID provided for update");
      return null;
    }
    
    // Get local projects
    const localProjects = getLocalProjects();
    
    // Convert projectId to string for comparison
    const idToUpdate = String(projectId);
    
    // Find project index
    const projectIndex = localProjects.findIndex(
      (p: any) => String(p.id) === idToUpdate
    );
    
    console.log("Project index in local storage:", projectIndex);
    
    if (projectIndex >= 0) {
      // Project exists in local storage, update it
      const existingProject = localProjects[projectIndex];
      
      // Format data for update
      const updatedProject = {
        ...existingProject,
        ...projectData,
        budget: projectData.budget ? formatBudget(projectData.budget) : existingProject.budget,
        updatedAt: new Date().toISOString(),
        // Preserve these fields from the original
        id: existingProject.id,
        createdAt: existingProject.createdAt,
      };
      
      // Handle progress update specifically
      if (projectData.progress !== undefined) {
        updatedProject.progress = projectData.progress;
      } else if (projectData.status !== existingProject.status) {
        // Update progress based on status if it changed
        updatedProject.progress = calculateInitialProgress(projectData.status);
      }
      
      console.log("Updated project will be:", updatedProject);
      
      // Update project in array
      localProjects[projectIndex] = updatedProject;
      
      // Save updated array
      const saved = saveLocalProjects(localProjects);
      console.log("Project updated successfully:", updatedProject);
      
      if (saved) {
        return updatedProject;
      } else {
        console.error("Failed to save updated projects");
        return null;
      }
    } else {
      // Project not found in local storage, try adding it as new
      console.log("Project not found in local storage, creating a new one");
      const newProjectData = {
        ...projectData,
        id: projectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: projectData.progress !== undefined ? projectData.progress : calculateInitialProgress(projectData.status || 'Planning'),
      };
      
      localProjects.push(newProjectData);
      const saved = saveLocalProjects(localProjects);
      
      if (saved) {
        console.log("New project created:", newProjectData);
        return newProjectData;
      } else {
        console.error("Failed to save new project");
        return null;
      }
    }
  } catch (error) {
    console.error("Error updating project:", error);
    return null;
  }
};
