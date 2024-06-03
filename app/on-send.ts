import ollama from "ollama";
import { type Napoleon } from "./napoleon";
import { type CustomEvents } from "./types.ts";

type Role = "user" | "assistant" | "system";
type Message = { role: Role | ""; content: string[] };

const NOTIFICATION = "send";

export function onNapoleonSend(app: Napoleon) {
   // Notification handler
   app.nvim.onNotification(
      NOTIFICATION,
      async (_args: CustomEvents["notifications"][typeof NOTIFICATION]) => {
         await app.nvim.call("nvim_buf_set_lines", [
            app.buffer,
            -1,
            -1,
            true,
            ["", "ASSISTANT:", "#".repeat(30)],
         ]);

         const initialLines = await app.nvim.call("nvim_buf_get_lines", [app.buffer, 0, -1, true]);

         const messages: Message[] = (
            app.config.initial_message
               ? [
                    {
                       role: app.config.initial_message.role,
                       content: [app.config.initial_message.message],
                    } as Message,
                 ]
               : []
         ).concat(parseMessages(initialLines));

         const response = await ollama.chat({
            model: app.config.model,
            messages: messages.map((m) => ({ ...m, content: m.content.join("\n") })),
            stream: true,
            options: {
               temperature: app.config.temperature,
            },
         });

         let responseContent = "";

         for await (const part of response) {
            responseContent += part.message.content;
            const split = responseContent.split("\n");
            await app.nvim.call("nvim_buf_set_lines", [
               app.buffer,
               initialLines.length,
               -1,
               true,
               split,
            ]);
            const buff = await app.nvim.call("nvim_get_current_buf", []);
            if (buff === app.buffer) {
               // autoscroll if user is on buffer
               await app.nvim.call("nvim_win_set_cursor", [
                  0,
                  [initialLines.length + split.length, 0],
               ]);
            }
         }

         await app.nvim.call("nvim_buf_set_lines", [
            app.buffer,
            -1,
            -1,
            true,
            ["", "USER:", "#".repeat(30), ""],
         ]);
         const buff = await app.nvim.call("nvim_get_current_buf", []);
         if (buff === app.buffer) {
            // autoscroll if user is on buffer
            const lines = await app.nvim.call("nvim_buf_get_lines", [app.buffer, 0, -1, true]);
            await app.nvim.call("nvim_win_set_cursor", [0, [lines.length, 0]]);
         }
      },
   );
}

function parseMessages(lines: string[]) {
   const messages: Message[] = [];

   const message: Message = {
      role: "",
      content: [],
   };

   lines.forEach((line, idx) => {
      if (line === "#".repeat(30)) {
         if (message.role) {
            messages.push({ ...message, content: message.content.slice(0, -1) });
            message.role = "";
            message.content = [];
         }
         const prev = lines[idx - 1];
         if (prev) {
            message.role = prev.slice(0, -1).toLowerCase() as Role;
         }
         return;
      }

      if (message.role) {
         message.content.push(line);
      }
   });

   if (message.role && message.content.length) messages.push(message);
   return messages;
}
