
import { useState, useEffect } from "react";
import { getAllProjects } from "../../../projects/hooks/projectData";

export const useProjectsData = (lastUpdate: number) => {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const loadProjects = () => {
      const allProjects = getAllProjects();
      setProjects(allProjects);
    };

    loadProjects();
  }, [lastUpdate]);

  return projects;
};
