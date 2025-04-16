
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
  };
};

// Add a new project
export const addProject = (project: any) => {
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

// Update an existing project
export const updateProject = (id: string, projectData: any) => {
  try {
    console.log("Updating project with ID:", id, projectData);
    
    // Get existing projects from localStorage
    const storedProjects = localStorage.getItem("landscape_projects");
    const projects = storedProjects ? JSON.parse(storedProjects) : [];
    
    // Find the project to update
    const projectIndex = projects.findIndex((p: any) => p.id === id);
    
    if (projectIndex >= 0) {
      // Update the project
      const updatedProject = {
        ...projects[projectIndex],
        ...projectData,
        updatedAt: new Date().toISOString(),
      };
      
      projects[projectIndex] = updatedProject;
      
      // Save updated projects back to localStorage
      localStorage.setItem("landscape_projects", JSON.stringify(projects));
      
      console.log("Project updated successfully:", updatedProject);
      return updatedProject;
    } else {
      // Project not found in user projects, check if it's in default projects
      const projectsData = localStorage.getItem("projectsData");
      if (projectsData) {
        const defaultProjects = JSON.parse(projectsData);
        const defaultProjectIndex = defaultProjects.findIndex((p: any) => p.id === id);
        
        if (defaultProjectIndex >= 0) {
          // Create a copy in user projects (with updates)
          const projectToCopy = {
            ...defaultProjects[defaultProjectIndex],
            ...projectData,
            updatedAt: new Date().toISOString(),
          };
          
          projects.push(projectToCopy);
          localStorage.setItem("landscape_projects", JSON.stringify(projects));
          
          console.log("Default project copied and updated:", projectToCopy);
          return projectToCopy;
        }
      }
      
      console.error("Project not found for update:", id);
      return null;
    }
  } catch (error) {
    console.error("Error updating project:", error);
    return null;
  }
};
