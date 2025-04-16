
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, DollarSign, Users } from "lucide-react";

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
            <h3 className="font-medium mb-2">Progress</h3>
            <div className="space-y-1">
              <Progress value={project.progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {project.progress}% Complete
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectOverview;
