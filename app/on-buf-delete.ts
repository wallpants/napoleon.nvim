import { type Napoleon } from "./napoleon";
import { type CustomEvents } from "./types.ts";

const NOTIFICATION = "buffer_delete";

export async function onBufDelete(app: Napoleon) {
   async function handleBufferDelete(_args: CustomEvents["notifications"][typeof NOTIFICATION]) {
      app.url = "";
      app.lines = [];
      await app.goodbye();
   }

   // Notification handler
   app.nvim.onNotification(NOTIFICATION, handleBufferDelete);

   // Create autocmd to send RPCNotification
   await app.nvim.call("nvim_create_autocmd", [
      ["BufDelete"],
      {
         group: app.augroupId,
         buffer: app.buffer,
         desc: "Notify ghost-text",
         command: `lua
            vim.rpcnotify(${app.nvim.channelId}, "${NOTIFICATION}")`,
      },
   ]);
}
