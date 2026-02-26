
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";
import { addProject, updateProject } from "./projectOperations";
import { supabase } from "@/integrations/supabase/client";

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

  // Load project data if editing
  useEffect(() => {
    if (id) {
      setIsEditMode(true);

      const loadProject = async () => {
        console.log("Loading project with ID:", id);
        
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .maybeSingle();

          if (error) {
            console.error("Error fetching project:", error);
            toast.error("Error loading project for editing");
            navigate("/projects");
            setLoading(false);
            return;
          }

          if (!data) {
            console.error("Project not found for editing with ID:", id);
            toast.error("Project not found for editing");
            navigate("/projects");
            setLoading(false);
            return;
          }

          console.log("Project found for editing:", data);
          setInitialProject(data);

          // Map DB status to display format
          const statusMap: Record<string, string> = {
            planning: "Planning",
            in_progress: "In Progress",
            on_hold: "On Hold",
            completed: "Completed",
          };
          const displayStatus = statusMap[data.status] || data.status;

          // Parse dates
          const startDate = data.start_date ? new Date(data.start_date + 'T00:00:00') : new Date();
          const dueDate = data.end_date ? new Date(data.end_date + 'T00:00:00') : new Date(new Date().setMonth(new Date().getMonth() + 1));

          form.reset({
            name: data.name || "",
            client: "",
            status: displayStatus,
            description: data.description || "",
            startDate,
            dueDate,
            budget: data.budget?.toString() || "",
            estimatedHours: data.hours_estimated?.toString() || "",
            team: [],
          });
        } catch (error) {
          console.error("Error loading project for edit:", error);
          toast.error("Error loading project for editing");
        }
        
        setLoading(false);
      };
      
      loadProject();
    }
  }, [id, navigate, form]);

  // Handle form submission
  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Form submission data:", data);
      
      // Map form fields to database columns
      const dbData = {
        name: data.name,
        description: data.description,
        status: data.status.toLowerCase().replace(/ /g, '_'),
        start_date: format(new Date(data.startDate), "yyyy-MM-dd"),
        end_date: format(new Date(data.dueDate), "yyyy-MM-dd"),
        budget: parseFloat(data.budget) || 0,
        hours_estimated: parseFloat(data.estimatedHours) || 0,
      };

      if (isEditMode && id) {
        console.log("Updating project with ID:", id);
        const updated = await updateProject(id, dbData);
        
        if (updated) {
          navigate(`/projects/${id}`);
        }
      } else {
        console.log("Creating new project");
        const newProject = await addProject(dbData);
        
        if (newProject) {
          navigate("/projects");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status options for the form
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
