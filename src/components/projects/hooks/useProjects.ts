
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  client_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async (projectData: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error("You must be logged in to create projects");
        return null;
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating project:", error);
        toast.error("Failed to create project");
        return null;
      }

      setProjects(prev => [data, ...prev]);
      toast.success("Project created successfully");
      return data;
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Error updating project:", error);
        toast.error("Failed to update project");
        return null;
      }

      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
      toast.success("Project updated successfully");
      return data;
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
      return null;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project");
        return false;
      }

      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success("Project deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
      return false;
    }
  };

  return {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    refetch: loadProjects,
  };
};
