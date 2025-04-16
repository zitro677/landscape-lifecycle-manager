
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useProjectData } from "./useProjectData";

export const useTabManager = (projectId: string, initialExtraData: any = {}) => {
  const { toast } = useToast();
  
  // Use project data hook
  const { extraData, saveExtraData } = useProjectData(projectId);
  
  // Dialog state management
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  
  // Form state
  const [newTask, setNewTask] = useState({ name: "", status: "Not Started", dueDate: "", assignee: "" });
  const [newMaterial, setNewMaterial] = useState({ name: "", quantity: "", cost: "", status: "Pending Delivery" });
  const [newNote, setNewNote] = useState({ content: "" });
  
  // Dialog actions
  const openTaskDialog = () => setTaskDialogOpen(true);
  const openMaterialDialog = () => setMaterialDialogOpen(true);
  const openNoteDialog = () => setNoteDialogOpen(true);
  const closeTaskDialog = () => setTaskDialogOpen(false);
  const closeMaterialDialog = () => setMaterialDialogOpen(false);
  const closeNoteDialog = () => setNoteDialogOpen(false);
  
  // Form actions
  const handleAddTask = (extraData: any, saveExtraData: (data: any) => void, closeDialog?: () => void) => {
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
    
    // Reset form
    setNewTask({ name: "", status: "Not Started", dueDate: "", assignee: "" });
    
    // Close dialog if callback provided
    if (closeDialog) closeDialog();
  };
  
  const handleAddMaterial = (extraData: any, saveExtraData: (data: any) => void, closeDialog?: () => void) => {
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
    
    // Reset form
    setNewMaterial({ name: "", quantity: "", cost: "", status: "Pending Delivery" });
    
    // Close dialog if callback provided
    if (closeDialog) closeDialog();
  };
  
  const handleAddNote = (extraData: any, saveExtraData: (data: any) => void, closeDialog?: () => void) => {
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
    
    // Reset form
    setNewNote({ content: "" });
    
    // Close dialog if callback provided
    if (closeDialog) closeDialog();
  };

  return {
    // Data
    extraData,
    saveExtraData,
    
    // Dialog state
    dialogState: {
      taskDialogOpen,
      materialDialogOpen,
      noteDialogOpen
    },
    
    // Dialog actions
    dialogActions: {
      openTaskDialog,
      openMaterialDialog,
      openNoteDialog,
      closeTaskDialog,
      closeMaterialDialog,
      closeNoteDialog,
      setTaskDialogOpen,
      setMaterialDialogOpen,
      setNoteDialogOpen
    },
    
    // Form state
    formState: {
      newTask,
      newMaterial,
      newNote
    },
    
    // Form actions
    formActions: {
      setNewTask,
      setNewMaterial,
      setNewNote,
      handleAddTask,
      handleAddMaterial,
      handleAddNote
    }
  };
};
