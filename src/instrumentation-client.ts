import { initBotId } from "botid/client/core";

// Invisible bot challenge on every endpoint that sends email or spends LLM tokens.
initBotId({
  protect: [
    { path: "/api/contact", method: "POST" },
    { path: "/api/chat", method: "POST" },
  ],
});
