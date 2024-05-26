import { NVIM_LOG_LEVELS, attach, type LogLevel, type Nvim } from "bunvim";
import { parse } from "valibot";
import { PluginPropsSchema, type Config, type CustomEvents, type PluginProps } from "./types";

// These values are set by neovim when starting the bun process
const ENV = {
   NVIM: process.env["NVIM"],
   LOG_LEVEL: process.env["LOG_LEVEL"] as LogLevel | undefined,
   DEV: Boolean(process.env["IS_DEV"]),
};

export class Napoleon {
   nvim: Nvim<CustomEvents>;
   /**
    * Neovim autocommand group id,
    * under which all autocommands are to be registered
    */
   augroupId: number;
   config: Config;

   url = "";
   lines: string[] = [];
   buffer: number;

   private constructor(nvim: Nvim, augroupId: number, buffer: number, props: PluginProps) {
      this.nvim = nvim as Nvim<CustomEvents>;
      this.augroupId = augroupId;
      this.config = props.config;
      this.buffer = buffer;
   }

   static async init() {
      // we use a static method to initialize Napoleon instead
      // of using the constructor, because async constructors are not a thing
      if (!ENV.NVIM) throw Error("socket missing");

      const nvim = await attach<CustomEvents>({
         socket: ENV.NVIM,
         client: { name: "napoleon" },
         logging: { level: ENV.LOG_LEVEL },
      });

      const props = (await nvim.call("nvim_get_var", ["napoleon_props"])) as PluginProps;
      if (ENV.DEV) parse(PluginPropsSchema, props);

      const augroupId = await nvim.call("nvim_create_augroup", ["napoleon", { clear: true }]);

      // create napoleon buffer
      const buffer = await nvim.call("nvim_create_buf", [true, true]);
      await nvim.call("nvim_buf_set_lines", [buffer, 0, -1, true, ["USER:", "#".repeat(30), ""]]);
      await nvim.call("nvim_buf_set_name", [buffer, "napoleon.nvim"]);
      await nvim.call("nvim_set_current_buf", [buffer]);
      await nvim.call("nvim_buf_set_option", [buffer, "filetype", "markdown"]);
      await nvim.call("nvim_win_set_cursor", [0, [3, 0]]);

      return new Napoleon(nvim, augroupId, buffer, props);
   }

   async goodbye() {
      await this.nvim.call("nvim_del_augroup_by_id", [this.augroupId]);
      await this.nvim.call("nvim_notify", ["napoleon: goodbye", NVIM_LOG_LEVELS.INFO, {}]);
      this.nvim.detach();
      process.exit(0);
   }
}
