import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { CompoundTextInput } from "../CompoundTextInput";
import {
  flowFocusOrBlurFun,
  isInteractable,
  settleFunctions,
} from "../../model/user-interactions/async-user-flow";
import { asyncFlowModal } from "./utils";
import { useFlowActions, useFlowState } from "../../model";

export const DownloadZipfileModal = () => {
  const { t } = useTranslation("projects");
  const { t: tCommon } = useTranslation("common");
  const { fsmState, isSubmittable } = useFlowState(
    (f) => f.downloadZipfileFlow
  );
  const { setUiFragmentValue } = useFlowActions((f) => f.downloadZipfileFlow);

  const inputRef = React.useRef<HTMLInputElement>(null);
  useEffect(flowFocusOrBlurFun(inputRef, fsmState));

  return asyncFlowModal(fsmState, (activeFsmState) => {
    const { formatSpecifier } = activeFsmState.runState;
    const settle = settleFunctions(isSubmittable, activeFsmState);

    return (
      <Modal
        className="DownloadZipfile"
        show={true}
        onHide={settle.cancel}
        animation={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>{t("download-zipfile.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="icon-container">
            <FontAwesomeIcon className="fa-4x" icon="file-archive" />
          </div>

          <CompoundTextInput
            formatSpecifier={formatSpecifier}
            onNewUiFragmentValue={setUiFragmentValue}
            onEnterKey={settle.submit}
            ref={inputRef}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={!isInteractable(activeFsmState)}
            variant="secondary"
            onClick={settle.cancel}
          >
            {tCommon("button.cancel")}
          </Button>
          <Button
            disabled={!isSubmittable}
            variant="primary"
            onClick={settle.submit}
          >
            {t("download-zipfile.button.download")}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  });
};
