
import { useState, useEffect } from "react";
import { getProjectExtraData } from "../ProjectDataProvider";

export const useProjectData = (projectId: string) => {
  // State for the project extra data
  const [extraData, setExtraData] = useState<any>({});
  
  // Fetch the current project data from localStorage when the component mounts or projectId changes
  useEffect(() => {
    loadExtraData();
  }, [projectId]);
  
  // Load extra data from localStorage
  const loadExtraData = () => {
    console.log("Loading extra data for project:", projectId);
    
    // Check user-created projects first
    const userProjectsStr = localStorage.getItem("landscape_projects");
    if (userProjectsStr) {
      try {
        const userProjects = JSON.parse(userProjectsStr);
        const userProject = userProjects.find((p: any) => p.id === projectId);
        
        if (userProject && userProject.extraData) {
          console.log("Found user project extra data:", userProject.extraData);
          setExtraData(userProject.extraData);
          return;
        }
      } catch (error) {
        console.error("Error parsing user projects:", error);
      }
    }
    
    // Check default projects
    const storedProjects = localStorage.getItem("projectsData");
    if (storedProjects) {
      try {
        const projectsData = JSON.parse(storedProjects);
        const projectData = projectsData.find((p: any) => p.id === projectId);
        
        if (projectData && projectData.extraData) {
          console.log("Found project extra data:", projectData.extraData);
          setExtraData(projectData.extraData);
          return;
        }
      } catch (error) {
        console.error("Error parsing projects data:", error);
      }
    }
    
    // If no extra data found, use default
    const defaultData = getProjectExtraData(projectId);
    console.log("Using default extra data:", defaultData);
    setExtraData(defaultData);
  };
  
  // Helper to save the updated extra data to localStorage
  const saveExtraData = (updatedExtraData: any) => {
    console.log("Saving extra data for project:", projectId, updatedExtraData);
    
    // First check user projects
    const userProjectsStr = localStorage.getItem("landscape_projects");
    if (userProjectsStr) {
      try {
        let userProjects = JSON.parse(userProjectsStr);
        let userProjectIndex = userProjects.findIndex((p: any) => p.id === projectId);
        
        if (userProjectIndex !== -1) {
          // Update user project
          userProjects[userProjectIndex].extraData = updatedExtraData;
          localStorage.setItem("landscape_projects", JSON.stringify(userProjects));
          setExtraData(updatedExtraData);
          return;
        }
      } catch (error) {
        console.error("Error updating user projects:", error);
      }
    }
    
    // Then check default projects
    const storedProjects = localStorage.getItem("projectsData");
    if (storedProjects) {
      try {
        let projectsData = JSON.parse(storedProjects);
        let projectIndex = projectsData.findIndex((p: any) => p.id === projectId);
        
        if (projectIndex !== -1) {
          // Update project data
          projectsData[projectIndex].extraData = updatedExtraData;
          localStorage.setItem("projectsData", JSON.stringify(projectsData));
        } else {
          // If project doesn't exist in projectsData, add it
          const newProject = { id: projectId, extraData: updatedExtraData };
          projectsData.push(newProject);
          localStorage.setItem("projectsData", JSON.stringify(projectsData));
        }
      } catch (error) {
        console.error("Error updating projects data:", error);
      }
    } else {
      // If projectsData doesn't exist, create it
      const newProjectsData = [{ id: projectId, extraData: updatedExtraData }];
      localStorage.setItem("projectsData", JSON.stringify(newProjectsData));
    }
    
    // Update the state
    setExtraData(updatedExtraData);
  };

  return {
    extraData,
    loadExtraData,
    saveExtraData
  };
};
