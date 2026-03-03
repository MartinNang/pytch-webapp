import { Action } from "easy-peasy";
import { simpleReadArrayBuffer } from "../../utils";
import { addAssetToProject } from "../../database/indexed-db";
import { IPytchAppModel, PytchAppModelActions } from "..";
import { AssetOperationContext } from "../asset";
import {
  AsyncUserFlowSlice,
  asyncUserFlowSlice,
  AttemptOutcome,
  setRunStateProp,
} from "./async-user-flow";
import { ProjectId } from "../project-core";
import { NavigationAbandonmentGuard } from "../../navigation-abandonment-guard";
import { AssetSourceKind } from "../junior/structured-program/asset";
import { mkRawSpec, RawOrI18nStringSpec } from "../i18n/core-types";

export function addAssetErrorSpecFromError(
  operationContext: AssetOperationContext,
  fileBasename: string,
  error: Error
): RawOrI18nStringSpec {
  if (error.name === "PytchDuplicateAssetNameError") {
    const { scope, assetKind } = operationContext;
    const keyPart = `add.${scope}.${assetKind}.dup-error`;
    return {
      kind: "i18n",
      spec: { ns: "assets", keyPart, params: { fileBasename } },
    };
  } else {
    return mkRawSpec(error.message);
  }
}

type AddAssetsRunArgs = {
  projectId: ProjectId;
  operationContext: AssetOperationContext;
  assetNamePrefix: string;
};

type AddAssetsRunState = {
  projectId: ProjectId;
  operationContext: AssetOperationContext;
  assetNamePrefix: string;
  chosenFiles: FileList | null;
};

export type AddAssetSuccess = { displayName: string };

export type AddAssetFailure = {
  displayName: string;
  reason: RawOrI18nStringSpec;
};

export type AddAssetsOutcomeNub = {
  sourceKind: AssetSourceKind;
  successes: Array<AddAssetSuccess>;
  failures: Array<AddAssetFailure>;
};

type AddAssetsBase = AsyncUserFlowSlice<
  IPytchAppModel,
  AddAssetsRunArgs,
  AddAssetsRunState,
  AddAssetsOutcomeNub
>;

type SAction<ArgT> = Action<AddAssetsBase, ArgT>;

type AddAssetsActions = {
  setChosenFiles: SAction<FileList>;
};

export type AddAssetsFlow = AddAssetsBase & AddAssetsActions;

async function prepare(args: AddAssetsRunArgs): Promise<AddAssetsRunState> {
  return {
    projectId: args.projectId,
    operationContext: args.operationContext,
    assetNamePrefix: args.assetNamePrefix,
    chosenFiles: null,
  };
}

function isSubmittable(runState: AddAssetsRunState) {
  return runState.chosenFiles != null && runState.chosenFiles.length > 0;
}

async function attempt(
  runState: AddAssetsRunState,
  actions: PytchAppModelActions,
  navigationGuard: NavigationAbandonmentGuard
): Promise<AttemptOutcome<AddAssetsOutcomeNub>> {
  const { projectId, assetNamePrefix, operationContext } = runState;
  let successes: Array<AddAssetSuccess> = [];
  let failures: Array<AddAssetFailure> = [];

  for (const file of runState.chosenFiles ?? []) {
    try {
      const fileBuffer = await simpleReadArrayBuffer(file);
      const assetPath = `${assetNamePrefix}${file.name}`;
      await navigationGuard.throwIfAbandoned(
        addAssetToProject(projectId, assetPath, file.type, fileBuffer)
      );
      successes.push({ displayName: file.name });
    } catch (error) {
      console.error("add-assets::attempt():", error);

      if (navigationGuard.wasAbandoned(error)) {
        throw error;
      }

      const reason = addAssetErrorSpecFromError(
        operationContext,
        file.name,
        error as Error
      );
      failures.push({ displayName: file.name, reason });
    }
  }

  await navigationGuard.throwIfAbandoned(
    actions.activeProject.syncAssetsFromStorage()
  );

  return {
    needsModalNotification: failures.length > 0,
    nub: { sourceKind: "this-device", successes, failures },
  };
}

export function onAddAssetsCompleted<
  RunStateT extends Pick<AddAssetsRunState, "operationContext">,
>(
  runState: RunStateT,
  outcomeNub: AddAssetsOutcomeNub,
  storeActions: PytchAppModelActions
) {
  if (outcomeNub.successes.length > 0) {
    const operationContext = runState.operationContext;
    storeActions.activeProject.pulseNotableChange({
      kind: "assets-added",
      operationContext,
      ...outcomeNub,
    });
  }
}

export let addAssetsFlow: AddAssetsFlow = (() => {
  const specificSlice: AddAssetsActions = {
    setChosenFiles: setRunStateProp("chosenFiles"),
  };
  return asyncUserFlowSlice(specificSlice, {
    prepare,
    isSubmittable,
    attempt,
    onCompleted: onAddAssetsCompleted,
  });
})();
