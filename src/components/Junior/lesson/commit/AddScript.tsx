import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { LearnerTaskCommitAddScript } from "../../../../model/junior/jr-tutorial";
import { DisplayHatBlock } from "../../HatBlock";
import { InlineAddSomethingButton } from "../../AddSomethingButton";
import { DisplayScript } from "./ScriptDiff";
import { EventDescriptorKindOps } from "../../../../model/junior/structured-program";

export const AddScript: React.FC<LearnerTaskCommitAddScript> = ({
  path,
  event,
  codeText,
}) => {
  const { t } = useTranslation("tutorials");
  const { t: tIde } = useTranslation("ide");

  const actor = path.actor;
  const actorKind = actor.kind;

  const hasArgument = EventDescriptorKindOps.arity(event.kind) === 1;
  const maybeProvideArgumentContent = hasArgument && (
    <>
      <p>{t(`commit.add-script.fill-in-argument.${event.kind}`)}</p>
      <DisplayHatBlock
        actorKind={actorKind}
        event={event}
        variant="fully-specified"
      />
    </>
  );

  const maybeAddCodeContent = codeText !== "" && (
    <>
      <p>{t("commit.add-script.type-code")}</p>
      <DisplayScript {...{ actorKind, event, codeText }} />
    </>
  );

  const spriteName = actorKind === "sprite" ? actor.name : undefined;
  return (
    <div className="JrCommit Commit-AddScript">
      <p>
        <Trans
          ns="tutorials"
          i18nKey={`commit.add-script.select-and-add.${actorKind}`}
          values={{ spriteName }}
          components={{
            addButton: (
              <InlineAddSomethingButton
                what="script"
                label={tIde("scripts.action.add")}
              />
            ),
          }}
        />
      </p>

      <p>{t("commit.add-script.choose-hat-block")}</p>

      <DisplayHatBlock
        actorKind={actorKind}
        event={event}
        variant="kind-chosen"
      />

      {maybeProvideArgumentContent}

      <p>{t("commit.add-script.click-ok")}</p>

      {maybeAddCodeContent}
    </div>
  );
};
