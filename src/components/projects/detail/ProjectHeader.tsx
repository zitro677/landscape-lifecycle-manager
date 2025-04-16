
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  teamMembers,
}) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(projectStatus);
  const { handleEditProject, handleShareProject, handleExportProject } = useProjectActions(projectId, projectName);

  const handleStatusChange = (newStatus: string) => {
    console.log("Status changed to:", newStatus);
    setStatus(newStatus);
    
    // Update the project object with the new status
    if (project) {
      project.status = newStatus;
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/projects")}
              className="h-8 w-8 mt-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <ProjectTitle
              projectId={projectId}
              projectName={projectName}
              projectStatus={status}
              getStatusColor={getStatusColor}
              onStatusChange={handleStatusChange}
            />
          </div>
          <ProjectActions
            onEdit={handleEditProject}
            onShare={handleShareProject}
            onExport={() => handleExportProject(
              {...project, status}, // Use the updated status
              extraData,
              teamMembers
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectHeader;
