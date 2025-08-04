import { useAppSelector } from "@/app/hooks";
import { selectProject } from "@/features/global.slice";
import { UPDATE_PROJECT_DOC } from "@/gql/mutations";
import { bytesToBase64 } from "@/lib/utils";
import { useMutation } from "@apollo/client";
import { Doc, encodeStateAsUpdateV2 } from "yjs";
import { useYObjects } from "./use-y-objects";

export function useUpdateProjectDoc() {
  const [updateProjectDoc] = useMutation(UPDATE_PROJECT_DOC);
  const project = useAppSelector(selectProject);
  const projectId = project?.id;
  const { doc } = useYObjects();

  return (opts?: { beforeUpdate?: (doc: Doc) => void }) => {
    if (!projectId || !doc) {
      console.error("Project ID or document not found.");
      return;
    }

    try {
      if (opts?.beforeUpdate) {
        opts.beforeUpdate(doc);
      }

      const encodedDoc = bytesToBase64(encodeStateAsUpdateV2(doc));
      return updateProjectDoc({
        variables: {
          projectId,
          doc: encodedDoc,
        },
      });
    } catch (error) {
      console.error("Error updating project document:", error);
      throw new Error("Failed to update document.");
    }
  };
}
