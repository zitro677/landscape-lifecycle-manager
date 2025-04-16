
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

interface ProgressSectionProps {
  progress: number;
  onUpdateProgress: (newProgress: number) => void;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ 
  progress, 
  onUpdateProgress 
}) => {
  const [showProgressEdit, setShowProgressEdit] = useState(false);
  const [progressValue, setProgressValue] = useState(progress);

  const saveProgress = () => {
    onUpdateProgress(progressValue);
    setShowProgressEdit(false);
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Progress</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowProgressEdit(!showProgressEdit)}
        >
          {showProgressEdit ? "Cancel" : "Edit Progress"}
        </Button>
      </div>
      
      {showProgressEdit ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Slider
              value={[progressValue]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setProgressValue(value[0])}
              className="flex-1"
            />
            <span className="text-sm font-medium min-w-10 text-right">
              {progressValue}%
            </span>
          </div>
          <Button size="sm" onClick={saveProgress}>Save Progress</Button>
        </div>
      ) : (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {progress}% Complete
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressSection;
