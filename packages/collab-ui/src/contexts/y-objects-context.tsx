import { createContext } from "react";
import { Awareness } from "y-protocols/awareness.js";
import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import { Doc, PermanentUserData } from "yjs";

export const YObjectsContext = createContext<YObjects | null>(null);
export type YObjects = {
  doc: Doc;
  awareness: Awareness;
  userData: PermanentUserData;
  providers: {
    websocket: WebsocketProvider | null;
    webRtc: WebrtcProvider | null;
  };
};
