import { Action, Actions, thunk, Thunk } from "easy-peasy";

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

export type I18nContextState = {
};

export let i18nContextState: I18nContextState = {
};
