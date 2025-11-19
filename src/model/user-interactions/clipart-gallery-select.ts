import { Action } from "easy-peasy";
import { IPytchAppModel, PytchAppModelActions } from "..";
import { ClipArtGalleryEntryId } from "../clipart-gallery-core";
import { ProjectId } from "../project-core";
import { addRemoteAssetToProject } from "../../database/indexed-db";
import {
  AssetOperationContext,
  assetOperationContextFromKey,
  AssetOperationContextKey,
} from "../asset";
import {
  addAssetErrorMessageFromError,
  AddAssetSuccess,
  AddAssetFailure,
  AddAssetsOutcomeNub,
  onAddAssetsCompleted,
} from "./add-assets";
import {
  asyncUserFlowSlice,
  AsyncUserFlowSlice,
  AttemptOutcome,
  runStateAction,
  setRunStateProp,
} from "./async-user-flow";
import { NavigationAbandonmentGuard } from "../../navigation-abandonment-guard";

type AddClipArtRunArgs = {
  projectId: ProjectId;
  operationContextKey: AssetOperationContextKey;
  assetNamePrefix: string;
  filterTag: string | null;
};

export type AddClipArtFilterState =
  | { kind: "always-all" }
  | { kind: "switchable"; tag: string; active: boolean };

export type AddClipArtRunState = {
  projectId: ProjectId;
  operationContext: AssetOperationContext;
  assetNamePrefix: string;
  filterState: AddClipArtFilterState;
  selectedIds: Array<ClipArtGalleryEntryId>;
};

type AddClipArtBase = AsyncUserFlowSlice<
  IPytchAppModel,
  AddClipArtRunArgs,
  AddClipArtRunState,
  AddAssetsOutcomeNub
>;

type SAction<ArgT> = Action<AddClipArtBase, ArgT>;

type AddClipArtActions = {
  selectItemById: SAction<ClipArtGalleryEntryId>;
  deselectItemById: SAction<ClipArtGalleryEntryId>;
  setFilterActive: SAction<boolean>;
};

export type AddClipArtFlow = AddClipArtBase & AddClipArtActions;

async function prepare(args: AddClipArtRunArgs): Promise<AddClipArtRunState> {
  const operationContext = assetOperationContextFromKey(
    args.operationContextKey
  );
  return {
    projectId: args.projectId,
    operationContext,
    assetNamePrefix: args.assetNamePrefix,
    filterTag: args.filterTag, // TODO: Preserve one run to next?
    filterActive: args.filterTag != null,
    selectedIds: [],
  };
}

function isSubmittable(runState: AddClipArtRunState) {
  return runState.selectedIds.length > 0;
}

async function attempt(
  runState: AddClipArtRunState,
  actions: PytchAppModelActions,
  navGuard: NavigationAbandonmentGuard
): Promise<AttemptOutcome<AddAssetsOutcomeNub>> {
  let successes: Array<AddAssetSuccess> = [];
  let failures: Array<AddAssetFailure> = [];

  const entries = actions.clipArtGallery.selectedEntries(runState.selectedIds);

  // Iterate over items of entries in one nested loop, so we can gather
  // the successes and failures without unduly complicated control flow
  // to handle navigation-abandoned (and other) exceptions.
  for (const entry of entries) {
    for (const item of entry.items) {
      const fullName = `${runState.assetNamePrefix}${item.name}`;
      try {
        await navGuard.throwIfAbandoned(
          addRemoteAssetToProject(runState.projectId, item.url, fullName)
        );
        successes.push({ displayName: item.name });
      } catch (error) {
        if (navGuard.wasAbandoned(error)) {
          throw error;
        }

        const reason = addAssetErrorMessageFromError(
          runState.operationContext,
          item.name,
          error as Error
        );

        failures.push({ displayName: item.name, reason });
      }
    }
  }

  await navGuard.throwIfAbandoned(
    actions.activeProject.syncAssetsFromStorage()
  );

  return {
    needsModalNotification: failures.length > 0,
    nub: { sourceKind: "media-library", successes, failures },
  };
}

export let addClipArtFlow: AddClipArtFlow = (() => {
  const specificSlice: AddClipArtActions = {
    setFilterActive: setRunStateProp("filterActive"),
    selectItemById: runStateAction((state, itemId) => {
      if (state.selectedIds.indexOf(itemId) === -1)
        state.selectedIds.push(itemId);
    }),
    deselectItemById: runStateAction((state, itemId) => {
      const index = state.selectedIds.indexOf(itemId);
      if (index !== -1) state.selectedIds.splice(index, 1);
    }),
  };
  return asyncUserFlowSlice(specificSlice, {
    prepare,
    isSubmittable,
    attempt,
    onCompleted: onAddAssetsCompleted,
  });
})();

export function initialFilterStateFromFilterTag(
  filterTag: string | null
): AddClipArtFilterState {
  return filterTag == null
    ? { kind: "always-all" }
    : { kind: "switchable", tag: filterTag, active: true };
}
