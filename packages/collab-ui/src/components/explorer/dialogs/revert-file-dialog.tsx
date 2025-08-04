import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  revertFileDialogClosed,
  selectRevertFileState,
} from "@/features/file-action.slice";
import { fileOpened } from "@/features/opened-files.slice";
import { useContext } from "react";
import { useYObjects } from "../../../hooks/use-y-objects";
import { FileNode } from "../../../lib/file-system/file-node";
import { snapshotToDoc } from "../../../lib/utils";
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

export function RevertFileDialog() {
  const revertFileState = useAppSelector(selectRevertFileState);
  const { cache } = useContext(FileTreeContext);
  const { doc } = useYObjects();
  const dispatch = useAppDispatch();
  const version = revertFileState.version;

  const file = version ? (cache.get(version.fileId) as FileNode) : null;

  const onClose = () => {
    dispatch(revertFileDialogClosed());
  };

  const onRevert = () => {
    if (file && version) {
      const content = snapshotToDoc(version.snapshot, doc)
        .getText(file.getPath())
        .toString();

      file.getBinding().monacoModel.setValue(content);
      dispatch(fileOpened({ fileId: file.getId() }));
      onClose();
    }
  };

  if (!version || !file) return null;

  return (
    <Dialog open={revertFileState.openDialog} onOpenChange={onClose} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revert {file.getName()}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to revert {file.getPath()} to the version from{" "}
          {new Date(version.createdAt).toLocaleString()}? Note that you cannot
          undo this action.
        </DialogDescription>
        <DialogFooter>
          <Button variant={"destructive"} onClick={onRevert}>
            Revert
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
