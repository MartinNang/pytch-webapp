import { ITrackedTutorial } from "../../model/project-core";
import { useStoreState } from "../../store";

export function useMappedTrackedTutorial<Result>(
  mapTutorial: (tutorial: ITrackedTutorial) => Result,
  eqResult?: (prev: Result, next: Result) => boolean
) {
  return useStoreState((state) => {
    const project = state.activeProject.project;
    const mTrackedTutorial = project.trackedTutorial;
    if (mTrackedTutorial == null)
      throw new Error(`project ${project.id} is not tracking a tutorial`);

    return mapTutorial(mTrackedTutorial);
  }, eqResult);
}

/** Hook to provide the filter-tag for use with the media library (if
 * this project is following a tutorial, flat or per-method), or `null`
 * if no filter should be applied because the project is not following a
 * tutorial. */
export function useMediaLibFilterTag(): string | null {
  const mkTag = (slug: string) => `_tutorial/${slug}`;
  return useStoreState((state) => {
    // Try the two different ways we might be linked to a tutorial.
    // TODO: Fix this, ugh.

    // Per-method tutorial?
    const linkedContentLoadingState =
      state.activeProject.linkedContentLoadingState;
    if (linkedContentLoadingState.kind === "succeeded") {
      const linkedContent = linkedContentLoadingState.content;
      if (linkedContent.kind === "jr-tutorial") {
        return mkTag(linkedContent.content.name);
      }
    }

    // Flat tutorial?
    const mTutorial = state.activeProject.project.trackedTutorial;
    if (mTutorial != null) {
      return mkTag(mTutorial.content.slug);
    }

    return null;
  });
}
