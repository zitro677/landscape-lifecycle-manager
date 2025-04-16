
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface TasksTabProps {
  tasks: any[];
  getStatusColor: (status: string) => string;
  onAddTaskClick: () => void;
}

const TasksTab: React.FC<TasksTabProps> = ({ tasks, getStatusColor, onAddTaskClick }) => {
  return (
    <Card className="card-shadow">
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle>Project Tasks</CardTitle>
        <Button size="sm" className="gap-1" onClick={onAddTaskClick}>
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </Button>
      </CardHeader>
      <CardContent>
        {tasks && tasks.length > 0 ? (
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
              {tasks.map((task: any, index: number) => (
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
  );
};

export default TasksTab;
