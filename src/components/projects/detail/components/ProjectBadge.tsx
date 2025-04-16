
import React from "react";
import { Badge } from "@/components/ui/badge";

interface ProjectBadgeProps {
  status: string;
  getStatusColor: (status: string) => string;
}

const ProjectBadge: React.FC<ProjectBadgeProps> = ({ 
  status, 
  getStatusColor,
}) => {
  return (
    <Badge className={getStatusColor(status)}>
      {status}
    </Badge>
  );
};

export default ProjectBadge;
