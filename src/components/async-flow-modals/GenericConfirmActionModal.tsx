import { useTranslation } from "react-i18next";
import {
  ActiveAsyncUserFlowFsmState,
  isInteractable,
  settleFunctions,
} from "../../model/user-interactions/async-user-flow";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useEffect, useRef } from "react";

type GenericConfirmActionModalProps<RunStateT> = {
  activeFsmState: ActiveAsyncUserFlowFsmState<RunStateT, unknown>;
  headerContent: React.JSX.Element;
  bodyContent: React.JSX.Element;
  confirmButtonText?: string;
};
export function GenericConfirmActionModal<RunStateT>(
  props: GenericConfirmActionModalProps<RunStateT>
): React.JSX.Element {
  const { t: tCommon } = useTranslation("common");
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    cancelButtonRef.current?.focus();
  });

  const activeFsmState = props.activeFsmState;
  const confirmButtonText = props.confirmButtonText ?? tCommon("action.delete");

  // Confirmations are always submittable:
  const settle = settleFunctions(true, activeFsmState);

  return (
    <Modal
      className="GenericConfirmActionModal"
      show={true}
      centered
      animation={false}
      onHide={settle.cancel}
    >
      <Modal.Header closeButton={isInteractable(activeFsmState)}>
        <Modal.Title>{props.headerContent}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.bodyContent}</Modal.Body>
      <Modal.Footer>
        <Button
          ref={cancelButtonRef}
          variant="secondary"
          onClick={settle.cancel}
          disabled={!isInteractable(activeFsmState)}
        >
          {tCommon("button.cancel")}
        </Button>
        {isInteractable(activeFsmState) ? (
          <Button variant="danger" onClick={settle.submit}>
            {confirmButtonText}
          </Button>
        ) : (
          <Button disabled variant="danger" className="awaiting-action">
            <span className="spacing-text">{confirmButtonText}</span>
            <span className="spinner-container">
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            </span>
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
