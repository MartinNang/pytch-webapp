import { externalJsonSlice, ExternalJsonSlice } from "./external-json-data";
import { PytchProgramKind } from "./pytch-program";

type ProgramKindSpecifier = { forProgramKind?: PytchProgramKind };

export type KeyDescriptor =
  | string
  | { kind: "chord"; keys: Array<string> }
  | { kind: "alternatives"; keys: Array<KeyDescriptor> }
  | { kind: "respective"; keys: Array<KeyDescriptor> }
  | { kind: "sequence"; keys: Array<KeyDescriptor> };

type SectionEntryNub =
  | { kind: "text"; markdown: string }
  | { kind: "item"; key: KeyDescriptor; help: string };
export type SectionEntry = ProgramKindSpecifier & SectionEntryNub;

type SectionNub = { heading: string; entries: Array<SectionEntry> };
export type Section = ProgramKindSpecifier & SectionNub;

export type Content = { sections: Array<Section> };

////////////////////////////////////////////////////////////////////////

export type KeyboardShortcutsHelpContent = ExternalJsonSlice<Content>;

export let keyboardShortcutsHelpContent = externalJsonSlice(
  "/data/keyboard-shortcuts.json",
  (obj) => obj as Content
);
