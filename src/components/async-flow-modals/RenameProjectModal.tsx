import React, { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { submitOnEnterKeyFun } from "../../utils";
import { asyncFlowModal } from "./utils";
import {
  focusOrBlurElementFun,
  isInteractable,
  settleFunctions,
} from "../../model/user-interactions/async-user-flow";
import { useFlowActions, useFlowState } from "../../model";

export const RenameProjectModal = () => {
  const { t } = useTranslation("projects");
  const { t: tCommon } = useTranslation("common");
  const { fsmState, isSubmittable } = useFlowState((f) => f.renameProjectFlow);
  const { setNewName } = useFlowActions((f) => f.renameProjectFlow);

  return asyncFlowModal(fsmState, (activeFsmState) => {
    const { oldName, newName } = activeFsmState.runState;
    const settle = settleFunctions(isSubmittable, activeFsmState);

    const handleKeyPress = submitOnEnterKeyFun(settle.submit, isSubmittable);

    const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
      setNewName(evt.target.value);
    };

    // onChange= set "user has modified suggestion" bit?

    return (
      <Modal
        className="RenameProjectModal"
        show={true}
        onHide={settle.cancel}
        animation={false}
        centered
      >
        <Modal.Header closeButton={isInteractable(activeFsmState)}>
          <Modal.Title>
            {t("rename.title", { replace: { oldName } })}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              type="text"
              value={newName}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              ref={focusOrBlurElementFun(fsmState)}
            ></Form.Control>
          </Form>
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
            {t("rename.button.rename")}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  });
};
