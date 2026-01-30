import { assertNever } from "../../utils";
import { AssetOperationContext } from "../asset";
import { NotableChangeDescription } from "../notable-changes";
import { AddAssetsOutcomeNub } from "../user-interactions/add-assets";
import {
  ActorKind,
  ActorOps,
  AssetMetaDataOps,
  EventDescriptorKind,
  EventDescriptorKindOps,
  Uuid,
} from "./structured-program";
import {
  HandlerUpsertionActionKind,
  SpriteUpsertionActionKind,
} from "./structured-program/program";
import { I18nStringSpec } from "../i18n/core-types";

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
  kind: "asset-changed";
  assetChangedKind: "update-transform" | "update" | "delete";
  operationContext: AssetOperationContext;
  assetDisplayName: string;
};

export function assetChangedDescription(
  change: AssetChanged
): NotableChangeDescription {
  const assetSingular = change.operationContext.assetSingularTitle;

  switch (change.assetChangedKind) {
    case "update-transform": {
      return {
        header: `${assetSingular} crop/scale updated`,
        body:
          `Crop/scale for ${assetSingular.toLowerCase()}` +
          ` "${change.assetDisplayName}" updated` +
          ` in ${change.operationContext.scope}`,
      };
    }
    case "update": {
      return {
        header: `${assetSingular} renamed`,
        body:
          `${assetSingular} renamed to "${change.assetDisplayName}"` +
          ` in ${change.operationContext.scope}`,
      };
    }
    case "delete": {
      return {
        header: `${assetSingular} deleted`,
        body:
          `${assetSingular} "${change.assetDisplayName}"` +
          ` deleted from ${change.operationContext.scope}`,
      };
    }
    default:
      return assertNever(change.assetChangedKind);
  }
}

////////////////////////////////////////////////////////////////////////

export type AssetsAdded = {
  kind: "assets-added";
  operationContext: AssetOperationContext;
} & AddAssetsOutcomeNub;

export function assetsAddedDescription(
  change: AssetsAdded
): NotableChangeDescription {
  const assetSingular = change.operationContext.assetSingularTitle;
  const assetPlural = change.operationContext.assetPlural;
  const nSuccesses = change.successes.length;
  const nFailures = change.failures.length;

  const failuresSummarySuffix =
    nFailures > 1
      ? ` (but problems with ${nFailures} other ${assetPlural})`
      : nFailures === 1
      ? ` (but problem with one other ${assetSingular.toLowerCase()})`
      : "";

  const sourceDisplayName = AssetMetaDataOps.assetSourceDisplayName(
    change.sourceKind
  );

  if (nSuccesses === 1) {
    return {
      header: `${assetSingular} added`,
      body:
        `${assetSingular} "${change.successes[0].displayName}"` +
        ` added from ${sourceDisplayName}${failuresSummarySuffix}`,
    };
  } else {
    return {
      header: `${nSuccesses} ${assetPlural} added`,
      body:
        `${nSuccesses} ${assetPlural} added` +
        ` from ${sourceDisplayName}${failuresSummarySuffix}`,
    };
  }
}

////////////////////////////////////////////////////////////////////////

export type ZipfilesUploaded = {
  kind: "zipfiles-uploaded";
  nCreated: number;
  nFailed: number;
};

export function zipfilesUploadedDescription(
  change: ZipfilesUploaded
): NotableChangeDescription {
  const nCreated = change.nCreated;
  const nFailed = change.nFailed;

  const failuresSummarySuffix =
    nFailed > 1
      ? ` (but problems with ${nFailed} other zipfiles)`
      : nFailed === 1
      ? ` (but problem with one other zipfile)`
      : "";

  if (nCreated === 1) {
    return {
      header: `Project uploaded`,
      body: `Project created from zipfile${failuresSummarySuffix}`,
    };
  } else {
    return {
      header: `${nCreated} projects uploaded`,
      body:
        `${nCreated} projects created` +
        ` from zipfiles${failuresSummarySuffix}`,
    };
  }
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
): NotableChangeDescription {
  // This has to be very uninformative, sorry; see comment attached
  // to type definition for `ProjectDownloadActionCompleted`.
  return {
    header: "Download action completed",
    body: "Project download action completed",
  };
}

////////////////////////////////////////////////////////////////////////

export type ProjectsDeleted = {
  kind: "projects-deleted";
  nDeleted: number;
};

export function projectsDeletedDescription(
  change: ProjectsDeleted
): NotableChangeDescription {
  const nDeleted = change.nDeleted;
  const noun = nDeleted === 1 ? "Project" : "Projects";
  const nounPhrase = nDeleted === 1 ? "Project" : `${nDeleted} projects`;

  return {
    header: `${noun} deleted`,
    body: `${nounPhrase} deleted from My Projects`,
  };
}

////////////////////////////////////////////////////////////////////////

// TODO: Might be useful to include the old and new names?
export type ProjectRenamed = {
  kind: "project-renamed";
};

export function projectRenamedDescription(
  _change: ProjectRenamed
): NotableChangeDescription {
  return {
    header: "Project renamed",
    body: "Project renamed",
  };
}
