import {assertNever, fetchArrayBuffer} from "../utils";
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
  // LinkedDemoRef,
  SpecimenContentHash, DemoContentHash, LinkedDemoRef, kLinkedContentRefNone,
} from "./linked-content-core";
import {PytchProgramKind, PytchProgramOps} from "./pytch-program";
import { LinkedContentLoadingState } from "./project";
import demos from "../data/demos.json";

export type LessonDescriptor = {
  specimenContentHash: SpecimenContentHash;
  project: StandaloneProjectDescriptor;
};

export type DemoDescriptor = {
  demoContentHash: DemoContentHash;
  chapters?: string;
  project: StandaloneProjectDescriptor;
};

type LinkedNoContent = { kind: "none" };

const kLinkedNoContent: LinkedNoContent = { kind: "none" };

export type LinkedSpecimen = { kind: "specimen"; lesson: LessonDescriptor };

export type LinkedDemo = { kind: "demo"; demo:  DemoDescriptor};

export type LinkedContent = LinkedNoContent | LinkedJrTutorial | LinkedSpecimen | LinkedDemo;

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

// const demoUrl = (relativeUrl: string) => {
//   // const baseUrl = envVarOrFail("VITE_DEMO_BASE");
//   // return [baseUrl, relativeUrl].join("/");
// };

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


async function fetchDemoChaptersFromMd(url: string): Promise<string | undefined> {
  fetch(url)
      .then(r => r.text())
      .then(text => {
        console.log('text decoded:', text);
        return text;
      });
  return undefined;
}

export async function findDemo(slug: string) {
  return demos.find((d) => d.slug === slug);
}

async function demoDescriptorFromRelativePath(relativePath: string, slug: string): Promise<DemoDescriptor> {
  console.log('relative path', relativePath);
  // const url = demoUrl(`${relativePath}.md`);
  const mdUrl = `../assets/demos/${slug}/${slug}.md`;

  const chapters = await fetchDemoChaptersFromMd(mdUrl);
  const demo = await findDemo(slug);

  const codeJson = await fetch(`${relativePath}/${slug}.json`);
  const codeString = await codeJson.text();

  const program = PytchProgramOps.fromJson(codeString);
  console.log('program', program);

  // const assetsZip = failIfNull(
  //     zip.folder("assets"),
  //     `could not enter folder "assets" of zipfile`
  // );
  //
  // let assetPromises: Array<Promise<RawAssetDescriptor>> = [];
  // assetsZip.forEach((path, zipObj) =>
  //     assetPromises.push(_zipAsset(path, zipObj))
  // );

  // const rawAssets = await Promise.all(assetPromises);

  // TODO import all assets from assets folder

  // const assets: Array<TransformedAssetDescriptor> = rawAssets.map((a) => ({
  //   ...a,
  //   transform: AssetTransformOps.newNoop(a.mimeType),
  // }));

  let project =
    {
      name: demo?.displayName || "",
      summary: demo?.summaryMarkdown || "",
      program: program,
      assets: [],
      linkedContentRef: kLinkedContentRefNone,
    };

  return { demoContentHash: slug, chapters: chapters, project: project };
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
  // const contentHash = ref.specimenContentHash;
  // const relativePath = `_by_content_hash_/${contentHash}`;
  // const lesson = await lessonDescriptorFromRelativePath(relativePath);
  const contentHash = ref.slug;
  const relativePath = `../src/assets/demos/${contentHash}`;

  const demo = await demoDescriptorFromRelativePath(relativePath, ref.slug);
  // const specimenKind = lesson.project.program.kind;
  // if (specimenKind !== programKind) {
  //   throw new Error(
  //       `project is "${programKind}" but specimen is "${specimenKind}"`
  //   );
  // }

  return { kind: "demo", demo };
}

