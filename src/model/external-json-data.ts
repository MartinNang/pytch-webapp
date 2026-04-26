import { action, Action, generic, Generic, thunk, Thunk } from "easy-peasy";
import { urlWithinApp } from "../env-utils";
import { fetchParsedJsonValue } from "../utils";

type ContentFetchState<ContentT> =
  | { state: "idle"; urlFun: () => string }
  | { state: "requesting" }
  | { state: "available"; content: ContentT }
  | { state: "error" };

/** Type intended to be used as a model slice representing a piece of
 * externally-fetched data, which is parsed as JSON and then transformed
 * into the final "content".  An object of this type is typically
 * constructed via `externalJsonSlice()`.  Components will typically
 * only need to refer to the `contentFetchState` slot, and call the
 * `maybeLoadContent()` thunk via an effect, for which
 * `useActionAsEffect()` is helpful. */
export type ExternalJsonSlice<ContentT> = {
  contentFetchState: Generic<ContentFetchState<ContentT>>;
  setRequestingContent: Action<ExternalJsonSlice<ContentT>>;
  setContentFetchError: Action<ExternalJsonSlice<ContentT>>;
  setContent: Action<ExternalJsonSlice<ContentT>, ContentT>;
  maybeLoadContent: Thunk<ExternalJsonSlice<ContentT>>;
};

function assertFetchState<
  ContentT,
  RequiredStateKindT extends ContentFetchState<ContentT>["state"],
>(
  fetchState: ContentFetchState<ContentT>,
  requiredStateKind: RequiredStateKindT
): asserts fetchState is ContentFetchState<ContentT> & {
  state: RequiredStateKindT;
} {
  const gotStateKind = fetchState.state;
  if (gotStateKind !== requiredStateKind)
    throw new Error(
      `expecting state "${requiredStateKind}" but got "${gotStateKind}"`
    );
}

/** Construct a new object suitable for use as a model slice value.  The
 * resulting `maybeLoadContent()` thunk fetches JSON from the given
 * `urlNub` (after conversion to be "within the app"), and then passes
 * the parsed result through the given `contentFromRawObj()` conversion
 * function. */
export function externalJsonSlice<ContentT>(
  urlFun: () => string,
  contentFromRawObj: (rawObj: unknown) => ContentT
): ExternalJsonSlice<ContentT> {
  return {
    contentFetchState: generic({ state: "idle", urlFun }),

    setRequestingContent: action((state) => {
      assertFetchState(state.contentFetchState, "idle");
      state.contentFetchState = { state: "requesting" };
    }),
    setContentFetchError: action((state) => {
      assertFetchState(state.contentFetchState, "requesting");
      state.contentFetchState = { state: "error" };
    }),
    setContent: action((state, content) => {
      assertFetchState(state.contentFetchState, "requesting");
      state.contentFetchState = { state: "available", content };
    }),

    maybeLoadContent: thunk(async (actions, _voidPayload, helpers) => {
      const state = helpers.getState();
      const fetchState = state.contentFetchState;
      if (fetchState.state !== "idle") return;

      const url = fetchState.urlFun();
      actions.setRequestingContent();

      try {
        const rawObject = await fetchParsedJsonValue(url);
        const content = contentFromRawObj(rawObject);
        actions.setContent(content);
      } catch (err) {
        console.error(`error fetching content from "${url}":`, err);
        actions.setContentFetchError();
      }
    }),
  };
}
