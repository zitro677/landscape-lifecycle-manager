
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";
import { addProject, updateProject } from "./projectOperations";

// Define schema for form validation
export const projectFormSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  client: z.string().min(2, "Client name is required"),
  status: z.string(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.date(),
  dueDate: z.date(),
  budget: z.string().min(1, "Budget is required"),
  estimatedHours: z.string().min(1, "Estimated hours are required"),
  team: z.array(z.string()).optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const useProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialProject, setInitialProject] = useState<any>(null);
  const [loading, setLoading] = useState(id ? true : false);

  // Initialize form with default values
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      client: "",
      status: "Planning",
      description: "",
      startDate: new Date(),
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      budget: "",
      estimatedHours: "",
      team: [],
    },
  });

  // Load project data if in edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);

      const loadProject = () => {
        console.log("Loading project for edit with ID:", id);
        
        // Check localStorage first (for user-created projects)
        const storedUserProjects = localStorage.getItem("landscape_projects");
        const userProjects = storedUserProjects ? JSON.parse(storedUserProjects) : [];
        
        // Check default projects
        let foundProject = null;
        
        try {
          // First check if we have it in user projects
          if (userProjects.length > 0) {
            foundProject = userProjects.find((p: any) => p.id === id);
          }
          
          // If not found in user projects, check the projectsData
          if (!foundProject) {
            const projectsData = localStorage.getItem("projectsData");
            if (projectsData) {
              const projects = JSON.parse(projectsData);
              foundProject = projects.find((p: any) => p.id === id);
            }
          }
          
          // Also check static project data
          if (!foundProject) {
            // Import the static projects for fallback
            const { projects } = require("./useProjects");
            foundProject = projects.find((p: any) => p.id === id);
          }
          
          if (foundProject) {
            console.log("Project found for editing:", foundProject);
            setInitialProject(foundProject);
            
            // Format dates properly
            const startDate = foundProject.startDate ? new Date(foundProject.startDate) : new Date();
            const dueDate = foundProject.dueDate ? new Date(foundProject.dueDate) : new Date(new Date().setMonth(new Date().getMonth() + 1));
            
            // Set form values
            form.reset({
              name: foundProject.name || "",
              client: foundProject.client || "",
              status: foundProject.status || "Planning",
              description: foundProject.description || "",
              startDate: startDate,
              dueDate: dueDate,
              budget: foundProject.budget?.toString().replace(/[$,]/g, '') || "",
              estimatedHours: foundProject.estimatedHours?.toString() || "",
              team: foundProject.team || [],
            });
          } else {
            console.error("Project not found for editing with ID:", id);
            toast.error("Project not found for editing");
            navigate("/projects");
          }
        } catch (error) {
          console.error("Error loading project for edit:", error);
          toast.error("Error loading project for editing");
        }
        
        setLoading(false);
      };
      
      loadProject();
    }
  }, [id, navigate, form]);

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Form submission data:", data);
      
      if (isEditMode && id) {
        // Update existing project
        console.log("Updating project with ID:", id);
        
        const formattedData = {
          ...data,
          startDate: format(data.startDate, "yyyy-MM-dd"),
          dueDate: format(data.dueDate, "yyyy-MM-dd"),
        };
        
        const updatedProject = updateProject(id, formattedData);
        
        if (updatedProject) {
          console.log("Project updated successfully:", updatedProject);
          toast.success("Project updated successfully");
          navigate(`/projects/${id}`);
        } else {
          console.error("Failed to update project");
          toast.error("Failed to update project");
        }
      } else {
        // Create new project
        const formattedData = {
          ...data,
          startDate: format(data.startDate, "yyyy-MM-dd"),
          dueDate: format(data.dueDate, "yyyy-MM-dd"),
        };
        
        const newProject = addProject(formattedData);
        
        if (newProject) {
          toast.success("Project created successfully");
          navigate("/projects");
        } else {
          toast.error("Failed to create project");
        }
      }
    } catch (error) {
      console.error(isEditMode ? "Error updating project:" : "Error creating project:", error);
      toast.error(isEditMode ? "Failed to update project" : "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status options
  const statusOptions = [
    { value: "Planning", label: "Planning" },
    { value: "In Progress", label: "In Progress" },
    { value: "On Hold", label: "On Hold" },
    { value: "Completed", label: "Completed" },
  ];

  return {
    form,
    isSubmitting,
    isEditMode,
    loading,
    statusOptions,
    initialProject,
    onSubmit,
    navigate
  };
};
