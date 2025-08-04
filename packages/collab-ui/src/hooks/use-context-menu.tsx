import { useAppDispatch } from "@/app/hooks";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  fileDeletionIntiated,
  newFileDialogOpened,
} from "@/features/file-action.slice";
import { AbstractNode } from "@/lib/file-system/abstract-node";
import { DirNode } from "@/lib/file-system/dir-node";
import { FileNode } from "@/lib/file-system/file-node";
import { JSX, useCallback, useMemo } from "react";

export default function useContextMenu(node: AbstractNode) {
  const dispatch = useAppDispatch();
  const openNewFileDialog = useCallback(
    () => dispatch(newFileDialogOpened(node.getPath().slice(1) + "/")),
    [dispatch, node]
  );
  const contextMenu = useMemo(() => {
    const isFile = node instanceof FileNode;
    const isDir = node instanceof DirNode;
    const path = node.getPath();
    const id = node.getId();

    return [
      isFile ? (
        <ContextMenuItem
          key={`open-${id}`}
          onClick={() => console.log(`Open ${path}`)}
          inset
        >
          Open
        </ContextMenuItem>
      ) : undefined,
      isDir ? (
        <ContextMenuItem
          key={`new-file-${id}`}
          onClick={openNewFileDialog}
          inset
        >
          New File
        </ContextMenuItem>
      ) : undefined,
      isDir ? (
        <ContextMenuItem
          key={`new-folder-${id}`}
          onClick={() => console.log("New Folder")}
          inset
        >
          New Folder
        </ContextMenuItem>
      ) : undefined,
      <ContextMenuSeparator key={`separator-after-new-folder-${id}`} />,
      <ContextMenuItem
        key={`rename-${id}`}
        onClick={() => console.log("Rename")}
        inset
      >
        Rename
      </ContextMenuItem>,
      <ContextMenuItem
        key={`delete-${id}`}
        onClick={() => dispatch(fileDeletionIntiated(id))}
        inset
      >
        Delete
      </ContextMenuItem>,
    ].filter(Boolean) as JSX.Element[];
  }, [dispatch, node, openNewFileDialog]);

  return contextMenu;
}
