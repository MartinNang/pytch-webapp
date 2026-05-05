import { PytchProgramKind, zPytchProgramKind } from "./pytch-program";
import { util } from "zod/v3";
import assertNever = util.assertNever;
import { ExternalJsonSlice, externalJsonSlice } from "./external-json-data";
import { Action, action } from "easy-peasy";
import flatIcon from "../images/flat-simple.png";
import permethodIcon from "../images/per-method-simple.png";
import * as z from "zod/mini";
import { RefObject } from "react";
import { fetchParsedJsonValue, propSetterAction } from "../utils";
import { envVarOrFail } from "../env-utils";

export const kDemoKindValues = ["game" as const, "snippet" as const];
export const zDemoKind = z.literal(kDemoKindValues);
export type DemoKind = z.infer<typeof zDemoKind>;

export const kSortByValues = ["lastUpdated", "alphabetAsc"] as const;
export const zSortBy = z.literal(kSortByValues);
export type SortBy = z.infer<typeof zSortBy>;

export type DemoKindSelector = DemoKind | "all";
export type PytchProgramKindSelector = PytchProgramKind | "all";

export function displayDemoKindName(demoKind: DemoKind): string {
  switch (demoKind) {
    case "game":
      return "Game";
    case "snippet":
      return "Snippet";
    default:
      return assertNever(demoKind);
  }
}

export function displayProgramKindName(programKind: PytchProgramKind): string {
  switch (programKind) {
    case "flat":
      return "Flat";
    case "per-method":
      return "Per-method";
    default:
      return assertNever(programKind);
  }
}

export function displaySortByName(sortBy: SortBy): string {
  switch (sortBy) {
    case "lastUpdated":
      return "Last Updated";
    case "alphabetAsc":
      return "A to Z";
    default:
      return assertNever(sortBy);
  }
}

/**
 * Keeping this icon section here for now since it is only used on the demos page,
 * however, this could probably be used on the projects and tutorials page in the
 * future. (and it might be nice to adjust
 */

export type ProgramKindIcon = {
  src: string;
  alt: string;
};

export function getProgramKindIcon(
  programKind: PytchProgramKind
): ProgramKindIcon {
  switch (programKind) {
    case "flat":
      return {
        src: flatIcon,
        alt: "flat project",
      };
    case "per-method":
      return {
        src: permethodIcon,
        alt: "per-method project",
      };
    default:
      return assertNever(programKind);
  }
}

const zDemoCatalogueEntry = z.strictObject({
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
  latestUuid: z.string(),
});
export type DemoCatalogueEntry = z.infer<typeof zDemoCatalogueEntry>;

export const zDemoCatalogue = z.array(zDemoCatalogueEntry);
type DemoCatalogue = z.infer<typeof zDemoCatalogue>;

function cmpCatalogueEntriesByLastUpdated(
  a: DemoCatalogueEntry,
  b: DemoCatalogueEntry
) {
  return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
}

function cmpCatalogueEntriesByDisplayName(
  a: DemoCatalogueEntry,
  b: DemoCatalogueEntry
) {
  return a.displayName.localeCompare(b.displayName);
}

// TODO: Search for all occurrences of "en" (including quotes) when we
// think about how to update for multiple languages.

function demoUrl(relativeUrl: string): string {
  const demosDataRoot = envVarOrFail("VITE_DEMO_CATALOGUE_BASE");
  return [demosDataRoot, relativeUrl].join("/");
}

function demoResourceUrl(
  uuid: string,
  language: string,
  relativeUrl: string
): string {
  return demoUrl(`${uuid}/${language}/${relativeUrl}`);
}

export function demoThumbnailImageUrl(demo: DemoCatalogueEntry): string {
  const relativeUrl = `content/thumbnail${demo.thumbnailImageExtension}`;
  return demoResourceUrl(demo.uuid, "en", relativeUrl);
}

export function maybeDemoThumbnailVideoUrl(
  demo: DemoCatalogueEntry
): string | null {
  if (demo.thumbnailVideoExtension == null) {
    return null;
  }

  const relativeUrl = `content/thumbnail${demo.thumbnailVideoExtension}`;
  return demoResourceUrl(demo.uuid, "en", relativeUrl);
}

export function demoProjectZipfileUrl(demoUuid: string): string {
  return demoResourceUrl(demoUuid, "en", "project.zip");
}

export function demoDescriptionUrl(demoUuid: string): string {
  return demoResourceUrl(demoUuid, "en", "content/description.md");
}

export async function demoCatalogueEntryFromServer(
  demoUuid: string
): Promise<DemoCatalogueEntry> {
  const url = demoResourceUrl(demoUuid, "en", "metadata.json");
  const json = await fetchParsedJsonValue(url);
  return zDemoCatalogueEntry.parse(json);
}

export type DemosContent = {
  allDemos: DemoCatalogue;
  recommendedDemos: DemoCatalogue;
  searchResults: DemoCatalogue;
};

export type IDemosSearchFilters = {
  searchTerm: string;
  demoKindSelector: DemoKindSelector;
  programKindSelector: PytchProgramKindSelector;
  setSearchTerm: Action<IDemosSearchFilters, string>;
  setDemoKindSelector: Action<IDemosSearchFilters, DemoKindSelector>;
  setProgramKindSelector: Action<IDemosSearchFilters, PytchProgramKindSelector>;
};

export type IDiscoverableDemos = {
  fetchedDemos: ExternalJsonSlice<DemosContent>;
  searchFilters: IDemosSearchFilters;
  searchForDemos: Action<IDiscoverableDemos>;
  sortBy: SortBy;
  setSortBy: Action<IDiscoverableDemos, SortBy>;
  recommendedIndex: number;
  setRecommendedIndex: Action<IDiscoverableDemos, number>;
};

export function demosIndexUrl(language: string): string {
  return demoUrl(`index/${language}/demos.json`);
}

const demosContentFromRawCatalogue = (
  rawDemoCatalogueData: unknown
): DemosContent => {
  const allDemos = zDemoCatalogue.parse(rawDemoCatalogueData);
  const recommendedDemos = allDemos.filter((demo) => demo.recommended);
  const searchResults = allDemos.sort(cmpCatalogueEntriesByLastUpdated);
  return { allDemos, recommendedDemos, searchResults };
};

export const discoverableDemos: IDiscoverableDemos = {
  fetchedDemos: externalJsonSlice(
    () => demosIndexUrl("en"),
    demosContentFromRawCatalogue // TODO: check if deep comparison prevents endless re-render
  ),
  searchFilters: {
    searchTerm: "",
    demoKindSelector: "all",
    programKindSelector: "all",
    setSearchTerm: propSetterAction("searchTerm"),
    setDemoKindSelector: propSetterAction("demoKindSelector"),
    setProgramKindSelector: propSetterAction("programKindSelector"),
  },
  sortBy: "lastUpdated",
  setSortBy: action((state, newSortBy) => {
    state.sortBy = newSortBy;
  }),
  searchForDemos: action((state) => {
    if (state.fetchedDemos.contentFetchState.state === "available") {
      const demosContent = state.fetchedDemos.contentFetchState.content;
      const searchFilters = state.searchFilters;
      const sortBy = state.sortBy;

      let searchResults = [...demosContent.allDemos];

      if (searchFilters.searchTerm.length > 0) {
        searchResults = searchResults.filter((demo) =>
          demo.displayName
            .toLowerCase()
            .includes(searchFilters.searchTerm.toLowerCase())
        );
      }

      if (searchFilters.demoKindSelector !== "all") {
        searchResults = searchResults.filter(
          (demo) => searchFilters.demoKindSelector === demo.demoKind
        );
      }

      if (searchFilters.programKindSelector !== "all") {
        searchResults = searchResults.filter(
          (demo) => searchFilters.programKindSelector === demo.programKind
        );
      }

      switch (sortBy) {
        case "alphabetAsc":
          searchResults = searchResults.sort(cmpCatalogueEntriesByDisplayName);
          break;
        case "lastUpdated":
          searchResults = searchResults.sort(cmpCatalogueEntriesByLastUpdated);
          break;
        default:
          assertNever(sortBy);
      }
      demosContent.searchResults = searchResults;
    } else {
      console.warn("fetched demos are not available.");
    }
  }),
  recommendedIndex: 0,
  setRecommendedIndex: action((state, newIndex) => {
    state.recommendedIndex = newIndex;
  }),
};

export function resetVideo(videoRef: RefObject<HTMLVideoElement | null>) {
  if (videoRef.current) videoRef.current.currentTime = 0;
  if (videoRef.current) videoRef.current.play();
}
