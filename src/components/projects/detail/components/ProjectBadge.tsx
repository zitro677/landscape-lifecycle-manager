import React from "react";
import { Badge } from "@/components/ui/badge";
import StatusSelector from "./StatusSelector";

interface ProjectBadgeProps {
  status: string;
  getStatusColor: (status: string) => string;
  projectId?: string;
  editable?: boolean;
  onStatusChange?: (newStatus: string) => void;
}

const ProjectBadge: React.FC<ProjectBadgeProps> = ({ 
  status, 
  getStatusColor,
  projectId,
  editable = false,
  onStatusChange
}) => {
  // If editable and we have a projectId, show the status selector
  if (editable && projectId) {
    return (
      <StatusSelector
        projectId={projectId}
        currentStatus={status}
        getStatusColor={getStatusColor}
        onStatusChange={onStatusChange}
      />
    );
  }
  
  // Otherwise just show the badge
  return (
    <Badge className={getStatusColor(status)}>
      {status}
    </Badge>
  );
};

export default ProjectBadge;
