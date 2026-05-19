import { Trans } from "react-i18next";
import { useJrEditState } from "../../Junior/hooks";
import { GenericConfirmActionModal } from "../../async-flow-modals/GenericConfirmActionModal";
import { asyncFlowModal } from "../../async-flow-modals/utils";

export const DeleteSpriteModal = () => {
  const { fsmState } = useJrEditState((a) => a.deleteSpriteFlow);
  return asyncFlowModal(fsmState, (activeFsmState) => {
    const { spriteDisplayName } = activeFsmState.runState;
    return (
      <GenericConfirmActionModal
        activeFsmState={activeFsmState}
        headerContent={
          <p>
            <Trans
              ns="flows"
              i18nKey="delete-sprite.title"
              values={{ spriteName: spriteDisplayName }}
            />
          </p>
        }
        bodyContent={
          <p>
            <Trans
              ns="flows"
              i18nKey="delete-sprite.body"
              values={{ spriteName: spriteDisplayName }}
            />
          </p>
        }
      />
    );
  });
};
