import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { LearnerTaskCommitDeleteAppearance } from "../../../../model/junior/jr-tutorial";
import { DisplayDropdownButton } from "../../DisplayDropdownButton";

export const DeleteAppearance: React.FC<LearnerTaskCommitDeleteAppearance> = ({
  actor,
  appearanceFilename,
}) => {
  const { t } = useTranslation("tutorials");
  const { t: tIde } = useTranslation("ide");

  const actorKind = actor.kind;
  const appearancesTabTitle = tIde(
    `per-method.tab-title.actor-properties.appearances.${actorKind}`
  );

  const spriteName = actorKind === "sprite" ? actor.name : undefined;

  return (
    <div className="JrCommit Commit-DeleteAppearance">
      <p>
        <Trans
          ns="tutorials"
          i18nKey={`commit.delete-appearance.select-actor.${actorKind}`}
          values={{ spriteName }}
        />
      </p>
      <p>
        {t("commit.delete-appearance.select-tab", {
          replace: { appearancesTabTitle },
        })}
      </p>
      <p>
        <Trans
          ns="tutorials"
          i18nKey={`commit.delete-appearance.find-and-click.${actorKind}`}
          values={{ appearanceFilename }}
          components={{ dropdownButton: <DisplayDropdownButton /> }}
        />
      </p>
      <p>
        <Trans
          ns="tutorials"
          i18nKey={`commit.delete-appearance.confirm.${actorKind}`}
        />
      </p>
    </div>
  );
};
