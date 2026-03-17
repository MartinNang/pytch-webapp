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
    const t = (keyNub: "title" | "body") => {
      const i18nKey = `delete.${scope}.${assetKind}.${keyNub}` as const;
      const replace = { displayName };
      return tAssets(i18nKey, { replace });
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
