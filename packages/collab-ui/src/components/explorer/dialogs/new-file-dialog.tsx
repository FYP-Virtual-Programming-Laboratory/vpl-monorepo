import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  newFileDialogClosed,
  newFilePathChanged,
  newFilePathReset,
  selectNewFile,
} from "@/features/file-action.slice";
import { selectProject } from "@/features/global.slice";
import { fileOpened } from "@/features/opened-files.slice";
import { NEW_FILE } from "@/gql/mutations";
import { useUpdateProjectDoc } from "@/hooks/use-update-project-doc";
import { useMutation } from "@apollo/client";
import { useCallback } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";

export function NewFileDialog() {
  const project = useAppSelector(selectProject);
  const projectId = project?.id;
  const newFileState = useAppSelector(selectNewFile);
  const dispatch = useAppDispatch();
  const updateProjectDoc = useUpdateProjectDoc();

  const onPathChange = useCallback(
    (path: string) => dispatch(newFilePathChanged(path)),
    [dispatch]
  );
  const closeDialog = useCallback(
    () => dispatch(newFileDialogClosed()),
    [dispatch]
  );
  const resetFilePath = useCallback(
    () => dispatch(newFilePathReset()),
    [dispatch]
  );
  const openFile = useCallback(
    (id: string) => dispatch(fileOpened({ fileId: id })),
    [dispatch]
  );

  const [newFile] = useMutation(NEW_FILE, {
    awaitRefetchQueries: true,
    refetchQueries: ["ListFiles"],
    onCompleted: (data) => {
      resetFilePath();
      openFile(data.newFile.id);
      updateProjectDoc();
    },
    onError: (error) => {
      resetFilePath();
      console.error(error);
    },
  });

  const handleSubmit = useCallback(() => {
    closeDialog();

    if (newFileState.path.trim() === "") {
      console.error("File name cannot be empty.");
      return;
    }

    if (!projectId) return;

    newFile({ variables: { filePath: newFileState.path, projectId } });
  }, [closeDialog, newFile, newFileState.path, projectId]);

  return (
    <Dialog open={newFileState.openDialog} onOpenChange={closeDialog} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New File</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Enter the file path of the new file.
        </DialogDescription>
        <div className="py-4">
          <Input
            placeholder="File Name"
            value={newFileState.path}
            onChange={(ev) => onPathChange(ev.target.value)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                handleSubmit();
              }
            }}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
