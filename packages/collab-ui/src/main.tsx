import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { CodeCollab, configure } from "./index";

const user =
  new URLSearchParams(window.location.search).get("user") || "farayolaj";

configure({
  gqlUrl: import.meta.env.VITE_GQL_URL,
  signalUrl: import.meta.env.VITE_SIGNAL_URL,
  wsUrl: import.meta.env.VITE_WS_URL,
  user,
}).then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <div style={{ width: "100vw", height: "100vh" }}>
        <CodeCollab
          sessionId="123456"
          getDisplayName={(user) =>
            ({
              farayolaj: "Joshua Farayola",
              johndoe: "John Doe",
            }[user] || user)
          }
        />
      </div>
    </StrictMode>
  );
});
