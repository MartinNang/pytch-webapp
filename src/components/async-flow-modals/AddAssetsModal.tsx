import React from "react";
import { asyncFlowModal } from "./utils";
import { useFlowActions, useFlowState } from "../../model";
import { ChooseFiles } from "../ChooseFiles";
import { FileProcessingFailures } from "../FileProcessingFailures";
import { settleFunctions } from "../../model/user-interactions/async-user-flow";
import { assertNever } from "../../utils";
import { FileProcessingFailure } from "../../model/user-interactions/process-files";
import { AssetOperationContextOps } from "../../model/asset/core";
import { AddAssetFailuresList } from "./AddAssetFailuresList";

export const AddAssetsModal = () => {
  const { fsmState, isSubmittable } = useFlowState((f) => f.addAssetsFlow);
  const setChosenFiles = useFlowActions((f) => f.addAssetsFlow.setChosenFiles);

  return asyncFlowModal(fsmState, (activeState) => {
    const { operationContext, chosenFiles } = activeState.runState;
    const assetPlural = "THINGS"; // I18N-TODO

    switch (activeState.kind) {
      case "awaiting-ack-of-notification": {
        return (
          <AddAssetFailuresList
            assetKind={operationContext.assetKind}
            failures={activeState.outcomeNub.failures}
            dismiss={activeState.userAck}
          />
        );
      }

      case "interacting":
      case "attempting": {
        const settle = settleFunctions(isSubmittable, activeState);
        return (
          <ChooseFiles
            titleText={`Add ${assetPlural}`}
            introText={`Choose ${assetPlural} to add to your project.`}
            fileAccept={AssetOperationContextOps.fileAccept(operationContext)}
            actionButtonText="Add to project"
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
