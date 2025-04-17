
// Local storage utility functions for projects
const LOCAL_STORAGE_KEY = 'landscape_projects';

export const getLocalProjects = () => {
  try {
    const storedProjects = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedProjects ? JSON.parse(storedProjects) : [];
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
    return [];
  }
};

export const saveLocalProjects = (projectsData: any[]) => {
  try {
    const projectsJson = JSON.stringify(projectsData);
    localStorage.setItem(LOCAL_STORAGE_KEY, projectsJson);
    console.log(`Saved ${projectsData.length} projects to localStorage`);
    return true;
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
    return false;
  }
};
