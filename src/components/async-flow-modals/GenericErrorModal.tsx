import React from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { ErrorMessageDisplay } from "../ErrorMessageDisplay";

type GenericErrorModalProps = {
  message: string;
  onAck: () => void;
};

export const GenericErrorModal: React.FC<GenericErrorModalProps> = ({
  message,
  onAck,
}) => {
  return (
    <Modal className="GenericErrorModal" show={true} animation={false} centered>
      <Modal.Header>
        <Modal.Title>Unexpected error</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ErrorMessageDisplay errorMessage={message} />
        <div className="d-flex justify-content-end">
          <Button onClick={onAck}>OK</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
