import { Trans, useTranslation } from "react-i18next";
import { useFlowState } from "../../model";
import { GenericConfirmActionModal } from "./GenericConfirmActionModal";
import { asyncFlowModal } from "./utils";

export const DeleteProjectModal = () => {
  const { t } = useTranslation("projects");
  const { fsmState } = useFlowState((f) => f.deleteProjectFlow);
  return asyncFlowModal(fsmState, (activeFsmState) => {
    const { name } = activeFsmState.runState;
    return (
      <GenericConfirmActionModal
        activeFsmState={activeFsmState}
        headerContent={<p>{t("delete.title")}</p>}
        bodyContent={
          <p>
            <Trans i18nKey="delete.body" ns="projects" values={{ name }} />
          </p>
        }
      />
    );
  });
};
