import { action, Action, thunk, Thunk } from "easy-peasy";
import { urlWithinApp } from "../env-utils";
import { fetchParsedJsonValue } from "../utils";

type ContentFetchState<ContentT> =
  | { state: "idle" }
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
  contentFetchState: ContentFetchState<ContentT>;
  setRequestingContent: Action<ExternalJsonSlice<ContentT>>;
  setContentFetchError: Action<ExternalJsonSlice<ContentT>>;
  setContent: Action<ExternalJsonSlice<ContentT>, ContentT>;
  maybeLoadContent: Thunk<ExternalJsonSlice<ContentT>>;
};

/** Construct a new object suitable for use as a model slice value.  The
 * resulting `maybeLoadContent()` thunk fetches JSON from the given
 * `urlNub` (after conversion to be "within the app"), and then passes
 * the parsed result through the given `contentFromRawObj()` conversion
 * function. */
export function externalJsonSlice<ContentT>(
  urlNub: string,
  contentFromRawObj: (rawObj: unknown) => ContentT
): ExternalJsonSlice<ContentT> {
  return {
    contentFetchState: { state: "idle" },

    setRequestingContent: action((state) => {
      state.contentFetchState = { state: "requesting" };
    }),
    setContentFetchError: action((state) => {
      state.contentFetchState = { state: "error" };
    }),
    setContent: action((state, content) => {
      state.contentFetchState = { state: "available", content };
    }),

    maybeLoadContent: thunk(async (actions, _voidPayload, helpers) => {
      const state = helpers.getState();
      if (state.contentFetchState.state !== "idle") return;

      actions.setRequestingContent();

      try {
        const url = urlWithinApp(urlNub);
        const rawObject = await fetchParsedJsonValue(url);
        const content = contentFromRawObj(rawObject);
        actions.setContent(content);
      } catch (err) {
        console.error(`error fetching content from "${urlNub}":`, err);
        actions.setContentFetchError();
      }
    }),
  };
}
