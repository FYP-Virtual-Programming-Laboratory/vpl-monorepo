import { createContext } from "react";

export const DisplayNameContext = createContext<{
  getDisplayName: (user: string) => string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}>({ getDisplayName: (_user: string) => "" });
