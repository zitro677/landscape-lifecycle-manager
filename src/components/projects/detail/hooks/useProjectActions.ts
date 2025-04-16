
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

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

  return {
    handleEditProject,
    handleShareProject,
    handleExportProject
  };
};
