import React from "react";
import { useTranslation } from "react-i18next";
import { ChooseFiles } from "../ChooseFiles";
import { FileProcessingFailures } from "../FileProcessingFailures";
import { asyncFlowModal } from "./utils";
import { settleFunctions } from "../../model/user-interactions/async-user-flow";
import { useFlowActions, useFlowState } from "../../model";
import { assertNever } from "../../utils";
import { FileProcessingFailure } from "../../model/user-interactions/process-files";

export const UploadZipfilesModal = () => {
  const { t } = useTranslation("projects");
  const { fsmState, isSubmittable } = useFlowState((f) => f.uploadZipfilesFlow);
  const { setChosenFiles } = useFlowActions((f) => f.uploadZipfilesFlow);

  return asyncFlowModal(fsmState, (activeFsmState) => {
    switch (activeFsmState.kind) {
      case "awaiting-ack-of-notification": {
        const fileFailures: Array<FileProcessingFailure> =
          activeFsmState.outcomeNub.failures.map((failure) => ({
            filename: failure.filename,
            reason: failure.reason,
          }));
        return (
          <FileProcessingFailures
            titleText={t("upload-zipfiles.failure-title")}
            introText={t("upload-zipfiles.failure-intro")}
            failures={fileFailures}
            dismiss={activeFsmState.userAck}
          />
        );
      }

      case "interacting":
      case "attempting": {
        const { chosenFiles } = activeFsmState.runState;
        const settle = settleFunctions(isSubmittable, activeFsmState);
        return (
          <ChooseFiles
            titleText={t("upload-zipfiles.title")}
            introText={t("upload-zipfiles.intro")}
            actionButtonText={t("upload-zipfiles.button.upload")}
            status={activeFsmState.kind}
            chosenFiles={chosenFiles}
            setChosenFiles={setChosenFiles}
            tryProcess={settle.submit}
            dismiss={settle.cancel}
          />
        );
      }
      default:
        return assertNever(activeFsmState);
    }
  });
};
