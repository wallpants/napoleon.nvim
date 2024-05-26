import { Napoleon } from "./napoleon.ts";
import { onBufDelete } from "./on-buf-delete.ts";
import { onNapoleonSend } from "./on-send.ts";

const napoleon = await Napoleon.init();

onNapoleonSend(napoleon);
await onBufDelete(napoleon);
