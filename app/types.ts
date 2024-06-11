import { type BaseEvents } from "bunvim";
import {
   array,
   boolean,
   literal,
   number,
   object,
   optional,
   string,
   union,
   type InferOutput,
} from "valibot";

export const PluginPropsSchema = object({
   config: object({
      autoscroll: boolean(),
      model: string(),
      temperature: number(),
      initial_message: optional(
         object({
            role: union([literal("system"), literal("user"), literal("assistant")]),
            message: array(string()),
         }),
      ),
   }),
});
export type PluginProps = InferOutput<typeof PluginPropsSchema>;
export type Config = PluginProps["config"];

export const ContentChangeSchema = object({
   abs_path: string(),
   lines: array(string()),
});

// eslint-disable-next-line
export interface CustomEvents extends BaseEvents {
   requests: {
      before_exit: [];
   };
   notifications: {
      buffer_delete: [];
      send: [];
   };
}
