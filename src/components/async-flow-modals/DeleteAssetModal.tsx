import { useTranslation } from "react-i18next";
import { useFlowState } from "../../model";
import { GenericConfirmActionModal } from "./GenericConfirmActionModal";
import { asyncFlowModal } from "./utils";

export const DeleteAssetModal = () => {
  const { t: tAssets } = useTranslation("assets");
  const { fsmState } = useFlowState((f) => f.deleteAssetFlow);
  return asyncFlowModal(fsmState, (activeFsmState) => {
    const { displayName, operationContext } = activeFsmState.runState;
    const { scope, assetKind } = operationContext;
    const t = (keyNub: string) =>
      tAssets(`delete.${scope}.${assetKind}.${keyNub}`, {
        replace: { displayName },
      });

    return (
      <GenericConfirmActionModal
        activeFsmState={activeFsmState}
        headerContent={<p>{t("title")}</p>}
        bodyContent={<p>{t("body")}</p>}
      />
    );
  });
};
