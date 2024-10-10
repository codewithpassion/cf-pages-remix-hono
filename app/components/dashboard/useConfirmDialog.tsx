import React, { useState, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmDialogOptions = {
  title: string;
  description: string;
};

export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    options: ConfirmDialogOptions | null;
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    options: null,
    resolve: null,
  });

  const openDialog = useCallback(
    (options: ConfirmDialogOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setDialogState({
          isOpen: true,
          options,
          resolve,
        });
      });
    },
    []
  );

  const handleClose = useCallback(() => {
    setDialogState((prev) => ({
      ...prev,
      isOpen: false,
    }));
    dialogState.resolve?.(false);
  }, [dialogState]);

  const handleConfirm = useCallback(() => {
    setDialogState((prev) => ({
      ...prev,
      isOpen: false,
    }));
    dialogState.resolve?.(true);
  }, [dialogState]);

  const ConfirmDialog = useCallback(() => {
    if (!dialogState.isOpen || !dialogState.options) return null;

    return (
      <AlertDialog
        open={dialogState.isOpen}
        onOpenChange={(isOpen: boolean) => !isOpen && handleClose()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogState.options.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogState.options.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }, [dialogState, handleClose, handleConfirm]);

  return { confirmDialog: openDialog, ConfirmDialog };
}
