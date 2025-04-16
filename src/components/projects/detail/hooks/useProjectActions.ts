
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { updateProject } from "../../hooks/useProjects";

export const useProjectActions = (projectId: string, projectName: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEditProject = () => {
    // Navigate to the edit project form with the project id
    console.log(`Navigating to edit project: ${projectId}`);
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

  // New function to update project progress
  const handleUpdateProgress = (newProgress: number) => {
    if (newProgress < 0 || newProgress > 100) {
      toast({
        title: "Invalid Progress Value",
        description: "Progress must be between 0 and 100.",
        variant: "destructive"
      });
      return;
    }

    // Update the project with the new progress
    const result = updateProject(projectId, { progress: newProgress });
    
    if (result) {
      toast({
        title: "Project Updated",
        description: `Project progress updated to ${newProgress}%.`,
      });
      
      // Force reload to see changes
      window.location.reload();
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update project progress.",
        variant: "destructive"
      });
    }
  };

  return {
    handleEditProject,
    handleShareProject,
    handleExportProject,
    handleUpdateProgress
  };
};
