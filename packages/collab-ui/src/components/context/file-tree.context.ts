import { DirNode } from "@/lib/file-system/dir-node";
import { createContext } from "react";
import { AbstractNode } from "../../lib/file-system/abstract-node";

export const FileTreeContext = createContext<{
  tree: DirNode;
  cache: Map<string, AbstractNode>;
}>({ tree: new DirNode("0", "", 0), cache: new Map<string, AbstractNode>() });
