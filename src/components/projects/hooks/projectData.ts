
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useProjectData = (projectId: string) => {
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (error) {
          console.error("Error fetching project:", error);
          return;
        }

        setProject(data);
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  return { project, isLoading, setProject };
};
