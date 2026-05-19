import { ActorKind, AssetMimeType } from "./junior/structured-program";

export type ScopedResourceKind =
  | `${ActorKind}.${AssetMimeType | "script"}`
  | "flat.flat-asset";
