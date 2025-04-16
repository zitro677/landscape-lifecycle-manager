
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useProjectActions } from "./hooks/useProjectActions";

interface ProjectOverviewProps {
  project: any;
  extraData: any;
  teamSize: number;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  extraData,
  teamSize,
}) => {
  const [showProgressEdit, setShowProgressEdit] = useState(false);
  const [progressValue, setProgressValue] = useState(project.progress);
  
  const { handleUpdateProgress } = useProjectActions(project.id, project.name);

  const saveProgress = () => {
    handleUpdateProgress(progressValue);
    setShowProgressEdit(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="col-span-full lg:col-span-2"
    >
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>
            Client: {project.client}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {extraData.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mt-6">
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Timeline</h3>
                <p className="text-sm text-muted-foreground">
                  {project.startDate} to {project.dueDate}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Hours</h3>
                <p className="text-sm text-muted-foreground">
                  {extraData.hoursLogged} of {extraData.estimatedHours} hrs logged
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Budget</h3>
                <p className="text-sm text-muted-foreground">
                  {extraData.totalCost} of {project.budget} used
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Team</h3>
                <p className="text-sm text-muted-foreground">
                  {teamSize} team members assigned
                </p>
              </div>
            </div>
          </div>

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
                <Progress value={project.progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">
                  {project.progress}% Complete
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectOverview;
