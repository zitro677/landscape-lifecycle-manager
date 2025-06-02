
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const updateProject = async (id: string, updates: any) => {
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

    toast.success("Project updated successfully");
    return data;
  } catch (error) {
    console.error("Error updating project:", error);
    toast.error("Failed to update project");
    return null;
  }
};
