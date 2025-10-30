import { action, Action, thunk, Thunk } from "easy-peasy";
import { urlWithinApp } from "../env-utils";
import { fetchParsedJsonValue } from "../utils";

type ContentFetchState<ContentT> =
  | { state: "idle" }
  | { state: "requesting" }
  | { state: "available"; content: ContentT }
  | { state: "error" };

export type ExternalJsonSlice<ContentT> = {
  contentFetchState: ContentFetchState<ContentT>;
  setRequestingContent: Action<ExternalJsonSlice<ContentT>>;
  setContentFetchError: Action<ExternalJsonSlice<ContentT>>;
  setContent: Action<ExternalJsonSlice<ContentT>, ContentT>;
  maybeLoadContent: Thunk<ExternalJsonSlice<ContentT>>;
};

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
