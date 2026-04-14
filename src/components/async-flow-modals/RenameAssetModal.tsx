import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { CompoundTextInput } from "../CompoundTextInput";
import { FormatSpecifier } from "../../model/compound-text-input";
import {
  focusOrBlurElementFun,
  isInteractable,
  settleFunctions,
} from "../../model/user-interactions/async-user-flow";
import { asyncFlowModal } from "./utils";
import { useFlowActions, useFlowState } from "../../model";
import { useResolveStringSpec } from "../hooks/resolve-string-spec";

export const RenameAssetModal = () => {
  const resolveStringSpec = useResolveStringSpec();
  const { t } = useTranslation("assets");
  const { t: tCommon } = useTranslation("common");
  const { fsmState, isSubmittable } = useFlowState((f) => f.renameAssetFlow);
  const { setNewStem } = useFlowActions((f) => f.renameAssetFlow);

  return asyncFlowModal(fsmState, (activeFsmState) => {
    const { oldStem, fixedSuffix } = activeFsmState.runState;
    const oldBasename = `${oldStem}${fixedSuffix}`;

    switch (activeFsmState.kind) {
      case "awaiting-ack-of-notification": {
        if (activeFsmState.outcomeNub.kind === "success") {
          throw new Error("should not be notifying if successful");
        }

        const messageContent = resolveStringSpec(
          activeFsmState.outcomeNub.messageSpec
        );
        const dismiss = activeFsmState.userAck;

        return (
          <Modal
            className="RenameAssetModal-failure"
            show={true}
            onHide={dismiss}
            animation={false}
            centered
          >
            <Modal.Header closeButton={true}>
              <Modal.Title>
                {t("rename.failure-title", { replace: { oldBasename } })}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{messageContent}</p>
              <div className="d-flex justify-content-end">
                <Button onClick={dismiss}>{tCommon("button.ok")}</Button>
              </div>
            </Modal.Body>
          </Modal>
        );
      }

      case "interacting":
      case "attempting": {
        const settle = settleFunctions(isSubmittable, activeFsmState);

        const formatSpecifier: FormatSpecifier = [
          {
            kind: "user-input",
            placeholder: { ns: "assets", keyPart: "rename.placeholder" },
            initialValue: { kind: "raw", text: oldStem },
          },
          { kind: "literal", value: fixedSuffix },
        ];

        return (
          <Modal show={true} onHide={settle.cancel} animation={false} centered>
            <Modal.Header closeButton={isInteractable(activeFsmState)}>
              <Modal.Title>
                {t("rename.title", { replace: { oldBasename } })}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CompoundTextInput
                formatSpecifier={formatSpecifier}
                onNewUiFragmentValue={setNewStem}
                onEnterKey={settle.submit}
                ref={focusOrBlurElementFun(fsmState)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                disabled={!isInteractable}
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
                {t("rename.button.rename")}
              </Button>
            </Modal.Footer>
          </Modal>
        );
      }
    }
  });
};
