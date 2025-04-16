
import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import our components
import TasksTab from "./tabs/TasksTab";
import MaterialsTab from "./tabs/MaterialsTab";
import NotesTab from "./tabs/NotesTab";
import TaskDialog from "./dialogs/TaskDialog";
import MaterialDialog from "./dialogs/MaterialDialog";
import NoteDialog from "./dialogs/NoteDialog";

// Import our custom hooks
import { useProjectData } from "./hooks/useProjectData";
import { useTabDialogs } from "./hooks/useTabDialogs";
import { useTabForms } from "./hooks/useTabForms";

interface ProjectTabsProps {
  extraData: any;
  getStatusColor: (status: string) => string;
  projectId: string;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ extraData: initialExtraData, getStatusColor, projectId }) => {
  // Use our custom hooks for data management
  const { extraData, loadExtraData, saveExtraData } = useProjectData(projectId);
  
  // Use our custom hooks for dialog and form management
  const [dialogState, dialogActions] = useTabDialogs();
  const { 
    newTask, newMaterial, newNote,
    setNewTask, setNewMaterial, setNewNote,
    handleAddTask, handleAddMaterial, handleAddNote
  } = useTabForms();

  // Handlers that combine form submission and dialog closing
  const submitTask = () => {
    handleAddTask(extraData, saveExtraData);
    dialogActions.closeTaskDialog();
  };
  
  const submitMaterial = () => {
    handleAddMaterial(extraData, saveExtraData);
    dialogActions.closeMaterialDialog();
  };
  
  const submitNote = () => {
    handleAddNote(extraData, saveExtraData);
    dialogActions.closeNoteDialog();
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
            onAddTaskClick={dialogActions.openTaskDialog} 
            projectId={projectId}
            saveExtraData={saveExtraData}
            extraData={extraData}
          />
        </TabsContent>

        <TabsContent value="materials" className="pt-4">
          <MaterialsTab 
            materials={extraData.materials || []} 
            getStatusColor={getStatusColor} 
            onAddMaterialClick={dialogActions.openMaterialDialog} 
            projectId={projectId}
            saveExtraData={saveExtraData}
            extraData={extraData}
          />
        </TabsContent>

        <TabsContent value="notes" className="pt-4">
          <NotesTab 
            notes={extraData.notes || []} 
            onAddNoteClick={dialogActions.openNoteDialog} 
          />
        </TabsContent>
      </Tabs>

      {/* Task Dialog */}
      <TaskDialog 
        open={dialogState.taskDialogOpen}
        onOpenChange={dialogActions.setTaskDialogOpen}
        newTask={newTask}
        setNewTask={setNewTask}
        handleAddTask={submitTask}
      />

      {/* Material Dialog */}
      <MaterialDialog 
        open={dialogState.materialDialogOpen}
        onOpenChange={dialogActions.setMaterialDialogOpen}
        newMaterial={newMaterial}
        setNewMaterial={setNewMaterial}
        handleAddMaterial={submitMaterial}
      />

      {/* Note Dialog */}
      <NoteDialog 
        open={dialogState.noteDialogOpen}
        onOpenChange={dialogActions.setNoteDialogOpen}
        newNote={newNote}
        setNewNote={setNewNote}
        handleAddNote={submitNote}
      />
    </motion.div>
  );
};

export default ProjectTabs;
