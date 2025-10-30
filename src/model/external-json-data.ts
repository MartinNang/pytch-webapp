type ContentFetchState<ContentT> =
  | { state: "idle" }
  | { state: "requesting" }
  | { state: "available"; content: ContentT }
  | { state: "error" };
