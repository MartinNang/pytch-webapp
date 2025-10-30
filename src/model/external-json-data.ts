import { Action, Thunk } from "easy-peasy";

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
