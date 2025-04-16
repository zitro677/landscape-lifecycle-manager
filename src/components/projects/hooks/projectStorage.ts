
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
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projectsData));
    return true;
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
    return false;
  }
};
