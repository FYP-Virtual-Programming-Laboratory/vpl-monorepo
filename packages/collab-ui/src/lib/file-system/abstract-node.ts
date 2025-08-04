import { YObjects } from "@/contexts/y-objects-context";
import { DirNode } from "./dir-node";
import { FileNode } from "./file-node";

/**
 * Abstract class representing a node in a tree structure.
 * Each node can have children and a parent, and provides methods to manage these relationships.
 */

export abstract class AbstractNode {
  /**
   * Map to store child nodes, keyed by their name.
   */
  protected children: Map<string, AbstractNode> = new Map();
  /**
   * A record that holds metadata information.
   * The keys are strings and the values can be of any type.
   */
  public meta: Record<string, unknown> = {};

  /**
   * Creates an instance of Node.
   * @param id - A unique identifier for the node. The same as the file id.
   * @param name - The name of the node.
   * @param parent - The parent node, if any.
   */
  constructor(
    private readonly id: string,
    protected readonly name: string,
    protected readonly level: number,
    protected readonly parent: AbstractNode | null = null
  ) {}

  /**
   * Gets the unique identifier of the node. The same as the file id.
   * @returns The unique identifier of the node.
   */
  getId() {
    return this.id;
  }

  /**
   * Gets the name of the node.
   * @returns The name of the node.
   */
  getName() {
    return this.name;
  }

  /**
   * Gets the path of the node.
   * @returns The path of the node.
   * @example "root/dir1/dir2/file.ext"
   */
  getPath(): string {
    if (this.parent === null) {
      return "";
    }

    return this.parent.getPath() + "/" + this.name;
  }

  /**
   * Gets the parent of the node.
   * @returns The parent node, or null if there is no parent.
   */
  getParent() {
    return this.parent || null;
  }

  getLevel() {
    return this.level;
  }

  /**
   * Adds a child node to this node. Expected to be used together with {@link setParent}.
   *
   * @param node - The child node to add.
   * @throws Will throw an error if a child with the same name already exists.
   *
   * @example
   * ```typescript
   * const parent = new Node("parent");
   * const child = new Node("child");
   * parent.addChild(child);
   * child.setParent(parent);
   */
  addChild(node: AbstractNode) {
    if (this.children.has(node.name)) {
      throw new Error(`Child with name ${node.name} already exists`);
    }

    this.children.set(node.name, node);
  }

  /**
   * Removes a child node.
   * @param node - The child node to remove.
   */
  removeChild(node: AbstractNode) {
    this.children.delete(node.name);
  }

  /**
   * Gets a child node by name.
   * @param name - The name of the child node to get.
   * @returns The child node, or undefined if no child with the given name exists.
   */
  getChild(name: string) {
    return this.children.get(name);
  }

  /**
   * Gets all child nodes.
   * @returns An array of all child nodes.
   */
  getChildren() {
    return Array.from(this.children.values());
  }

  /**
   * Adds multiple child nodes.
   * @param nodes - An array of child nodes to add.
   * @throws Will throw an error if a child with the same name already exists.
   */
  addChildren(nodes: AbstractNode[]) {
    nodes.forEach((node) => {
      if (this.children.has(node.name)) {
        throw new Error(`Child with name ${node.name} already exists`);
      }

      this.children.set(node.name, node);
    });
  }

  abstract nodeType(): NodeType;

  abstract getOrCreateDirChild(id: string, name: string): DirNode;

  abstract getOrCreateFileChild(
    id: string,
    name: string,
    size: number,
    yObjects: YObjects
  ): FileNode;
}
export type NodeType = "file" | "dir";
export const NodeType = {
  FILE: "file",
  DIR: "dir",
} as const;
