import React from "react";
import { asyncFlowModal } from "./utils";
import { useFlowActions, useFlowState } from "../../model";
import { ChooseFiles } from "../ChooseFiles";
import { settleFunctions } from "../../model/user-interactions/async-user-flow";
import { assertNever } from "../../utils";
import { AssetOperationContextOps } from "../../model/asset/core";
import { useTranslation } from "react-i18next";
import { AddAssetFailuresList } from "./AddAssetFailuresList";

export const AddAssetsModal = () => {
  const { t } = useTranslation("assets");

  const { fsmState, isSubmittable } = useFlowState((f) => f.addAssetsFlow);
  const setChosenFiles = useFlowActions((f) => f.addAssetsFlow.setChosenFiles);

  return asyncFlowModal(fsmState, (activeState) => {
    const { operationContext, chosenFiles } = activeState.runState;
    const { scope, assetKind } = operationContext;

    switch (activeState.kind) {
      case "awaiting-ack-of-notification": {
        return (
          <AddAssetFailuresList
            assetKind={assetKind}
            failures={activeState.outcomeNub.failures}
            dismiss={activeState.userAck}
          />
        );
      }

      case "interacting":
      case "attempting": {
        const keyStem = `add.${assetKind}`;
        const settle = settleFunctions(isSubmittable, activeState);

        const titleText = t(`${keyStem}.interacting.title`);
        const introText = t(`${keyStem}.interacting.intro`);
        const buttonText = t(`add.this-device.${scope}.interacting.button`);

        return (
          <ChooseFiles
            titleText={titleText}
            introText={introText}
            fileAccept={AssetOperationContextOps.fileAccept(operationContext)}
            actionButtonText={buttonText}
            status={activeState.kind}
            chosenFiles={chosenFiles}
            setChosenFiles={setChosenFiles}
            tryProcess={settle.submit}
            dismiss={settle.cancel}
          />
        );
      }
      default:
        return assertNever(activeState);
    }
  });
};
