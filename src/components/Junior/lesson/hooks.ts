import { useStoreState } from "../../../store";
import { LinkedJrTutorial } from "../../../model/junior/jr-tutorial";
import {
  LinkedContentKind, LinkedDemo,
  LinkedSpecimen,
} from "../../../model/linked-content";

const useHasLinkedContentOfKind = (tgtKind: LinkedContentKind): boolean =>
  useStoreState((state) => {
    const loadState = state.activeProject.linkedContentLoadingState;

    return (
      (loadState.kind === "succeeded" && loadState.content.kind === tgtKind) ||
      (loadState.kind === "failed" && loadState.contentKind === tgtKind) ||
      (loadState.kind === "pending" && loadState.contentRef.kind === tgtKind)
    );
  });

export const useHasLinkedLesson = () =>
  useHasLinkedContentOfKind("jr-tutorial");

export const useHasLinkedSpecimen = () => useHasLinkedContentOfKind("specimen");

export const useHasLinkedDemo = () =>
  useHasLinkedContentOfKind("demo");

export function useMappedLinkedJrTutorial<Result>(
  mapContent: (tutorial: LinkedJrTutorial) => Result,
  eqResult?: (prev: Result, next: Result) => boolean
) {
  return useStoreState((state) => {
    const contentState = state.activeProject.linkedContentLoadingState;

    if (contentState.kind !== "succeeded")
      throw new Error("linked lesson has not been loaded");

    if (contentState.content.kind !== "jr-tutorial")
      throw new Error("linked lesson is not suitable");

    return mapContent(contentState.content);
  }, eqResult);
}

export const useLinkedJrTutorial = (): LinkedJrTutorial =>
  useMappedLinkedJrTutorial((tutorial) => tutorial);

export function useMappedLinkedSpecimen<Result>(
  mapContent: (specimen: LinkedSpecimen) => Result,
  eqResult?: (prev: Result, next: Result) => boolean
) {
  return useStoreState((state) => {
    const contentState = state.activeProject.linkedContentLoadingState;

    if (contentState.kind !== "succeeded")
      throw new Error("linked content has not been loaded");

    if (contentState.content.kind !== "specimen")
      throw new Error("linked content is wrong kind");

    return mapContent(contentState.content);
  }, eqResult);
}

export const useLinkedSpecimen = (): LinkedSpecimen =>
  useMappedLinkedSpecimen((specimen) => specimen);

export function useMappedLinkedDemo<Result>(
  mapContent: (linkedDemo: LinkedDemo | null) => Result,
  eqResult?: (prev: Result, next: Result) => boolean
) {
  return useStoreState((state) => {
    const contentState = state.activeProject.linkedContentLoadingState;

    if (contentState.kind === "succeeded") {
      if (contentState.content.kind === "demo") {
        return mapContent(contentState.content);
      } else {
        throw new Error("linked demo is not suitable");
      }
    } else if (contentState.kind === "pending") {
      return mapContent(null);
    } else {
      throw new Error("linked demo failed to load");
    }
  }, eqResult);
}

export const useLinkedDemo = (): LinkedDemo | null =>
  useMappedLinkedDemo((demo) => demo);

// Not exactly a hook, but similar in spirit.
export function focusChapterContent() {
  const contentElts = document.getElementsByClassName("Junior-LessonContent");

  const nElts = contentElts.length;
  if (nElts !== 1) {
    console.warn(`focusChapterContent(): Found ${nElts} elts`);
  }
  if (nElts > 0) {
    const targetElement = contentElts[0] as HTMLElement;
    targetElement.focus();
  }
}
