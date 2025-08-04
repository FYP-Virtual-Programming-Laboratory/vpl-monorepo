import { useAppDispatch } from "@/app/hooks";
import { fileOpened } from "@/features/opened-files.slice";
import { AbstractNode } from "@/lib/file-system/abstract-node";
import { FileNode } from "@/lib/file-system/file-node";
import { sortNodes } from "@/lib/file-system/file-tree";
import { useEffect, useState } from "react";
import { DirTreeItem } from "./dir-tree-item";

export function DirTreeNode({
  node,
  depth = 0,
}: Readonly<{ node: AbstractNode; depth?: number }>) {
  const [isExpanded, setIsExpanded] = useState(
    !!node.meta.lastIsExpanded || false
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      node.meta.lastIsExpanded = isExpanded;
    };
  }, [isExpanded, node.meta]);

  if (node instanceof FileNode) {
    return (
      <li key={node.getName()}>
        <DirTreeItem
          node={node}
          depth={depth}
          onClick={() => dispatch(fileOpened({ fileId: node.getId() }))}
        />
      </li>
    );
  }

  if (node.getParent() === null) {
    return (
      <ul>
        {sortNodes(node.getChildren()).map((child) => (
          <DirTreeNode key={child.getName()} node={child} depth={depth + 1} />
        ))}
      </ul>
    );
  }

  return (
    <li key={node.getName()}>
      <DirTreeItem
        node={node}
        depth={depth}
        isExpanded={isExpanded}
        onClick={() => setIsExpanded((prev) => !prev)}
      />
      {isExpanded && (
        <ul>
          {sortNodes(node.getChildren()).map((child) => (
            <DirTreeNode key={child.getName()} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
