import { ApolloProvider } from "@apollo/client";
import { useMemo } from "react";
import { Provider } from "react-redux";

import { getApolloClient } from "./apollo-client";
import { store } from "./app/store";
import { DisplayNameContext } from "./components/context/display-name.context";
import "./index.css";
import { getConfig } from "./lib/integration/configure";
import ProjectFetcher from "./project-fetcher";

export default function CodeCollab({
  sessionId,
  getDisplayName,
}: {
  sessionId: string;
  getDisplayName: (user: string) => string;
}) {
  const user = useMemo(() => getConfig("user"), []);

  return (
    <DisplayNameContext.Provider value={{ getDisplayName }}>
      <ApolloProvider client={getApolloClient()}>
        <Provider store={store}>
          <ProjectFetcher sessionId={sessionId} user={user} />
        </Provider>
      </ApolloProvider>
    </DisplayNameContext.Provider>
  );
}
