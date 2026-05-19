import { Action } from "easy-peasy";
import { IPytchAppModel, PytchAppModelActions } from "..";

import { AssetOperationContext } from "../asset";
import {
  asyncUserFlowSlice,
  AsyncUserFlowSlice,
  AttemptOutcome,
  setRunStateProp,
} from "./async-user-flow";
import { NavigationAbandonmentGuard } from "../../navigation-abandonment-guard";
import { mkRawSpec, RawOrI18nStringSpec } from "../i18n/core-types";

type RenameAssetRunArgs = {
  operationContext: AssetOperationContext;
  fixedPrefix: string;
  oldNameSuffix: string;
};

type RenameAssetRunState = {
  operationContext: AssetOperationContext;
  fixedPrefix: string;
  oldStem: string;
  newStem: string;
  fixedSuffix: string;
};

function renameAssetErrorSpecFromError(
  runState: RenameAssetRunState,
  error: Error
): RawOrI18nStringSpec {
  if (error.name === "PytchDuplicateAssetNameError") {
    const { scope, assetKind } = runState.operationContext;
    const keyPart = `rename.${scope}.${assetKind}.dup-error`;
    const oldBasename = `${runState.oldStem}${runState.fixedSuffix}`;
    const newBasename = `${runState.newStem}${runState.fixedSuffix}`;
    return {
      kind: "i18n",
      spec: { ns: "assets", keyPart, params: { oldBasename, newBasename } },
    };
  } else {
    return mkRawSpec(error.message);
  }
}

export type RenameAssetOutcomeNub =
  | { kind: "success" }
  | { kind: "error"; messageSpec: RawOrI18nStringSpec };

type RenameAssetBase = AsyncUserFlowSlice<
  IPytchAppModel,
  RenameAssetRunArgs,
  RenameAssetRunState,
  RenameAssetOutcomeNub
>;

type SAction<ArgT> = Action<RenameAssetBase, ArgT>;

type RenameAssetActions = {
  setNewStem: SAction<string>;
};

export type RenameAssetFlow = RenameAssetBase & RenameAssetActions;

type FilenameParts = { stem: string; extension: string };
const filenameParts = (name: string): FilenameParts => {
  let fragments = name.split(".");
  if (fragments.length === 1) {
    return { stem: name, extension: "" };
  }

  const bareExtension = fragments.pop();
  if (bareExtension == null) {
    // This really should not happen.
    console.warn(`empty split from "${name}"`);
    return { stem: name, extension: "" };
  }

  const stem = fragments.join(".");
  const extension = `.${bareExtension}`;
  return { stem, extension };
};

async function prepare(args: RenameAssetRunArgs): Promise<RenameAssetRunState> {
  const { stem, extension } = filenameParts(args.oldNameSuffix);
  return {
    operationContext: args.operationContext,
    fixedPrefix: args.fixedPrefix,
    oldStem: stem,
    newStem: stem,
    fixedSuffix: extension,
  };
}

function isSubmittable(runState: RenameAssetRunState): boolean {
  const newStem = runState.newStem;
  return newStem !== "" && newStem !== runState.oldStem;
}

async function attempt(
  runState: RenameAssetRunState,
  actions: PytchAppModelActions,
  navigationGuard: NavigationAbandonmentGuard
): Promise<AttemptOutcome<RenameAssetOutcomeNub>> {
  const suffix = runState.fixedSuffix;
  const oldNameSuffix = `${runState.oldStem}${suffix}`;
  const newNameSuffix = `${runState.newStem}${suffix}`;

  const renameDescriptor = {
    operationContext: runState.operationContext,
    fixedPrefix: runState.fixedPrefix,
    oldNameSuffix,
    newNameSuffix,
  };

  try {
    // The renameAssetAndSync() call includes pulsing a change, so we
    // won't need to do that separately.
    await navigationGuard.throwIfAbandoned(
      actions.activeProject.renameAssetAndSync(renameDescriptor)
    );

    return {
      needsModalNotification: false,
      nub: { kind: "success" },
    };
  } catch (error) {
    if (navigationGuard.wasAbandoned(error)) {
      throw error;
    }

    const messageSpec = renameAssetErrorSpecFromError(runState, error as Error);
    return {
      needsModalNotification: true,
      nub: { kind: "error", messageSpec },
    };
  }
}

function onCompleted(
  runState: RenameAssetRunState,
  outcomeNub: RenameAssetOutcomeNub,
  storeActions: PytchAppModelActions
) {
  if (outcomeNub.kind === "success") {
    storeActions.activeProject.pulseNotableChange({
      kind: "asset-changed",
      assetChangedKind: "update",
      operationContext: runState.operationContext,
      assetDisplayName: `${runState.newStem}${runState.fixedSuffix}`,
    });
  }
}

export let renameAssetFlow: RenameAssetFlow = (() => {
  const specificSlice: RenameAssetActions = {
    setNewStem: setRunStateProp("newStem"),
  };

  return asyncUserFlowSlice(specificSlice, {
    prepare,
    isSubmittable,
    attempt,
    onCompleted,
  });
})();
