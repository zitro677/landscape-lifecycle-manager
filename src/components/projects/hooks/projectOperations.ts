
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

// Update an existing project
export const updateProject = (id: string, projectData: any) => {
  try {
    console.log("Updating project with ID:", id, projectData);
    
    // Get existing projects from localStorage
    const projects = getLocalProjects();
    
    // Find the project to update
    const projectIndex = projects.findIndex((p: any) => p.id === id);
    
    if (projectIndex >= 0) {
      // Update the project
      const updatedProject = {
        ...projects[projectIndex],
        ...projectData,
        updatedAt: new Date().toISOString(),
        // Make sure these fields are formatted correctly
        budget: formatBudget(projectData.budget),
        startDate: typeof projectData.startDate === 'string' ? projectData.startDate : formatDate(projectData.startDate),
        dueDate: typeof projectData.dueDate === 'string' ? projectData.dueDate : formatDate(projectData.dueDate),
      };
      
      projects[projectIndex] = updatedProject;
      
      // Save updated projects back to localStorage
      saveLocalProjects(projects);
      
      console.log("Project updated successfully:", updatedProject);
      return updatedProject;
    } else {
      // Project not found in user projects, check if it's in default projects
      const defaultProjects = getAllProjects().filter(p => !getLocalProjects().some(lp => lp.id === p.id));
      const defaultProject = defaultProjects.find(p => p.id === id);
      
      if (defaultProject) {
        // Create a copy in user projects (with updates)
        const projectToCopy = {
          ...defaultProject,
          ...projectData,
          updatedAt: new Date().toISOString(),
          // Make sure these fields are formatted correctly
          budget: formatBudget(projectData.budget),
          startDate: typeof projectData.startDate === 'string' ? projectData.startDate : formatDate(projectData.startDate),
          dueDate: typeof projectData.dueDate === 'string' ? projectData.dueDate : formatDate(projectData.dueDate),
        };
        
        projects.push(projectToCopy);
        saveLocalProjects(projects);
        
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
