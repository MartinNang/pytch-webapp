import { PytchProgramKind } from "./pytch-program-types";
import { type DemoKind, type SortBy } from "./discoverable-demos-schema";
import { assertNever } from "../utils";

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
