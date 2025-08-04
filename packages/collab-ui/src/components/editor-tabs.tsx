import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectProject } from "@/features/global.slice";
import {
  fileActivated,
  fileClosed,
  selectActiveFileIdx,
  selectOpenedFiles,
  selectVersions,
} from "@/features/opened-files.slice";
import { UPDATE_FILE } from "@/gql/mutations";
import { FileNode } from "@/lib/file-system/file-node";
import { bytesToBase64, cn } from "@/lib/utils";
import { useMutation } from "@apollo/client";
import { X } from "lucide-react";
import { useCallback, useContext, useMemo } from "react";
import { encodeSnapshotV2, encodeStateAsUpdateV2, snapshot } from "yjs";
import { AbstractNode } from "../lib/file-system/abstract-node";
import { FileTreeContext } from "./context/file-tree.context";
import Editor from "./editor";
import { buttonVariants } from "./ui/button";

export default function EditorTabs() {
  const dispatch = useAppDispatch();
  const openedFiles = useAppSelector(selectOpenedFiles);
  const activeFileIdx = useAppSelector(selectActiveFileIdx);
  const { cache } = useContext(FileTreeContext);
  const [updateFile] = useMutation(UPDATE_FILE, {
    refetchQueries: ["GetProjectContributions"],
  });
  const project = useAppSelector(selectProject);
  const projectId = project?.id;
  const versions = useAppSelector(selectVersions);

  const activeFile = useMemo(
    () =>
      activeFileIdx !== null
        ? cache.get(openedFiles[activeFileIdx]) || null
        : null,
    [activeFileIdx, cache, openedFiles]
  );
  const activeVersion = useMemo(
    () =>
      activeFileIdx !== null
        ? versions[openedFiles[activeFileIdx]] || null
        : null,
    [activeFileIdx, versions, openedFiles]
  );

  const handleFileUpdate = useCallback(
    async (node: FileNode) => {
      if (node && projectId) {
        const ydoc = node.getBinding().doc;
        const updates = encodeStateAsUpdateV2(ydoc);
        await updateFile({
          variables: {
            fileId: node.getId(),
            newContent: node.getContent(),
            projectId: projectId,
            yDocUpdates: bytesToBase64(updates),
            snapshot: bytesToBase64(encodeSnapshotV2(snapshot(ydoc))),
          },
        });
      }
    },
    [projectId, updateFile]
  );

  return (
    <div className="w-full">
      <div className="inline-flex items-center text-muted-foreground w-full justify-start border-b h-9 overflow-x-auto">
        {openedFiles
          .map((id) => cache.get(id) || versions[id])
          .filter((node) => !!node)
          .map((node, idx) => {
            let id: string;
            let name: string;
            let path: string;
            let isFileNode = false;

            if (node instanceof AbstractNode) {
              id = node.getId();
              name = node.getName();
              path = node.getPath();
              isFileNode = true;
            } else {
              id = node.id;
              name = node.name;
              path = node.path;
            }

            return (
              <div key={id} className="relative flex items-center">
                <button
                  data-state={idx === activeFileIdx ? "active" : "inactive"}
                  className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 h-full border-x text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-200 data-[state=active]:text-foreground data-[state=active] pr-8 relative"
                  onClick={() => {
                    dispatch(fileActivated({ index: idx }));
                  }}
                >
                  {name}
                </button>
                <button
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "w-auto h-auto",
                    "absolute right-2"
                  )}
                  title={`Close ${path}`}
                  onClick={() => {
                    if (isFileNode) handleFileUpdate(node as FileNode);
                    dispatch(fileClosed({ index: idx }));
                  }}
                >
                  <X size={"1em"} />
                </button>
              </div>
            );
          })}
      </div>
      <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Editor file={activeFile as FileNode} version={activeVersion} />
      </div>
    </div>
  );
}
