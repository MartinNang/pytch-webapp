import React, {
  ChangeEvent,
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useRef,
} from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { assertNever, submitOnEnterKeyFun } from "../../utils";
import {
  flowFocusOrBlurFun,
  isInteractable,
  settleFunctions,
} from "../../model/user-interactions/async-user-flow";
import { asyncFlowModal } from "../async-flow-modals/utils";
import { useFlowActions, useFlowState } from "../../model";
import { SaveProjectAsRunState } from "../../model/user-interactions/save-project-as";
import { LinkedContentRef } from "../../model/linked-content-core";

type TextsForKeepLink = {
  question: JSX.Element;
  trueStatus: JSX.Element;
  falseStatus: JSX.Element;
};
function textsForKeepLink(ref: LinkedContentRef): TextsForKeepLink {
  switch (ref.kind) {
    case "none": {
      // Should not see this, but just in case:
      const textSpan = (
        <span>(This project is not connected to anything.)</span>
      );
      return {
        question: textSpan,
        trueStatus: textSpan,
        falseStatus: textSpan,
      };
    }
    case "jr-tutorial":
      return {
        question: (
          <span>
            Make copy follow tutorial <i>{ref.name}</i>?
          </span>
        ),
        trueStatus: <span>Copy will follow tutorial.</span>,
        falseStatus: (
          <span>
            Copy will <b>not</b> follow tutorial.
          </span>
        ),
      };
    case "specimen":
      // Would be nice to know which one, but we don't have that info.
      return {
        question: <span>Make copy be linked to lesson?</span>,
        trueStatus: <span>Copy will be linked to lesson.</span>,
        falseStatus: (
          <span>
            Copy will <b>not</b> be linked to lesson.
          </span>
        ),
      };
    default:
      return assertNever(ref);
  }
}

const MaybeKeepContentLinkSwitch: React.FC<{
  runState: SaveProjectAsRunState;
}> = ({ runState }) => {
  const setKeepLink = useFlowActions(
    (f) => f.saveProjectAsFlow.setCopyKeepsContentLink
  );

  if (runState.sourceLinkedContentRef.kind === "none") {
    return false;
  }

  const onSwitchChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setKeepLink(evt.target.checked);
  };

  const onKeyDown: KeyboardEventHandler = (evt) => {
    // Do not perform action if we've received the event from a child.
    if (evt.target !== evt.currentTarget) return;

    if (evt.key === " " || evt.key === "Enter") {
      setKeepLink(!runState.copyKeepsContentLink);
    }
  };

  const linkTexts = textsForKeepLink(runState.sourceLinkedContentRef);

  const labelContent = (
    <span className="current-state-label">
      <span className="when-true">{linkTexts.trueStatus}</span>
      <span className="when-false">{linkTexts.falseStatus}</span>
    </span>
  );

  return (
    <Form className="keep-content-link-switch">
      <Form.Label tabIndex={0} onKeyDown={onKeyDown} className="p-2">
        <span className="pe-5 fw-bold">{linkTexts.question}</span>
        <Form.Check
          label={labelContent}
          checked={runState.copyKeepsContentLink}
          aria-checked={runState.copyKeepsContentLink}
          onChange={onSwitchChange}
          tabIndex={-1}
          type="switch"
          id="custom-switch"
        />
      </Form.Label>
    </Form>
  );
};

export const CopyProjectModal = () => {
  const { fsmState, isSubmittable } = useFlowState((f) => f.saveProjectAsFlow);
  const { setNameOfCopy } = useFlowActions((f) => f.saveProjectAsFlow);
  const focusRequired = useRef<boolean>(true);

  if (fsmState.kind === "idle") {
    focusRequired.current = true;
  }

  const maybeFocusTextInput = (elt: HTMLInputElement | null) => {
    if (elt != null && focusRequired.current) {
      setTimeout(() => elt.focus());
      focusRequired.current = false;
    }
  };

  return asyncFlowModal(fsmState, (activeFsmState) => {
    const { nameOfCopy } = activeFsmState.runState;
    const settle = settleFunctions(isSubmittable, activeFsmState);

    const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
      setNameOfCopy(evt.target.value);
    };
    const handleKeyPress = submitOnEnterKeyFun(settle.submit, isSubmittable);

    return (
      <Modal
        className="CopyProject"
        show={true}
        onHide={settle.cancel}
        animation={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>Copy project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                readOnly={!isInteractable(activeFsmState)}
                type="text"
                value={nameOfCopy}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                placeholder="Name for copy of project"
                ref={maybeFocusTextInput}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={settle.cancel}
            disabled={!isInteractable}
          >
            Cancel
          </Button>
          <Button
            disabled={!isSubmittable}
            variant="primary"
            onClick={settle.submit}
          >
            Make a copy
          </Button>
        </Modal.Footer>
      </Modal>
    );
  });
};
