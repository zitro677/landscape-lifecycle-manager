
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface TabFormsResult {
  newTask: { name: string; status: string; dueDate: string; assignee: string };
  newMaterial: { name: string; quantity: string; cost: string; status: string };
  newNote: { content: string };
  setNewTask: React.Dispatch<React.SetStateAction<{
    name: string;
    status: string;
    dueDate: string;
    assignee: string;
  }>>;
  setNewMaterial: React.Dispatch<React.SetStateAction<{
    name: string;
    quantity: string;
    cost: string;
    status: string;
  }>>;
  setNewNote: React.Dispatch<React.SetStateAction<{
    content: string;
  }>>;
  handleAddTask: (extraData: any, saveExtraData: (data: any) => void) => void;
  handleAddMaterial: (extraData: any, saveExtraData: (data: any) => void) => void;
  handleAddNote: (extraData: any, saveExtraData: (data: any) => void) => void;
}

export const useTabForms = (): TabFormsResult => {
  const { toast } = useToast();
  
  // Form state
  const [newTask, setNewTask] = useState({ name: "", status: "Not Started", dueDate: "", assignee: "" });
  const [newMaterial, setNewMaterial] = useState({ name: "", quantity: "", cost: "", status: "Pending Delivery" });
  const [newNote, setNewNote] = useState({ content: "" });
  
  // Task handlers
  const handleAddTask = (extraData: any, saveExtraData: (data: any) => void) => {
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
  };
  
  // Material handlers
  const handleAddMaterial = (extraData: any, saveExtraData: (data: any) => void) => {
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
  };
  
  // Note handlers
  const handleAddNote = (extraData: any, saveExtraData: (data: any) => void) => {
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
  };

  return {
    newTask, 
    newMaterial, 
    newNote,
    setNewTask,
    setNewMaterial,
    setNewNote,
    handleAddTask,
    handleAddMaterial,
    handleAddNote
  };
};
