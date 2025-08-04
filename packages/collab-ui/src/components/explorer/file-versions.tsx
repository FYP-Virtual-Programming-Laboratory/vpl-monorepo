import { useQuery } from "@apollo/client";
import { useContext } from "react";
import { Version } from "../../__generated__/graphql";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { revertFileDialogOpened } from "../../features/file-action.slice";
import {
  selectActiveFileId,
  selectVersions,
  versionOpened,
} from "../../features/opened-files.slice";
import { GET_FILE_HISTORY } from "../../gql/queries";
import { useYObjects } from "../../hooks/use-y-objects";
import { FileNode } from "../../lib/file-system/file-node";
import { snapshotToDoc } from "../../lib/utils";
import { FileTreeContext } from "../context/file-tree.context";
import { Button } from "../ui/button";
import { ExplorerItem } from "./explorer-item";

export function FileVersions() {
  const activeFileId = useAppSelector(selectActiveFileId);
  const versions = useAppSelector(selectVersions);
  const versionFileId = versions[activeFileId || "0"]?.fileId || null;
  const { cache } = useContext(FileTreeContext);
  const activeFile =
    (cache.get(activeFileId || "0") as FileNode) ||
    (cache.get(versionFileId || "0") as FileNode) ||
    null;
  const { data, loading } = useQuery(GET_FILE_HISTORY, {
    variables: {
      fileId: activeFile?.getId() || versionFileId || "0",
    },
    fetchPolicy: "network-only",
  });
  const { doc } = useYObjects();
  const dispatch = useAppDispatch();

  const fileHistory =
    data?.getFileVersions.filter((version) => !!version.snapshot) || [];

  const onVersionSelect = (version: Version) => {
    if (activeFile) {
      const content = snapshotToDoc(version.snapshot, doc)
        .getText(activeFile.getPath())
        .toString();

      dispatch(
        versionOpened({
          id: version.id.toString(),
          fileId: activeFile.getId(),
          content,
          committedBy: version.committedBy,
          createdAt: version.createdAt,
          name: `${activeFile.getName()} (${new Date(
            version.createdAt
          ).toLocaleString()})`,
          path: activeFile.getPath(),
        })
      );
    }
  };

  return (
    <ExplorerItem title="File Versions">
      <div className="py-2">
        {loading && <p className="text-center px-2">Loading...</p>}
        {fileHistory.length === 0 && (
          <p className="text-center px-2">No file versions available.</p>
        )}
        <div className="flex flex-col gap-2">
          {fileHistory.map((version) => (
            <div
              key={version.id}
              className="relative group flex flex-col cursor-pointer hover:bg-gray-300 px-2"
              onClick={() => onVersionSelect(version)}
            >
              <span className="font-bold">
                {new Date(version.createdAt).toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-neutral-600">
                Committed by {version.committedBy}
              </span>
              <div className="div absolute right-2 h-full items-center hidden group-hover:flex">
                <Button
                  size={"sm"}
                  className="h-6"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    dispatch(revertFileDialogOpened(version));
                  }}
                >
                  Revert
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ExplorerItem>
  );
}
