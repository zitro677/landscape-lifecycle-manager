
import { useState } from "react";

interface DialogState {
  taskDialogOpen: boolean;
  materialDialogOpen: boolean;
  noteDialogOpen: boolean;
}

interface DialogActions {
  openTaskDialog: () => void;
  openMaterialDialog: () => void;
  openNoteDialog: () => void;
  closeTaskDialog: () => void;
  closeMaterialDialog: () => void;
  closeNoteDialog: () => void;
  setTaskDialogOpen: (open: boolean) => void;
  setMaterialDialogOpen: (open: boolean) => void;
  setNoteDialogOpen: (open: boolean) => void;
}

export const useTabDialogs = (): [DialogState, DialogActions] => {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);

  const openTaskDialog = () => setTaskDialogOpen(true);
  const openMaterialDialog = () => setMaterialDialogOpen(true);
  const openNoteDialog = () => setNoteDialogOpen(true);
  const closeTaskDialog = () => setTaskDialogOpen(false);
  const closeMaterialDialog = () => setMaterialDialogOpen(false);
  const closeNoteDialog = () => setNoteDialogOpen(false);

  return [
    { taskDialogOpen, materialDialogOpen, noteDialogOpen },
    {
      openTaskDialog,
      openMaterialDialog,
      openNoteDialog,
      closeTaskDialog,
      closeMaterialDialog,
      closeNoteDialog,
      setTaskDialogOpen,
      setMaterialDialogOpen,
      setNoteDialogOpen
    }
  ];
};
