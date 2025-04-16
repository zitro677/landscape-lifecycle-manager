
// Functions for adding and updating projects
import { getAllProjects } from './projectData';
import { getLocalProjects, saveLocalProjects } from './projectStorage';
import { generateProjectId, calculateInitialProgress, formatDate, formatBudget } from './projectUtils';

// Format and generate a new project
export const formatNewProject = (project: any) => {
  return {
    ...project,
    id: generateProjectId(getAllProjects().length),
    progress: calculateInitialProgress(project.status),
    startDate: formatDate(project.startDate),
    dueDate: formatDate(project.dueDate),
    budget: formatBudget(project.budget),
    team: project.team || [],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
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

// Update an existing project - simplified version
export const updateProject = (id: string, projectData: any) => {
  try {
    console.log("Updating project with ID:", id, projectData);
    
    // Get existing projects from localStorage
    const localProjects = getLocalProjects();
    
    // Find the project to update - ensure string comparison
    const projectIndex = localProjects.findIndex((p: any) => String(p.id) === String(id));
    
    if (projectIndex >= 0) {
      // Format the data before update
      const formattedData = {
        ...projectData,
        budget: formatBudget(projectData.budget),
        startDate: typeof projectData.startDate === 'string' ? projectData.startDate : formatDate(projectData.startDate),
        dueDate: typeof projectData.dueDate === 'string' ? projectData.dueDate : formatDate(projectData.dueDate),
        updatedAt: new Date().toISOString()
      };
      
      // Update the project by merging existing project with new data
      const updatedProject = {
        ...localProjects[projectIndex],
        ...formattedData
      };
      
      localProjects[projectIndex] = updatedProject;
      
      // Save updated projects back to localStorage
      saveLocalProjects(localProjects);
      
      console.log("Project updated successfully:", updatedProject);
      return updatedProject;
    } else {
      // Handle projects from default data
      const allProjects = getAllProjects();
      const defaultProject = allProjects.find(p => String(p.id) === String(id));
      
      if (defaultProject) {
        // Format the data before creating a copy
        const formattedData = {
          ...projectData,
          budget: formatBudget(projectData.budget),
          startDate: typeof projectData.startDate === 'string' ? projectData.startDate : formatDate(projectData.startDate),
          dueDate: typeof projectData.dueDate === 'string' ? projectData.dueDate : formatDate(projectData.dueDate),
        };
        
        // Create a copy in user projects (with updates)
        const projectToCopy = {
          ...defaultProject,
          ...formattedData,
          updatedAt: new Date().toISOString(),
        };
        
        localProjects.push(projectToCopy);
        saveLocalProjects(localProjects);
        
        console.log("Default project copied and updated:", projectToCopy);
        return projectToCopy;
      }
      
      console.error("Project not found for update:", id);
      return null;
    }
  } catch (error) {
    console.error("Error updating project:", error);
    return null;
  }
};
