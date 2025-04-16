
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AnimatedPage from "../shared/AnimatedPage";
import { addProject, updateProject } from "./hooks/useProjects";

// Define schema for form validation
const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

const ProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialProject, setInitialProject] = useState<any>(null);
  const [loading, setLoading] = useState(id ? true : false);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
            const { projects } = require("./hooks/useProjects");
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

  const onSubmit = async (data: FormValues) => {
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

  if (loading) {
    return (
      <AnimatedPage>
        <div className="page-container">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/projects")}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Loading Project...</h1>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="page-container">
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
              <h1 className="text-3xl font-bold">
                {isEditMode ? "Edit Project" : "Create New Project"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isEditMode 
                  ? "Update your landscape project details below"
                  : "Fill out the form below to create a new landscape project"}
              </p>
            </motion.div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle>Project Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter project name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="client"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter client name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statusOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle>Timeline & Budget</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={
                                      "w-full pl-3 text-left font-normal"
                                    }
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Due Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={
                                      "w-full pl-3 text-left font-normal"
                                    }
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="e.g. 5000"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="estimatedHours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimated Hours</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="e.g. 120"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Enter detailed project description..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/projects")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? (isEditMode ? "Updating..." : "Creating...") 
                  : (isEditMode ? "Update Project" : "Create Project")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AnimatedPage>
  );
};

export default ProjectForm;
