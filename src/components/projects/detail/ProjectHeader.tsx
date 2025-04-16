
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share, Download, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProjectHeaderProps {
  projectId: string;
  projectName: string;
  projectStatus: string;
  getStatusColor: (status: string) => string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectId,
  projectName,
  projectStatus,
  getStatusColor,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEditProject = () => {
    // Navigate to the edit project form with the project id
    navigate(`/projects/edit/${projectId}`);
  };

  const handleShareProject = () => {
    toast({
      title: "Share Project",
      description: "Project sharing link copied to clipboard.",
    });
    
    // In a real app, this would generate a sharing link
    // For now, just simulate copying to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/projects/${projectId}`).catch(() => {
      toast({
        title: "Clipboard Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive"
      });
    });
  };

  const handleExportProject = () => {
    toast({
      title: "Export Project",
      description: "Project export started. The file will download shortly.",
    });
    
    // In a real app, this would generate a PDF or export file
    // For now, just show a toast
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Project "${projectName}" has been exported.`,
      });
    }, 1500);
  };

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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">{projectName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">Project {projectId}</p>
            <Badge className={getStatusColor(projectStatus)}>
              {projectStatus}
            </Badge>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-4 md:mt-0 flex flex-wrap gap-2"
      >
        <Button variant="outline" size="sm" className="gap-1" onClick={handleShareProject}>
          <Share className="h-4 w-4" />
          <span>Share</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-1" onClick={handleExportProject}>
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
        <Button size="sm" className="gap-1" onClick={handleEditProject}>
          <Edit className="h-4 w-4" />
          <span>Edit Project</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default ProjectHeader;
