import { useAppSelector } from "@/app/hooks";
import { selectColour, selectUsername } from "@/features/global.slice";
import { setUpWebRTCProvider, setUpWebSocketProvider } from "@/lib/connections";
import { base64ToBytes } from "@/lib/utils";
import { Position, Selection } from "monaco-editor";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Awareness } from "y-protocols/awareness.js";
import { applyUpdateV2, Doc, PermanentUserData } from "yjs";
import { YObjectsContext } from "../contexts/y-objects-context";

export type AwarenessState = {
  user: {
    name: string;
    colour: string;
  };
  cursor?: Position;
  selection?: Selection;
};

export default function YObjectsProvider({
  children,
  project,
}: {
  children: ReactNode;
  project: {
    id: number;
    updates: string;
  };
}) {
  const username = useAppSelector(selectUsername);
  const colour = useAppSelector(selectColour);
  const doc = useRef<Doc>();
  const awareness = useRef<Awareness>();
  const userData = useRef<PermanentUserData>();
  const providers = useRef<{
    webRtc: ReturnType<typeof setUpWebRTCProvider>;
    websocket: ReturnType<typeof setUpWebSocketProvider>;
  }>();
  const [key, setKey] = useState(Math.random() * 500);

  const forceRererender = () => {
    setKey(Math.random() * 500);
  };

  useEffect(() => {
    if (!username) return;

    const _doc = new Doc({ gc: false });
    // @ts-expect-error - Expose the doc object to the window for debugging
    window.doc = doc.current;
    const _awareness = new Awareness(_doc);
    const _userData = new PermanentUserData(_doc);
    const _providers = {
      webRtc: setUpWebRTCProvider(project.id.toString(), {
        awareness: _awareness,
        doc: _doc,
      }),
      websocket: setUpWebSocketProvider(project.id.toString(), {
        awareness: _awareness,
        doc: _doc,
      }),
    };

    // Apply the initial updates to the document
    if (project.updates) applyUpdateV2(_doc, base64ToBytes(project.updates));

    _awareness.setLocalState({});
    _awareness.setLocalStateField("user", {
      name: username,
      colour,
    });
    _userData.setUserMapping(_doc, _doc.clientID, username);

    doc.current = _doc;
    awareness.current = _awareness;
    userData.current = _userData;
    providers.current = _providers;

    forceRererender();

    return () => {
      providers.current?.webRtc?.destroy();
      providers.current?.websocket?.destroy();
      awareness.current?.destroy();
      doc.current?.destroy();
    };
  }, [colour, project, username]);

  useEffect(() => {}, [awareness, colour, username]);

  if (
    !doc.current ||
    !awareness.current ||
    !userData.current ||
    !providers.current
  ) {
    return null;
  }

  return (
    <YObjectsContext.Provider
      key={key}
      value={{
        doc: doc.current,
        awareness: awareness.current,
        userData: userData.current,
        providers: providers.current,
      }}
    >
      {children}
    </YObjectsContext.Provider>
  );
}
