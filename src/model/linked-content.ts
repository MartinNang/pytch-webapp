import { assertNever, fetchArrayBuffer } from "../utils";
import {
  projectDescriptor as projectDescriptorFromData,
  StandaloneProjectDescriptor,
  StandaloneProjectDescriptorOps,
} from "../storage/zipfile";
import { envVarOrFail } from "../env-utils";
import { LinkedJrTutorial } from "./junior/jr-tutorial";
import { State } from "easy-peasy";
import { IPytchAppModel } from ".";
import { useStoreState } from "../store";
import {
  LinkedContentRef,
  LinkedNoContentRef,
  LinkedSpecimenRef,
  SpecimenContentHash,
  DemoContentHash,
  LinkedDemoRef,
} from "./linked-content-core";
import { PytchProgramKind } from "./pytch-program";
import { LinkedContentLoadingState } from "./project";
import { demoUrl } from "./project-from-demo";
import { parseMarkdown } from "./demo-sidebar";

export type LessonDescriptor = {
  specimenContentHash: SpecimenContentHash;
  project: StandaloneProjectDescriptor;
};

export type DemoDescriptor = {
  demoContentHash: DemoContentHash;
  headings: string[];
  chapters: string[];
  displayName: string;
  summaryMarkdown: string;
  lastUpdated: string;
  project: StandaloneProjectDescriptor;
};

type LinkedNoContent = { kind: "none" };

const kLinkedNoContent: LinkedNoContent = { kind: "none" };

export type LinkedSpecimen = { kind: "specimen"; lesson: LessonDescriptor };

export type LinkedDemo = { kind: "demo"; demo: DemoDescriptor };

export type LinkedContent =
  | LinkedNoContent
  | LinkedJrTutorial
  | LinkedSpecimen
  | LinkedDemo;

export type LinkedContentKind = LinkedContent["kind"];

export type LinkedContentOfKind<KindT extends LinkedContent["kind"]> =
  LinkedContent & { kind: KindT };

export function linkedContentIsReferent(
  ref: LinkedContentRef,
  content: LinkedContent
): boolean {
  switch (ref.kind) {
    case "none":
      return content.kind === "none";
    case "jr-tutorial":
      return (
        content.kind === "jr-tutorial" && content.content.name === ref.name
      );
    case "specimen":
      return (
        content.kind === "specimen" &&
        content.lesson.specimenContentHash === ref.specimenContentHash
      );
    case "demo":
      return false;
    default:
      return assertNever(ref);
  }
}

export async function dereferenceLinkedNoContent(
  _programKind: PytchProgramKind,
  _ref: LinkedNoContentRef
): Promise<LinkedNoContent> {
  return kLinkedNoContent;
}

const specimenUrl = (relativeUrl: string) => {
  const baseUrl = envVarOrFail("VITE_LESSON_SPECIMENS_BASE");
  return [baseUrl, relativeUrl].join("/");
};

export async function lessonDescriptorFromRelativePath(
  relativePath: string
): Promise<LessonDescriptor> {
  const url = specimenUrl(`${relativePath}.zip`);

  const zipData = await fetchArrayBuffer(url);
  const project = await projectDescriptorFromData(undefined, zipData);

  // TODO: The hash could be precomputed and served with the zip?  A
  // field of a "metadata" JSON file?
  const specimenContentHash = await StandaloneProjectDescriptorOps.contentHash(
    project
  );

  return { specimenContentHash, project };
}

async function fetchDemoChaptersFromMd(
  url: string
): Promise<string | undefined> {
  let res = await fetch(url);
  return res.text();
}

export async function fetchDemo(slug: string) {
  let response = await fetch("/data/demos/demos.json");
  if (!response.ok) {
    throw new Error(`Could not find demos.json`);
  }
  let demos = await response.json();
  return demos.find((d: { slug: string }) => d.slug === slug);
}

async function demoDescriptorFromRelativePath(relativePath: string, slug: string): Promise<DemoDescriptor> {
  const mdUrl = demoUrl(`${slug}/description.md`);

  const chaptersContent = await fetchDemoChaptersFromMd(mdUrl);
  let demoChapters = null;
  if (chaptersContent) {
    demoChapters = parseMarkdown(chaptersContent);
  }
  const demo = await fetchDemo(slug);

  return {
    displayName: demo.displayName,
    lastUpdated: demo.lastUpdated,
    project: demo.project,
    summaryMarkdown: demo.summaryMarkdown,
    demoContentHash: slug,
    headings: demoChapters?.headings || [],
    chapters: demoChapters?.content || [],
  };
}

export async function dereferenceLinkedSpecimen(
  programKind: PytchProgramKind,
  ref: LinkedSpecimenRef
): Promise<LinkedSpecimen> {
  const contentHash = ref.specimenContentHash;
  const relativePath = `_by_content_hash_/${contentHash}`;
  const lesson = await lessonDescriptorFromRelativePath(relativePath);

  const specimenKind = lesson.project.program.kind;
  if (specimenKind !== programKind) {
    throw new Error(
      `project is "${programKind}" but specimen is "${specimenKind}"`
    );
  }

  return { kind: "specimen", lesson };
}

type LinkedContentLoadingStateSummary =
  | (LinkedContentLoadingState & { kind: "idle" | "failed" })
  | { kind: "pending" | "succeeded"; contentKind: LinkedContentKind };

function mapLCLSS(
  state: State<IPytchAppModel>
): LinkedContentLoadingStateSummary {
  const contentState = state.activeProject.linkedContentLoadingState;
  switch (contentState.kind) {
    case "idle":
    case "failed":
      return contentState;
    case "succeeded":
      return {
        kind: "succeeded",
        contentKind: contentState.content.kind,
      };
    case "pending":
      return {
        kind: "pending",
        contentKind: contentState.contentRef.kind,
      };
    default:
      return assertNever(contentState);
  }
}

function eqLCLSS(
  x: LinkedContentLoadingStateSummary,
  y: LinkedContentLoadingStateSummary
): boolean {
  switch (x.kind) {
    case "idle":
    case "failed":
      return y.kind === x.kind;
    case "pending":
    case "succeeded":
      return y.kind === x.kind && y.contentKind === x.contentKind;
    default:
      return assertNever(x);
  }
}

/** Return a summary of the linked-content loading state, containing
 * just:
 *
 * * `kind` — the progress of the loading process (idle / pending /
 *   succeeded / failed)
 * * `contentKind` — if pending or succeeded, what kind of linked
 *   content is being loaded (or has been loaded).
 *
 * Using this hook (in situations where it provides all the information
 * that is needed) rather than using `getStoreState()` to get the full
 * `LinkedContentLoadingState` avoids re-renders when irrelevant parts
 * of the loading-state change (e.g., the `interactionState` for
 * script-by-script lessons).
 * */
export function useLinkedContentLoadingStateSummary() {
  return useStoreState(mapLCLSS, eqLCLSS);
}

export async function dereferenceLinkedDemo(
  programKind: PytchProgramKind,
  ref: LinkedDemoRef
): Promise<LinkedDemo> {
  const contentHash = ref.slug;
  const relativePath = `demos/${contentHash}`;

  const demo = await demoDescriptorFromRelativePath(relativePath, ref.slug);

  return { kind: "demo", demo };
}
