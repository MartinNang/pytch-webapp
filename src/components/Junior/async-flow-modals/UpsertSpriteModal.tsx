import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Form } from "react-bootstrap";
import { assertNever, onChangeFun, submitOnEnterKeyFun } from "../../../utils";
import { useJrEditActions, useJrEditState } from "../hooks";
import {
  flowFocusOrBlurFun,
  isInteractable,
  settleFunctions,
} from "../../../model/user-interactions/async-user-flow";
import { asyncFlowModal } from "../../async-flow-modals/utils";
import { Trans, useTranslation } from "react-i18next";

export const UpsertSpriteModal = () => {
  const { t } = useTranslation("flows");
  const { t: tCommon } = useTranslation("common");
  const { fsmState, isSubmittable } = useJrEditState((s) => s.upsertSpriteFlow);
  const { setName } = useJrEditActions((a) => a.upsertSpriteFlow);

  const inputRef = React.useRef<HTMLInputElement>(null);
  useEffect(flowFocusOrBlurFun(inputRef, fsmState));

  return asyncFlowModal(fsmState, (activeFsmState) => {
    if (activeFsmState.kind === "awaiting-ack-of-notification") {
      throw new Error(
        'UpsertSpriteModal: Unexpected state "awaiting-ack-of-notification"'
      );
    }

    const { upsertionAction, name, nameValidity } = activeFsmState.runState;
    const handleNameChange = onChangeFun(setName);
    const settle = settleFunctions(isSubmittable, activeFsmState);
    const handleKeyPress = submitOnEnterKeyFun(settle.submit, isSubmittable);

    const validityContent = (() => {
      switch (nameValidity.status) {
        case "valid":
          // Even though this won't be shown, we need some content for the
          // <P> to have non-zero height:
          return <p>&nbsp;</p>;
        case "invalid": {
          const keySuffix = nameValidity.reasonKey;
          const fullKey = `upsert-sprite.invalid-name.${keySuffix}` as const;
          return <p>{t(fullKey, { name })}</p>;
        }
        default:
          return assertNever(nameValidity);
      }
    })();

    const title = (() => {
      switch (upsertionAction.kind) {
        case "insert":
          return <span>{t("upsert-sprite.title.insert")}</span>;
        case "update":
          return (
            <span>
              <Trans
                ns="flows"
                i18nKey="upsert-sprite.title.update"
                values={{ previousName: upsertionAction.previousName }}
              />
            </span>
          );
        default:
          return assertNever(upsertionAction);
      }
    })();

    // Disable `restoreFocus` behaviour; we use `onDispose()` to manage
    // ourselves where the focus goes after the modal dialog goes away.
    // See code in `ActorsList` (for add=insert) and in
    // `RenameSpriteDropdownItem` (for rename=update).
    return (
      <Modal
        className="UpsertSpriteModal"
        show={true}
        onHide={settle.cancel}
        animation={false}
        restoreFocus={false}
        centered
      >
        <Modal.Header closeButton={isInteractable(activeFsmState)}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              type="text"
              value={name}
              onChange={handleNameChange}
              onKeyDown={handleKeyPress}
              tabIndex={-1}
              ref={inputRef}
            ></Form.Control>
          </Form>
          <Alert
            variant="danger"
            className={`validity-assessment ${nameValidity.status}`}
          >
            {validityContent}
          </Alert>
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
            {tCommon("button.ok")}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  });
};
