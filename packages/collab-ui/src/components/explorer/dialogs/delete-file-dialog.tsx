import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fileDeletionFinshedOrCancelled,
  selectDeleteFile,
} from "@/features/file-action.slice";
import { selectProject } from "@/features/global.slice";
import { fileClosed, selectOpenedFiles } from "@/features/opened-files.slice";
import { DELETE_FILE } from "@/gql/mutations";
import { useUpdateProjectDoc } from "@/hooks/use-update-project-doc";
import { useMutation } from "@apollo/client";
import { useContext } from "react";
import { FileTreeContext } from "../../context/file-tree.context";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

export function DeleteFileDialog() {
  const deleteFileState = useAppSelector(selectDeleteFile);
  const { cache } = useContext(FileTreeContext);
  const project = useAppSelector(selectProject);
  const projectId = project?.id;
  const dispatch = useAppDispatch();
  const openedFiles = useAppSelector(selectOpenedFiles);
  const updateProjectDoc = useUpdateProjectDoc();

  const file = deleteFileState.fileId
    ? cache.get(deleteFileState.fileId)
    : undefined;

  const [deleteFile] = useMutation(DELETE_FILE, {
    awaitRefetchQueries: true,
    refetchQueries: ["ListFiles"],
    onError: (error) => {
      console.error(error);
    },
  });

  const onClose = () => {
    dispatch(fileDeletionFinshedOrCancelled());
  };

  const handleSubmit = async () => {
    onClose();

    if (!file || !projectId) return;

    await deleteFile({ variables: { fileId: file.getId() } });
    await updateProjectDoc();
    const fileIndex = openedFiles.findIndex((id) => id === file.getId());
    dispatch(fileClosed({ index: fileIndex }));
  };

  if (!file) return null;

  return (
    <Dialog open={deleteFileState.openDialog} onOpenChange={onClose} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {file.getName()}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete {file.getPath()}?
        </DialogDescription>
        <DialogFooter>
          <Button onClick={handleSubmit}>Delete</Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
