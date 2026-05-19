import { useTranslation } from "react-i18next";
import { useFlowState } from "../../model";
import { GenericConfirmActionModal } from "./GenericConfirmActionModal";
import { asyncFlowModal } from "./utils";
import { assetOperationContextKey } from "../../model/asset/core";

export const DeleteAssetModal = () => {
  const { t: tAssets } = useTranslation("assets");
  const { fsmState } = useFlowState((f) => f.deleteAssetFlow);
  return asyncFlowModal(fsmState, (activeFsmState) => {
    const { displayName, operationContext } = activeFsmState.runState;
    const keyNub = assetOperationContextKey(operationContext);
    const t = (keySuffix: "title" | "body") => {
      const i18nKey = `delete.${keyNub}.${keySuffix}` as const;
      return tAssets(i18nKey, { replace: { displayName } });
    };

    return (
      <GenericConfirmActionModal
        activeFsmState={activeFsmState}
        headerContent={<p>{t("title")}</p>}
        bodyContent={<p>{t("body")}</p>}
      />
    );
  });
};
