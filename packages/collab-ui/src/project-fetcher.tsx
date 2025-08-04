import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./app/hooks";
import YObjectsProvider from "./components/y-objects-provider";
import { projectSet, selectProject, userSet } from "./features/global.slice";
import { GET_PROJECT_WITH_UPDATES } from "./gql/queries";
import EditorView from "./views/editor";

export default function ProjectFetcher({
  sessionId,
  user,
}: {
  sessionId: string;
  user: string;
}) {
  const dispatch = useAppDispatch();
  const project = useSelector(selectProject);
  const { data } = useQuery(GET_PROJECT_WITH_UPDATES, {
    variables: { sessionId },
    fetchPolicy: "network-only",
    ssr: false,
    onCompleted: (data) => {
      if (data.project) {
        dispatch(projectSet(data.project));
      }
    },
  });

  useEffect(() => {
    dispatch(userSet(user));
  }, [dispatch, user]);

  if (!data || !project?.id || !user) return null;

  const { id, yDocUpdates } = project;

  return (
    <YObjectsProvider project={{ id, updates: yDocUpdates }}>
      <EditorView projectId={project.id} />
    </YObjectsProvider>
  );
}
