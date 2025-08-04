import { FileTreeContext } from "@/components/context/file-tree.context";
import EditorTabs from "@/components/editor-tabs";
import Explorer from "@/components/explorer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { LIST_FILES } from "@/gql/queries";
import { useYObjects } from "@/hooks/use-y-objects";
import { DirNode } from "@/lib/file-system/dir-node";
import { buildTree } from "@/lib/file-system/file-tree";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { AbstractNode } from "../../lib/file-system/abstract-node";

export default function EditorView({ projectId }: { projectId: number }) {
  const { data } = useQuery(LIST_FILES, {
    variables: { projectId },
    fetchPolicy: "network-only",
    ssr: false,
  });
  const [fileTree, setFileTree] = useState<DirNode>();
  const [fileCache, setFileCache] = useState<Map<string, AbstractNode>>(
    new Map()
  );
  const yObjects = useYObjects();

  useEffect(() => {
    if (data) {
      const { cache, rootNode: fileTree } = buildTree(data.listFiles, yObjects);
      setFileTree(fileTree);
      setFileCache(cache);
    }
  }, [data, yObjects]);

  return (
    <FileTreeContext.Provider
      value={{ tree: fileTree || new DirNode("0", "", 0), cache: fileCache }}
    >
      <div className="h-full">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20}>
            <Explorer />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={80}>
            <EditorTabs />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </FileTreeContext.Provider>
  );
}
