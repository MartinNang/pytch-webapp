import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { LearnerTaskCommitAddMedialibAppearancesEntry } from "../../../../model/junior/jr-tutorial";
import { InlineAddSomethingButton } from "../../AddSomethingButton";

// TODO: Include thumbnail of required costume?

export const AddMedialibAppearancesEntry: React.FC<
  LearnerTaskCommitAddMedialibAppearancesEntry
> = ({ actor, displayIdentifier, nItems }) => {
  const { t } = useTranslation("tutorials");
  const { t: tAssets } = useTranslation("assets");

  const actorKind = actor.kind;
  const spriteName = actor.kind === "sprite" ? actor.name : undefined;

  const addButtonComponent = (
    <InlineAddSomethingButton
      what={`${actorKind}-asset`}
      label={tAssets("add-button.media-library")}
    />
  );

  return (
    <div className="JrCommit Commit-AddMedialibAppearancesEntry">
      <p>
        <Trans
          ns="tutorials"
          i18nKey={`commit.add-medialib-appearances-entry.select-actor.${actorKind}`}
          values={{ spriteName }}
        />
      </p>
      <p>
        {t(`commit.add-medialib-appearances-entry.select-tab.${actorKind}`)}
      </p>
      <p>
        <Trans
          ns="tutorials"
          i18nKey="commit.add-medialib-appearances-entry.click-add-button"
          components={{ addButton: addButtonComponent }}
        />
      </p>
      <p>
        {t("commit.add-medialib-appearances-entry.find-and-click", {
          count: nItems,
          replace: { nItems, displayIdentifier },
        })}
      </p>
    </div>
  );
};
