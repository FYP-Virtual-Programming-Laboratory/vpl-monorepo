import { YObjectsContext } from "@/contexts/y-objects-context";
import { useContext } from "react";

export function useYObjects() {
  const context = useContext(YObjectsContext);

  if (!context) {
    throw new Error(
      "useYObjects must be used within a YObjectsProvider with value."
    );
  }

  return context;
}
