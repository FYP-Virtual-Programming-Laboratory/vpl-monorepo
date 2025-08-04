import { YObjects } from "@/contexts/y-objects-context";
import { Uri, editor } from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { ignore } from "../utils";
import { AbstractNode, NodeType } from "./abstract-node";
import { DirNode } from "./dir-node";

/**
 * Represents a file node in the explorer.
 * Extends the base Node class and includes file-specific functionality.
 */

export class FileNode extends AbstractNode {
  private readonly binding: MonacoBinding;

  /**
   * Creates an instance of FileNode.
   
   * @param name - The name of the file node.
   * @param parent - The optional parent node.
   */
  constructor(
    id: string,
    name: string,
    level: number,
    private size: number,
    parent: AbstractNode,
    yObjects: YObjects
  ) {
    super(id, name, level, parent);

    const { awareness, doc, userData } = yObjects;
    const uri = Uri.parse("file://" + this.getPath());

    const model =
      editor.getModel(uri) ?? editor.createModel("", undefined, uri);

    const yText = doc.getText(this.getPath());

    yText.observe((event) => {
      if (event.transaction.local) {
        const contribMap = doc.getMap<number>("contributions");
        contribMap.set(
          userData.getUserByClientId(doc.clientID),
          (contribMap.get(userData.getUserByClientId(doc.clientID)) || 0) + 1
        );
      }
    });

    this.binding = new MonacoBinding(yText, model, undefined, awareness);
  }

  /**
   * Retrieves the size of the file node.
   * @returns The size of the file node.
   */
  getSize() {
    return this.size;
  }

  /**
   * Retrieves the current binding.
   *
   * @returns The current binding.
   */
  getBinding() {
    return this.binding;
  }

  /**
   * Retrieves the content of the file node.
   * @returns The content of the file node.
   */
  getContent() {
    return this.binding.ytext.toString();
  }

  /**
   * Throws an error as file nodes cannot have children.
   * @param node - The node to add.
   * @throws Error when attempting to add a child to a file node.
   */
  addChild(node: AbstractNode) {
    ignore(node);
    throw new Error("Cannot add child to a file node");
  }

  /**
   * Throws an error as file nodes cannot have children.
   * @param node - The node to remove.
   * @throws Error when attempting to remove a child from a file node.
   */
  removeChild(node: AbstractNode): void {
    ignore(node);
    throw new Error("Cannot remove child from a file node");
  }

  nodeType() {
    return NodeType.FILE;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getOrCreateDirChild(_id: string, _name: string): DirNode {
    throw new Error("File nodes cannot have children");
  }
  getOrCreateFileChild(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _name: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _size: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _yObjects: YObjects
  ): FileNode {
    throw new Error("File nodes cannot have children");
  }
}
