import { YObjects } from "@/contexts/y-objects-context";
import { AbstractNode, NodeType } from "./abstract-node";
import { FileNode } from "./file-node";

export class DirNode extends AbstractNode {
  getOrCreateDirChild(id: string, name: string) {
    if (this.children.has(name)) {
      const node = this.children.get(name);

      if (node instanceof DirNode) {
        return node;
      }
    }

    const node = new DirNode(id, name, this.level + 1, this);
    this.addChild(node);

    return node;
  }

  getOrCreateFileChild(
    id: string,
    name: string,
    size: number,
    yObjects: YObjects
  ) {
    if (this.children.has(name)) {
      const node = this.children.get(name);

      if (node instanceof FileNode) {
        return node;
      }
    }

    const node = new FileNode(id, name, this.level, size, this, yObjects);
    this.addChild(node);

    return node;
  }

  nodeType() {
    return NodeType.DIR;
  }
}
