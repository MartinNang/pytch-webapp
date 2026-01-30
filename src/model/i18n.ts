import { Action, Actions, thunk, Thunk } from "easy-peasy";
import { propSetterAction } from "../utils";

// "Slice action" / "slice async thunk" types, forward-referencing the
// model slice type I18nContextState.

type SAction<ArgT = void> = Action<I18nContextState, ArgT>;

type SAThunk<PayloadT, ReturnT = void> = Thunk<
  I18nContextState,
  PayloadT,
  unknown,
  object,
  Promise<ReturnT>
>;

type I18nStateKind = "not-yet-booted" | "pending" | "ready" | "failed";

export type I18nContextState = {
  i18nStateKind: I18nStateKind;
  setI18nStateKind: SAction<I18nStateKind>;
};

async function withStateUpdates(
  actions: Actions<I18nContextState>,
  body: () => Promise<void>
) {
  actions.setI18nStateKind("pending");
  try {
    await body();
    actions.setI18nStateKind("ready");
  } catch {
    actions.setI18nStateKind("failed");
  }
}

export let i18nContextState: I18nContextState = {
  i18nStateKind: "not-yet-booted",
  setI18nStateKind: propSetterAction("i18nStateKind"),
};
