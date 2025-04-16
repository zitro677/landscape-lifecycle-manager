
import { useState, useEffect } from "react";
import { getProjectExtraData } from "../ProjectDataProvider";

export const useProjectData = (projectId: string) => {
  // State for the project extra data
  const [extraData, setExtraData] = useState<any>({});
  
  // Fetch the current project data from localStorage when the component mounts or projectId changes
  useEffect(() => {
    const storedProjects = localStorage.getItem("projectsData");
    if (storedProjects) {
      const projectsData = JSON.parse(storedProjects);
      
      // Find if our project has extra data stored
      const projectData = projectsData.find((p: any) => p.id === projectId);
      if (projectData && projectData.extraData) {
        setExtraData(projectData.extraData);
      } else {
        // If no extra data, use default
        setExtraData(getProjectExtraData(projectId));
      }
    } else {
      // If no projects data at all, use default
      setExtraData(getProjectExtraData(projectId));
    }
  }, [projectId]);
  
  // Helper to save the updated extra data to localStorage
  const saveExtraData = (updatedExtraData: any) => {
    const storedProjects = localStorage.getItem("projectsData");
    if (storedProjects) {
      let projectsData = JSON.parse(storedProjects);
      
      // Find the project and update or add its extraData
      let projectIndex = projectsData.findIndex((p: any) => p.id === projectId);
      if (projectIndex !== -1) {
        projectsData[projectIndex].extraData = updatedExtraData;
      }
      
      // Save back to localStorage
      localStorage.setItem("projectsData", JSON.stringify(projectsData));
      
      // Update the component state
      setExtraData(updatedExtraData);
    }
  };

  return {
    extraData,
    saveExtraData
  };
};
