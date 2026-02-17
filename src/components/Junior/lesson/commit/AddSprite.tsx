import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { LearnerTaskCommitAddSprite } from "../../../../model/junior/jr-tutorial";
import { InlineAddSomethingButton } from "../../AddSomethingButton";

export const AddSprite: React.FC<LearnerTaskCommitAddSprite> = ({ name }) => {
  const { t } = useTranslation("tutorials");
  const { t: tIde } = useTranslation("ide");

  return (
    <div className="JrCommit Commit-NewSprite">
      <p>
        <Trans
          ns="tutorials"
          i18nKey="commit.add-sprite.click-add-button"
          components={{
            i: <i />,
            addButton: (
              <InlineAddSomethingButton
                what="sprite"
                label={tIde("actor-action.add")}
              />
            ),
          }}
        />
      </p>
      <p>
        <Trans
          ns="tutorials"
          i18nKey="commit.add-sprite.type-name"
          values={{ name }}
        />
      </p>
      <p>{t("commit.add-sprite.click-ok")}</p>
    </div>
  );
};
