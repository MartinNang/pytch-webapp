import { AssetOperationContext } from "../asset";
import { AddAssetsOutcomeNub } from "../user-interactions/add-assets";
import { ActorKind, EventDescriptorKind, Uuid } from "./structured-program";
import {
  HandlerUpsertionActionKind,
  SpriteUpsertionActionKind,
} from "./structured-program/program";
import { I18nStringSpec, kEmptySpec } from "../i18n/core-types";

export type NotableChangeSummarySpec = {
  header: I18nStringSpec;
  bodyParts: I18nStringSpec[];
};

////////////////////////////////////////////////////////////////////////

type PerMethodScriptChangedKind =
  | HandlerUpsertionActionKind
  | "duplicate"
  | "delete";

export type PerMethodScriptChanged = {
  kind: "script-changed";
  scriptChangedKind: PerMethodScriptChangedKind;
  handlerId: Uuid;
  handlerEventKind: EventDescriptorKind;
  actorKind: ActorKind;
  actorName: string;
};

export function perMethodScriptChangedDescription(
  change: PerMethodScriptChanged
): NotableChangeSummarySpec {
  const eventKind = {
    ns: "vm",
    key: `event-kind.${change.actorKind}.${change.handlerEventKind}`,
  };

  const header: I18nStringSpec = {
    keyPart: change.scriptChangedKind,
  };

  const body: I18nStringSpec = {
    keyPart: `${change.actorKind}.${change.scriptChangedKind}`,
    params: { actorName: change.actorName },
    indirectParams: { eventKind },
  };

  return { header, bodyParts: [body] };
}

////////////////////////////////////////////////////////////////////////

type PerMethodSpriteChangedKind = SpriteUpsertionActionKind | "delete";

export type PerMethodSpriteChanged = {
  kind: "sprite-changed";
  spriteChangedKind: PerMethodSpriteChangedKind;
  /** The `spriteName` is the *new* name, if this is a rename event. */
  spriteName: string;
};

export function perMethodSpriteChangedDescription(
  change: PerMethodSpriteChanged
): NotableChangeSummarySpec {
  const spec: I18nStringSpec = {
    keyPart: change.spriteChangedKind,
    params: { spriteName: change.spriteName },
  };
  return { header: spec, bodyParts: [spec] };
}

////////////////////////////////////////////////////////////////////////

export type AssetChanged = {
  // TODO: Would be useful to have actorName here (where applicable,
  // i.e., when not "flat").
  kind: "asset-changed";
  assetChangedKind: "update-transform" | "update" | "delete";
  operationContext: AssetOperationContext;
  assetDisplayName: string;
};

export function assetChangedDescription(
  change: AssetChanged
): NotableChangeSummarySpec {
  const assetKind = change.operationContext.assetKind;
  const scope = change.operationContext.scope;

  const header: I18nStringSpec = {
    keyPart: `${assetKind}.${change.assetChangedKind}`,
  };

  const body: I18nStringSpec = {
    keyPart: `${scope}.${assetKind}.${change.assetChangedKind}`,
    params: { assetDisplayName: change.assetDisplayName },
  };

  return { header, bodyParts: [body] };
}

////////////////////////////////////////////////////////////////////////

export type AssetsAdded = {
  kind: "assets-added";
  operationContext: AssetOperationContext;
} & AddAssetsOutcomeNub;

export function assetsAddedDescription(
  change: AssetsAdded
): NotableChangeSummarySpec {
  const assetKind = change.operationContext.assetKind;

  const nSuccesses = change.successes.length;
  const nFailures = change.failures.length;

  const header: I18nStringSpec =
    nSuccesses === 0
      ? { keyPart: `${assetKind}.only-failure`, params: { count: nFailures } }
      : { keyPart: `${assetKind}.some-success`, params: { count: nSuccesses } };

  const bodyKeyPrefix = `${assetKind}.${change.sourceKind}`;
  let bodyParts: I18nStringSpec[] = [];

  if (nSuccesses > 0) {
    bodyParts.push({
      keyPart: `${bodyKeyPrefix}.success`,
      params: {
        count: nSuccesses,
        firstSuccessDisplayName: change.successes[0].displayName,
      },
    });
  }

  if (nFailures > 0) {
    bodyParts.push({
      keyPart: `${bodyKeyPrefix}.failure`,
      params: { count: nFailures },
    });
  }

  return { header, bodyParts };
}

////////////////////////////////////////////////////////////////////////

export type ZipfilesUploaded = {
  kind: "zipfiles-uploaded";
  nCreated: number;
  nFailed: number;
};

export function zipfilesUploadedDescription(
  change: ZipfilesUploaded
): NotableChangeSummarySpec {
  const nCreated = change.nCreated;
  const nFailed = change.nFailed;

  const header: I18nStringSpec =
    nCreated === 0
      ? { keyPart: "only-failure", params: { count: nFailed } }
      : { keyPart: "some-success", params: { count: nCreated } };

  let bodyParts: I18nStringSpec[] = [];

  if (nCreated > 0) {
    bodyParts.push({ keyPart: "success", params: { count: nCreated } });
  }

  if (nFailed > 0) {
    bodyParts.push({ keyPart: "failure", params: { count: nFailed } });
  }

  return { header, bodyParts };
}

////////////////////////////////////////////////////////////////////////

// No more information available, because the user can change the name
// of the downloaded file (or cancel the download altogether) after
// specifying it in our modal, and we have no way of knowing what
// happened.
export type ProjectDownloadActionCompleted = {
  kind: "project-download-action-completed";
};

export function projectDownloadActionCompletedDescription(
  _change: ProjectDownloadActionCompleted
): NotableChangeSummarySpec {
  return { header: kEmptySpec, bodyParts: [kEmptySpec] };
}

////////////////////////////////////////////////////////////////////////

export type ProjectsDeleted = {
  kind: "projects-deleted";
  nDeleted: number;
};

export function projectsDeletedDescription(
  change: ProjectsDeleted
): NotableChangeSummarySpec {
  const spec: I18nStringSpec = {
    keyPart: null,
    params: { count: change.nDeleted },
  };
  return { header: spec, bodyParts: [spec] };
}

////////////////////////////////////////////////////////////////////////

// TODO: Might be useful to include the old and new names?
export type ProjectRenamed = {
  kind: "project-renamed";
};

export function projectRenamedDescription(
  _change: ProjectRenamed
): NotableChangeSummarySpec {
  return { header: kEmptySpec, bodyParts: [kEmptySpec] };
}
