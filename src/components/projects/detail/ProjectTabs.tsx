
import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

interface ProjectTabsProps {
  extraData: any;
  getStatusColor: (status: string) => string;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ extraData, getStatusColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Tabs defaultValue="tasks" className="mb-6">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="pt-4">
          <Card className="card-shadow">
            <CardHeader className="flex-row justify-between items-center">
              <CardTitle>Project Tasks</CardTitle>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Task</span>
              </Button>
            </CardHeader>
            <CardContent>
              {extraData.tasks && extraData.tasks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Assignee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extraData.tasks.map((task: any, index: number) => (
                      <TableRow key={index} className="hover-scale">
                        <TableCell>{task.name}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>{task.assignee}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-4">No tasks added yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="pt-4">
          <Card className="card-shadow">
            <CardHeader className="flex-row justify-between items-center">
              <CardTitle>Materials</CardTitle>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Material</span>
              </Button>
            </CardHeader>
            <CardContent>
              {extraData.materials && extraData.materials.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extraData.materials.map((material: any, index: number) => (
                      <TableRow key={index} className="hover-scale">
                        <TableCell>{material.name}</TableCell>
                        <TableCell>{material.quantity}</TableCell>
                        <TableCell>{material.cost}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(material.status)}>
                            {material.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-4">No materials added yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="pt-4">
          <Card className="card-shadow">
            <CardHeader className="flex-row justify-between items-center">
              <CardTitle>Project Notes</CardTitle>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Note</span>
              </Button>
            </CardHeader>
            <CardContent>
              {extraData.notes && extraData.notes.length > 0 ? (
                <div className="space-y-6">
                  {extraData.notes.map((note: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{note.author}</h3>
                        <p className="text-sm text-muted-foreground">
                          {note.date}
                        </p>
                      </div>
                      <p className="text-muted-foreground">{note.content}</p>
                      {index < extraData.notes.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No notes added yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProjectTabs;
