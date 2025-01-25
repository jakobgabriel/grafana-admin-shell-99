import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminPanelAuth from "./AdminPanelAuth";

interface DeleteInstanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticated: () => void;
}

const DeleteInstanceDialog = ({
  open,
  onOpenChange,
  onAuthenticated,
}: DeleteInstanceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Instance</DialogTitle>
          <DialogDescription>
            Please authenticate as an admin to delete this instance
          </DialogDescription>
        </DialogHeader>
        <AdminPanelAuth onAuthenticated={onAuthenticated} />
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInstanceDialog;