import { initLoader } from "../monaco-loader";

const KVStore = {
  gqlUrl: "http://localhost:3000/graphql",
  wsUrl: "ws://localhost:1234",
  signalUrl: "ws://localhost:4444",
  user: undefined as string | undefined,
};

export function getConfig(key: keyof typeof KVStore) {
  const value = KVStore[key];

  if (value === undefined) {
    throw new Error(`The key '${key}' is not configured`);
  }

  return value;
}

export async function configure({
  gqlUrl = KVStore.gqlUrl,
  wsUrl = KVStore.wsUrl,
  signalUrl = KVStore.signalUrl,
  user,
}: {
  gqlUrl?: string;
  wsUrl?: string;
  signalUrl?: string;
  user: string;
}) {
  KVStore.gqlUrl = gqlUrl;
  KVStore.wsUrl = wsUrl;
  KVStore.signalUrl = signalUrl;
  KVStore.user = user;

  await initLoader();
}
