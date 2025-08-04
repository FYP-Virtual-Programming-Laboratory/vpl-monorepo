import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { FileTreeContext } from "@/components/context/file-tree.context";
import { newFileDialogOpened } from "@/features/file-action.slice";
import { selectProject } from "@/features/global.slice";
import { Plus } from "lucide-react";
import { useCallback, useContext } from "react";
import { ExplorerItem } from "../explorer-item";
import { DirTreeNode } from "./dir-tree-node";

export function DirTree() {
  const { tree } = useContext(FileTreeContext);
  const project = useAppSelector(selectProject);
  const dispatch = useAppDispatch();

  const openNewFileDialog = useCallback(
    () => dispatch(newFileDialogOpened()),
    [dispatch]
  );

  return (
    <ExplorerItem
      title={project?.name || ""}
      actions={
        <div className="flex items-center">
          <button onClick={openNewFileDialog}>
            <Plus size={14} />
          </button>
        </div>
      }
    >
      <DirTreeNode node={tree} />
    </ExplorerItem>
  );
}
