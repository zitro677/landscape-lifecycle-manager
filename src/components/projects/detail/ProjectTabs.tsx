
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

// Import our new components
import TasksTab from "./tabs/TasksTab";
import MaterialsTab from "./tabs/MaterialsTab";
import NotesTab from "./tabs/NotesTab";
import TaskDialog from "./dialogs/TaskDialog";
import MaterialDialog from "./dialogs/MaterialDialog";
import NoteDialog from "./dialogs/NoteDialog";

// Import our custom hook
import { useProjectData } from "./hooks/useProjectData";

interface ProjectTabsProps {
  extraData: any;
  getStatusColor: (status: string) => string;
  projectId: string;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ extraData: initialExtraData, getStatusColor, projectId }) => {
  const { toast } = useToast();
  
  // Use our custom hook for data management
  const { extraData, loadExtraData, saveExtraData } = useProjectData(projectId);
  
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
    // Create the new task object
    const task = {
      name: newTask.name,
      status: newTask.status,
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      assignee: newTask.assignee
    };
    
    // Create updated tasks array
    const updatedTasks = extraData.tasks ? [...extraData.tasks, task] : [task];
    
    // Create updated extraData
    const updatedExtraData = {
      ...extraData,
      tasks: updatedTasks
    };
    
    // Save to localStorage
    saveExtraData(updatedExtraData);
    
    // Show success toast
    toast({
      title: "Task Added",
      description: `Task "${newTask.name}" has been added to the project.`,
    });
    
    // Close dialog and reset form
    setTaskDialogOpen(false);
    setNewTask({ name: "", status: "Not Started", dueDate: "", assignee: "" });
  };
  
  // Material handlers
  const handleAddMaterial = () => {
    // Create the new material object
    const material = {
      name: newMaterial.name,
      quantity: newMaterial.quantity,
      cost: newMaterial.cost,
      status: newMaterial.status
    };
    
    // Create updated materials array
    const updatedMaterials = extraData.materials ? [...extraData.materials, material] : [material];
    
    // Create updated extraData
    const updatedExtraData = {
      ...extraData,
      materials: updatedMaterials
    };
    
    // Save to localStorage
    saveExtraData(updatedExtraData);
    
    // Show success toast
    toast({
      title: "Material Added",
      description: `Material "${newMaterial.name}" has been added to the project.`,
    });
    
    // Close dialog and reset form
    setMaterialDialogOpen(false);
    setNewMaterial({ name: "", quantity: "", cost: "", status: "Pending Delivery" });
  };
  
  // Note handlers
  const handleAddNote = () => {
    // Create the new note object
    const note = {
      content: newNote.content,
      date: new Date().toISOString().split('T')[0],
      author: "Current User", // In a real app, get the user's name from auth
    };
    
    // Create updated notes array
    const updatedNotes = extraData.notes ? [...extraData.notes, note] : [note];
    
    // Create updated extraData
    const updatedExtraData = {
      ...extraData,
      notes: updatedNotes
    };
    
    // Save to localStorage
    saveExtraData(updatedExtraData);
    
    // Show success toast
    toast({
      title: "Note Added",
      description: "Your note has been added to the project.",
    });
    
    // Close dialog and reset form
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
          <TasksTab 
            tasks={extraData.tasks || []} 
            getStatusColor={getStatusColor} 
            onAddTaskClick={() => setTaskDialogOpen(true)} 
          />
        </TabsContent>

        <TabsContent value="materials" className="pt-4">
          <MaterialsTab 
            materials={extraData.materials || []} 
            getStatusColor={getStatusColor} 
            onAddMaterialClick={() => setMaterialDialogOpen(true)} 
          />
        </TabsContent>

        <TabsContent value="notes" className="pt-4">
          <NotesTab 
            notes={extraData.notes || []} 
            onAddNoteClick={() => setNoteDialogOpen(true)} 
          />
        </TabsContent>
      </Tabs>

      {/* Task Dialog */}
      <TaskDialog 
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        newTask={newTask}
        setNewTask={setNewTask}
        handleAddTask={handleAddTask}
      />

      {/* Material Dialog */}
      <MaterialDialog 
        open={materialDialogOpen}
        onOpenChange={setMaterialDialogOpen}
        newMaterial={newMaterial}
        setNewMaterial={setNewMaterial}
        handleAddMaterial={handleAddMaterial}
      />

      {/* Note Dialog */}
      <NoteDialog 
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        newNote={newNote}
        setNewNote={setNewNote}
        handleAddNote={handleAddNote}
      />
    </motion.div>
  );
};

export default ProjectTabs;
