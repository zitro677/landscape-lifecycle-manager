
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

  const handleExportProject = (project: any, extraData: any, teamMembers: any[]) => {
    toast({
      title: "Export Project",
      description: "Generating project PDF...",
    });
    
    // Use dynamic import to load the PDF generator only when needed
    import("../utils/ProjectPdfGenerator").then((module) => {
      const ProjectPdfGenerator = module.default;
      const { generatePDF } = ProjectPdfGenerator({ project, extraData, teamMembers });
      
      // Generate the PDF
      const success = generatePDF();
      
      if (!success) {
        toast({
          title: "Export Failed",
          description: "Failed to generate project PDF.",
          variant: "destructive"
        });
      }
    }).catch((error) => {
      console.error("Error loading PDF generator:", error);
      toast({
        title: "Export Failed",
        description: "There was an error generating the PDF.",
        variant: "destructive"
      });
    });
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
