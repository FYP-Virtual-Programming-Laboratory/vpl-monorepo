import { useAppSelector } from "@/app/hooks";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { selectActiveFileId } from "@/features/opened-files.slice";
import useContextMenu from "@/hooks/use-context-menu";
import { AbstractNode, NodeType } from "@/lib/file-system/abstract-node";
import {
  ChevronDown,
  ChevronRight,
  File,
  FolderClosed,
  FolderOpen,
} from "lucide-react";

export function DirTreeItem({
  node,
  depth,
  isExpanded = false,
  onClick,
}: Readonly<{
  node: AbstractNode;
  depth: number;
  isExpanded?: boolean;
  onClick?: () => void;
}>) {
  const contextMenu = useContextMenu(node);
  const activeFileId = useAppSelector(selectActiveFileId);
  const padding =
    0.5 + (depth - 1) * 0.5 + (node.nodeType() === NodeType.FILE ? 1.2 : 0);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <button
          className="inline-flex gap-1 items-center hover:bg-gray-300 data-[active=true]:bg-gray-300 w-full py-0.5 text-sm"
          style={{ paddingLeft: `${padding}em` }}
          onClick={onClick}
          data-active={
            activeFileId === node.getId() && node.nodeType() === NodeType.FILE
          }
        >
          {node.nodeType() === NodeType.DIR && (
            <>
              {isExpanded ? (
                <ChevronDown size={"1em"} />
              ) : (
                <ChevronRight size={"1em"} />
              )}
            </>
          )}
          {node.nodeType() === NodeType.DIR ? (
            <>
              {isExpanded ? (
                <FolderOpen size={"1em"} />
              ) : (
                <FolderClosed size={"1em"} />
              )}
            </>
          ) : (
            <File size={"1em"} />
          )}
          {node.getName()}
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent>{contextMenu}</ContextMenuContent>
    </ContextMenu>
  );
}
