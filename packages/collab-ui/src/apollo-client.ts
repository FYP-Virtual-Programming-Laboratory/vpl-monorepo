import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { getConfig } from "./lib/integration/configure";

const clientMaps: Map<string, ApolloClient<NormalizedCacheObject>> = new Map();

export function getApolloClient() {
  const uri = getConfig("gqlUrl");

  let client = clientMaps.get(uri);

  if (!client) {
    client = new ApolloClient({
      uri,
      cache: new InMemoryCache(),
      headers: {
        user: getConfig("user"),
      },
    });

    clientMaps.set(uri, client);
  }

  return client;
}
