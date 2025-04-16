
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Calendar, Box, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface ProjectTabsProps {
  extraData: any;
  getStatusColor: (status: string) => string;
  projectId: string;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ extraData, getStatusColor, projectId }) => {
  const { toast } = useToast();
  
  // Dialog states
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  
  // Form state
  const [newTask, setNewTask] = useState({ name: "", status: "Not Started", dueDate: "", assignee: "" });
  const [newMaterial, setNewMaterial] = useState({ name: "", quantity: "", cost: "", status: "Pending Delivery" });
  const [newNote, setNewNote] = useState({ content: "" });
  
  // Task handlers
  const handleAddTask = () => {
    // In a real app, this would call an API
    toast({
      title: "Task Added",
      description: `Task "${newTask.name}" has been added to the project.`,
    });
    setTaskDialogOpen(false);
    setNewTask({ name: "", status: "Not Started", dueDate: "", assignee: "" });
  };
  
  // Material handlers
  const handleAddMaterial = () => {
    // In a real app, this would call an API
    toast({
      title: "Material Added",
      description: `Material "${newMaterial.name}" has been added to the project.`,
    });
    setMaterialDialogOpen(false);
    setNewMaterial({ name: "", quantity: "", cost: "", status: "Pending Delivery" });
  };
  
  // Note handlers
  const handleAddNote = () => {
    // In a real app, this would call an API
    toast({
      title: "Note Added",
      description: "Your note has been added to the project.",
    });
    setNoteDialogOpen(false);
    setNewNote({ content: "" });
  };

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
              <Button size="sm" className="gap-1" onClick={() => setTaskDialogOpen(true)}>
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
              <Button size="sm" className="gap-1" onClick={() => setMaterialDialogOpen(true)}>
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
              <Button size="sm" className="gap-1" onClick={() => setNoteDialogOpen(true)}>
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

      {/* Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-name">Task Name</Label>
              <Input 
                id="task-name" 
                value={newTask.name} 
                onChange={e => setNewTask({...newTask, name: e.target.value})}
                placeholder="Enter task name" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-status">Status</Label>
              <Select 
                value={newTask.status} 
                onValueChange={value => setNewTask({...newTask, status: value})}
              >
                <SelectTrigger id="task-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-due-date">Due Date</Label>
              <Input 
                id="task-due-date" 
                type="date" 
                value={newTask.dueDate} 
                onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-assignee">Assignee</Label>
              <Input 
                id="task-assignee" 
                value={newTask.assignee} 
                onChange={e => setNewTask({...newTask, assignee: e.target.value})}
                placeholder="Assignee name" 
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddTask} disabled={!newTask.name}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Material Dialog */}
      <Dialog open={materialDialogOpen} onOpenChange={setMaterialDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Material</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="material-name">Material Name</Label>
              <Input 
                id="material-name" 
                value={newMaterial.name} 
                onChange={e => setNewMaterial({...newMaterial, name: e.target.value})}
                placeholder="Enter material name" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="material-quantity">Quantity</Label>
              <Input 
                id="material-quantity" 
                value={newMaterial.quantity} 
                onChange={e => setNewMaterial({...newMaterial, quantity: e.target.value})}
                placeholder="e.g., 5 units, 10 sq ft" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="material-cost">Cost</Label>
              <Input 
                id="material-cost" 
                value={newMaterial.cost} 
                onChange={e => setNewMaterial({...newMaterial, cost: e.target.value})}
                placeholder="e.g., $500" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="material-status">Status</Label>
              <Select 
                value={newMaterial.status} 
                onValueChange={value => setNewMaterial({...newMaterial, status: value})}
              >
                <SelectTrigger id="material-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending Delivery">Pending Delivery</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddMaterial} disabled={!newMaterial.name}>Add Material</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Project Note</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="note-content">Note</Label>
              <Textarea 
                id="note-content" 
                value={newNote.content} 
                onChange={e => setNewNote({...newNote, content: e.target.value})}
                placeholder="Enter your project note" 
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddNote} disabled={!newNote.content}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProjectTabs;
