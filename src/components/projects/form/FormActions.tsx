
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
  navigateBack: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isSubmitting, 
  isEditMode,
  navigateBack
}) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={navigateBack}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting 
          ? (isEditMode ? "Updating..." : "Creating...") 
          : (isEditMode ? "Update Project" : "Create Project")}
      </Button>
    </div>
  );
};

export default FormActions;
