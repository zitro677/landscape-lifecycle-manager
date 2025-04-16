
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProjectTitle from "./components/ProjectTitle";
import ProjectActions from "./components/ProjectActions";
import { useProjectActions } from "./hooks/useProjectActions";

interface ProjectHeaderProps {
  projectId: string;
  projectName: string;
  projectStatus: string;
  getStatusColor: (status: string) => string;
  project: any;
  extraData: any;
  teamMembers: any[];
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectId,
  projectName,
  projectStatus,
  getStatusColor,
  project,
  extraData,
  teamMembers
}) => {
  const navigate = useNavigate();
  const { handleEditProject, handleShareProject, handleExportProject } = useProjectActions(projectId, projectName);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/projects")}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <ProjectTitle 
          projectId={projectId}
          projectName={projectName}
          projectStatus={projectStatus}
          getStatusColor={getStatusColor}
        />
      </div>

      <ProjectActions
        onShare={handleShareProject}
        onExport={() => handleExportProject(project, extraData, teamMembers)}
        onEdit={handleEditProject}
      />
    </div>
  );
};

export default ProjectHeader;
