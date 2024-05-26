import { type BaseEvents } from "bunvim";
import { array, number, object, string, type InferOutput } from "valibot";

export const PluginPropsSchema = object({
   config: object({
      model: string(),
      temperature: number(),
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
