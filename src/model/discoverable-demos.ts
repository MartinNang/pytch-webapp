import { PytchProgramKind } from "./pytch-program";
import { util } from "zod/v3";
import assertNever = util.assertNever;
import { demoUrl } from "./project-from-demo";
import { ExternalJsonSlice, externalJsonSlice } from "./external-json-data";
import { Action, action, FilterActionTypes } from "easy-peasy";
import flatIcon from "../images/flat-simple.png";
import permethodIcon from "../images/per-method-simple.png";
import * as z from "zod/mini";
import { RefObject } from "react";

export type DemoKindSelector = DemoKind | "all";
export type PytchProgramKindSelector = PytchProgramKind | "all";

export const kDemoKindValues = ["game" as const, "snippet" as const];
export const zDemoKind = z.literal(kDemoKindValues);
export type DemoKind = z.infer<typeof zDemoKind>;

export const kSortingOptions = ["lastUpdated", "alphabetAsc"] as const;
export const zSortingOptions = z.literal(kSortingOptions);
export type SortBy = z.infer<typeof zSortingOptions>;

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

/** True classes don't play well with Easy-Peasy unfortunately, so it
 * seems to be better to just define a type at the TypeScript level, and
 * then at the JavaScript level it's just a plain object. - Done */
export type Demo = {
  slug: string;
  displayName: string;
  summaryMarkdown: string;
  lastUpdated: Date;
  featuredImageUrl: string;
  featuredVideoUrl: string;
  programKind: PytchProgramKind;
  demoKind: DemoKind;
  recommended: boolean;
};

export type DemosContent = {
  allDemos: Demo[];
  recommendedDemos: Demo[];
  searchResults: Demo[];
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

export type IDemosSearchFilters = {
  searchTerm: string;
  demoKindSelector: DemoKindSelector;
  programKindSelector: PytchProgramKindSelector;
  setSearchTerm: Action<IDemosSearchFilters, string>;
  setDemoKindSelector: Action<IDemosSearchFilters, DemoKindSelector>;
  setProgramKindSelector: Action<IDemosSearchFilters, PytchProgramKindSelector>;
};

const groupDemosIntoSections = (rawHelpData: any): DemosContent => {
  let dContent: DemosContent = {
    recommendedDemos: [],
    allDemos: [],
    searchResults: [],
  };

  for (const datum of rawHelpData) {
    if (datum.recommended) {
      dContent.recommendedDemos.push(datum);
    }
    dContent.allDemos.push(datum);
  }

  dContent.searchResults = dContent.allDemos.sort((a: Demo, b: Demo) => {
    return (
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  });

  return dContent;
};

export function demosIndexUrl(language: string): string {
  return demoUrl(`index/${language}/demos.json`);
}

export const discoverableDemos: IDiscoverableDemos = {
  fetchedDemos: externalJsonSlice(
    demoUrl("demos.json"),
    groupDemosIntoSections // TODO: check if deep comparison prevents endless re-render
  ),
  searchFilters: {
    searchTerm: "",
    demoKindSelector: "all",
    programKindSelector: "all",
    setSearchTerm: action((state, newSearchTerm) => {
      state.searchTerm = newSearchTerm;
    }),
    setDemoKindSelector: action((state, newDemoKindSelector) => {
      state.demoKindSelector = newDemoKindSelector;
    }),
    setProgramKindSelector: action((state, newProgramKindSelector) => {
      state.programKindSelector = newProgramKindSelector;
    }),
  },
  sortBy: "lastUpdated",
  setSortBy: action((state, newSortBy) => {
    state.sortBy = newSortBy;
  }),
  searchForDemos: action((state) => {
    if (state.fetchedDemos.contentFetchState.state === "available") {
      const demosContent = state.fetchedDemos.contentFetchState.content;
      let searchResults: Demo[] = [...demosContent.allDemos];
      const searchFilters: FilterActionTypes<IDemosSearchFilters> =
        state.searchFilters;
      const sortBy: SortBy = state.sortBy;

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
          searchResults = searchResults.sort((a, b) =>
            a.displayName.localeCompare(b.displayName)
          );
          break;
        case "lastUpdated":
          searchResults = searchResults.sort(
            (a, b) =>
              new Date(b.lastUpdated).getTime() -
              new Date(a.lastUpdated).getTime()
          );
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
