import { YObjects } from "@/contexts/y-objects-context";
import { FileSystemEntry } from "../../__generated__/graphql";
import { AbstractNode, NodeType } from "./abstract-node";
import { DirNode } from "./dir-node";
import { FileNode } from "./file-node";

export function buildTree(files: FileSystemEntry[], yObjects: YObjects) {
  const _files = [...files].sort((a, b) => {
    if (a.__typename === "File" && b.__typename === "Directory") {
      // Directories first
      return 1;
    } else if (a.__typename === "Directory" && b.__typename === "File") {
      return -1;
    }

    return a.path.length - b.path.length;
  }); // Sort by path length, ensures parent directories are created first.

  const cache = new Map<string, AbstractNode>();
  const rootNode = new DirNode("0", "", 0);
  cache.set(rootNode.getId(), rootNode);

  _files.forEach((file) => {
    const parts = file.path.split("/");
    const name = parts.pop()!;
    const parentNode = cache.get(file.parentId || "-1") || rootNode;
    const node =
      file.__typename === "File"
        ? parentNode.getOrCreateFileChild(
            file.id,
            name,
            file.size || 0,
            yObjects
          )
        : parentNode.getOrCreateDirChild(file.id, name);

    cache.set(file.id, node);
  });

  return { cache, rootNode };
}

/* TODO: Improve by using better suited data structure in `Node` class. */
export function sortNodes(nodes: AbstractNode[]) {
  return nodes.sort((a, b) => {
    if (a instanceof FileNode && b instanceof DirNode) {
      return 1;
    } else if (a instanceof DirNode && b instanceof FileNode) {
      return -1;
    } else {
      return a.getName().localeCompare(b.getName());
    }
  });
}

function dfsTraversal(node: AbstractNode, cb: (node: AbstractNode) => void) {
  cb(node);
  node.getChildren().forEach((child) => dfsTraversal(child, cb));
}

export function getAllFiles(node: DirNode) {
  const files = [];

  dfsTraversal(node, (child) => {
    if (child.nodeType() === NodeType.FILE) files.push(child);
  });
}
