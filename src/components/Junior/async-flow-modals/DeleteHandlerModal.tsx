import { useTranslation } from "react-i18next";
import { useJrEditState } from "../../Junior/hooks";
import { GenericConfirmActionModal } from "../../async-flow-modals/GenericConfirmActionModal";
import { asyncFlowModal } from "../../async-flow-modals/utils";

export const DeleteHandlerModal = () => {
  const { t } = useTranslation("flows");
  const { fsmState } = useJrEditState((s) => s.deleteHandlerFlow);
  return asyncFlowModal(fsmState, (activeFsmState) => {
    return (
      <GenericConfirmActionModal
        activeFsmState={activeFsmState}
        headerContent={<p>{t("delete-handler.title")}</p>}
        bodyContent={<p>{t("delete-handler.body")}</p>}
      />
    );
  });
};
