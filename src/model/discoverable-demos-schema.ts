import * as z from "zod/mini";
import { zPytchProgramKind } from "./pytch-program-types";

// Pure (asset/store-free) Zod schemas and types describing the discoverable
// demos catalogue as served by the demo-catalogue server.  Kept separate from
// discoverable-demos.ts (which imports images, easy-peasy, etc.) so it can be
// loaded by plain Node tooling — notably the OpenAPI generation script, which
// derives the published schema from this single source of truth.
// discoverable-demos.ts re-exports these for existing importers.

export const kDemoKindValues = ["game" as const, "snippet" as const];
export const zDemoKind = z.literal(kDemoKindValues);
export type DemoKind = z.infer<typeof zDemoKind>;

export const kSortByValues = ["lastUpdated", "alphabetAsc"] as const;
export const zSortBy = z.literal(kSortByValues);
export type SortBy = z.infer<typeof zSortBy>;

// The slot `latestUuid` is not yet used.  In due course it will support
// the UI showing a message like "there is a newer version of this demo:
// CLICK HERE to explore it".  If `null`, it means the whole demo is no
// longer in the catalogue of live demos.
export const zDemoCatalogueEntry = z.strictObject({
  uuid: z.string(),
  displayName: z.string(),
  authorName: z.string(),
  programKind: zPytchProgramKind,
  demoKind: zDemoKind,
  summaryMarkdown: z.string(),
  lastUpdated: z.string(),
  recommended: z.boolean(),
  thumbnailImageExtension: z.string(),
  thumbnailVideoExtension: z.union([z.null(), z.string()]),
  latestUuid: z.union([z.null(), z.string()]),
});
export type DemoCatalogueEntry = z.infer<typeof zDemoCatalogueEntry>;

export const zDemoCatalogue = z.array(zDemoCatalogueEntry);
export type DemoCatalogue = z.infer<typeof zDemoCatalogue>;
