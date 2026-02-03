import React from "react";
import { Trans, useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import RawElement from "../RawElement";
import { asyncFlowModal } from "../async-flow-modals/utils";
import { settleFunctions } from "../../model/user-interactions/async-user-flow";
import { useFlowState } from "../../model";
import { Card } from "react-bootstrap";

export const CodeDiffHelpModal = () => {
  const { t } = useTranslation("tutorials");
  const { fsmState, isSubmittable } = useFlowState((f) => f.codeDiffHelpFlow);

  return asyncFlowModal(fsmState, (activeState) => {
    const { samples } = activeState.runState;
    const settle = settleFunctions(isSubmittable, activeState);
    return (
      <Modal
        show={true}
        onHide={settle.cancel}
        className="CodeDiffHelpModal"
        animation={false}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("flat.code-diff.help-title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {samples.unchanged && (
            <Card body>
              <RawElement
                className="patch-container"
                element={samples.unchanged}
              />
              <p>
                <Trans i18nKey="flat.code-diff.unchanged-help" ns="tutorials" />
              </p>
            </Card>
          )}
          {samples.deleted && (
            <Card body>
              <RawElement
                className="patch-container"
                element={samples.deleted}
              />
              <p>
                <Trans i18nKey="flat.code-diff.deleted-help" ns="tutorials" />
              </p>
            </Card>
          )}
          {samples.added && (
            <Card body>
              <RawElement className="patch-container" element={samples.added} />
              <p>
                <Trans i18nKey="flat.code-diff.added-help" ns="tutorials" />
              </p>
            </Card>
          )}
          <p>
            <Trans i18nKey="flat.code-diff.spaces-help" ns="tutorials" />
          </p>
        </Modal.Body>
      </Modal>
    );
  });
};
