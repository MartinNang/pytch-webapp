import React from "react";
import { useTranslation } from "react-i18next";
import { LearnerTaskCommitEditScript } from "../../../../model/junior/jr-tutorial";
import { ScriptDiff } from "./ScriptDiff";

export const EditScript: React.FC<LearnerTaskCommitEditScript> = ({
  path,
  event,
  newCodeText,
  oldCodeText,
}) => {
  const { t } = useTranslation("tutorials");

  const actor = path.actor;
  const actorKind = actor.kind;
  const spriteName = actorKind === "sprite" ? actor.name : undefined;

  return (
    <div className="JrCommit Commit-AddScriptBody">
      <p>
        {t(`commit.edit-script.select-and-find.${actorKind}`, {
          replace: { spriteName },
        })}
      </p>
      <ScriptDiff {...{ actorKind, event, oldCodeText, newCodeText }} />
      <p>{t("commit.edit-script.use-tabs")}</p>
    </div>
  );
};
