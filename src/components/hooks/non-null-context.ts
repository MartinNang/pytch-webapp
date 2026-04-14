import { Context, use } from "react";
import { failIfNull } from "../../utils";

export function useNonNullContext<ContextT>(
  context: Context<ContextT | null>
): ContextT {
  return failIfNull(use<ContextT | null>(context), "no context");
}
