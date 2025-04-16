
import React from "react";
import { motion } from "framer-motion";
import ProjectBadge from "./ProjectBadge";

interface ProjectTitleProps {
  projectId: string;
  projectName: string;
  projectStatus: string;
  getStatusColor: (status: string) => string;
}

const ProjectTitle: React.FC<ProjectTitleProps> = ({
  projectId,
  projectName,
  projectStatus,
  getStatusColor,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold">{projectName}</h1>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-muted-foreground">Project {projectId}</p>
        <ProjectBadge 
          status={projectStatus} 
          getStatusColor={getStatusColor} 
        />
      </div>
    </motion.div>
  );
};

export default ProjectTitle;
