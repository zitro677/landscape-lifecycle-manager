
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, DollarSign, Users, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useProjectActions } from "./hooks/useProjectActions";

interface ProjectOverviewProps {
  project: any;
  extraData: any;
  teamSize: number;
  saveExtraData: (data: any) => void;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  extraData,
  teamSize,
  saveExtraData,
}) => {
  const [showProgressEdit, setShowProgressEdit] = useState(false);
  const [progressValue, setProgressValue] = useState(project.progress);
  const [showHoursEdit, setShowHoursEdit] = useState(false);
  const [hoursValue, setHoursValue] = useState(extraData.estimatedHours || 0);
  const [hoursLoggedValue, setHoursLoggedValue] = useState(extraData.hoursLogged || 0);
  const [showBudgetEdit, setShowBudgetEdit] = useState(false);
  const [budgetValue, setBudgetValue] = useState(project.budget || 0);
  const [budgetUsedValue, setBudgetUsedValue] = useState(extraData.totalCost || 0);
  
  const { handleUpdateProgress } = useProjectActions(project.id, project.name);

  const saveProgress = () => {
    handleUpdateProgress(progressValue);
    setShowProgressEdit(false);
  };

  const saveHours = () => {
    const updatedExtraData = {
      ...extraData,
      estimatedHours: hoursValue,
      hoursLogged: hoursLoggedValue
    };
    saveExtraData(updatedExtraData);
    setShowHoursEdit(false);
  };

  const saveBudget = () => {
    // Update both project budget and extraData totalCost
    const updatedProject = {
      ...project,
      budget: budgetValue
    };
    
    // Update the project in localStorage
    const projectsJson = localStorage.getItem("landscape_projects");
    if (projectsJson) {
      const projects = JSON.parse(projectsJson);
      const projectIndex = projects.findIndex((p: any) => p.id === project.id);
      if (projectIndex !== -1) {
        projects[projectIndex] = {
          ...projects[projectIndex],
          budget: budgetValue
        };
        localStorage.setItem("landscape_projects", JSON.stringify(projects));
      }
    }
    
    // Also update extraData
    const updatedExtraData = {
      ...extraData,
      totalCost: budgetUsedValue
    };
    saveExtraData(updatedExtraData);
    
    // Refresh the page to see changes
    window.location.reload();
    
    setShowBudgetEdit(false);
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
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Hours</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowHoursEdit(!showHoursEdit)}
                    className="h-7 px-2"
                  >
                    {showHoursEdit ? "Cancel" : <Edit2 className="h-3.5 w-3.5" />}
                  </Button>
                </div>
                {showHoursEdit ? (
                  <div className="space-y-2 mt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Hours Logged</label>
                        <Input
                          type="number"
                          value={hoursLoggedValue}
                          onChange={(e) => setHoursLoggedValue(Number(e.target.value))}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Estimated Hours</label>
                        <Input
                          type="number"
                          value={hoursValue}
                          onChange={(e) => setHoursValue(Number(e.target.value))}
                          className="h-8"
                        />
                      </div>
                    </div>
                    <Button size="sm" onClick={saveHours} className="w-full">Save Hours</Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {extraData.hoursLogged} of {extraData.estimatedHours} hrs logged
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Budget</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowBudgetEdit(!showBudgetEdit)}
                    className="h-7 px-2"
                  >
                    {showBudgetEdit ? "Cancel" : <Edit2 className="h-3.5 w-3.5" />}
                  </Button>
                </div>
                {showBudgetEdit ? (
                  <div className="space-y-2 mt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Budget Used</label>
                        <Input
                          type="number"
                          value={budgetUsedValue}
                          onChange={(e) => setBudgetUsedValue(Number(e.target.value))}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Total Budget</label>
                        <Input
                          type="number"
                          value={budgetValue}
                          onChange={(e) => setBudgetValue(Number(e.target.value))}
                          className="h-8"
                        />
                      </div>
                    </div>
                    <Button size="sm" onClick={saveBudget} className="w-full">Save Budget</Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {extraData.totalCost} of {project.budget} used
                  </p>
                )}
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
