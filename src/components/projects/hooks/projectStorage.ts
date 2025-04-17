
// Local storage utility functions for projects
const LOCAL_STORAGE_KEY = 'landscape_projects';

/**
 * Get all projects from local storage
 * @returns Array of projects
 */
export const getLocalProjects = () => {
  try {
    const storedProjects = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedProjects ? JSON.parse(storedProjects) : [];
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
    return [];
  }
};

/**
 * Save projects to local storage
 * @param projects Array of projects to save
 * @returns Boolean indicating success
 */
export const saveLocalProjects = (projects: any[]) => {
  try {
    const projectsJson = JSON.stringify(projects);
    localStorage.setItem(LOCAL_STORAGE_KEY, projectsJson);
    console.log(`Saved ${projects.length} projects to localStorage`);
    return true;
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
    return false;
  }
};

/**
 * Get a single project by ID
 * @param id Project ID
 * @returns Project object or null if not found
 */
export const getProjectById = (id: string) => {
  try {
    if (!id) return null;
    
    const projects = getLocalProjects();
    return projects.find((project: any) => String(project.id) === String(id)) || null;
  } catch (error) {
    console.error('Error getting project by ID:', error);
    return null;
  }
};

/**
 * Delete a project by ID
 * @param id Project ID to delete
 * @returns Boolean indicating success
 */
export const deleteProject = (id: string) => {
  try {
    if (!id) return false;
    
    const projects = getLocalProjects();
    const filteredProjects = projects.filter((project: any) => String(project.id) !== String(id));
    
    if (projects.length === filteredProjects.length) {
      console.warn('Project not found for deletion:', id);
      return false;
    }
    
    return saveLocalProjects(filteredProjects);
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};
