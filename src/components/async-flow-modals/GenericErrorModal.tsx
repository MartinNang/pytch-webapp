import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { ErrorMessageDisplay } from "../ErrorMessageDisplay";
import { mkRawSpec } from "../../model/i18n/core-types";

type GenericErrorModalProps = {
  message: string;
  onAck: () => void;
};

export const GenericErrorModal: React.FC<GenericErrorModalProps> = ({
  message,
  onAck,
}) => {
  const { t } = useTranslation("errors");
  const { t: tCommon } = useTranslation("common");
  return (
    <Modal className="GenericErrorModal" show={true} animation={false} centered>
      <Modal.Header>
        <Modal.Title>{t("unexpected.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ErrorMessageDisplay errorSpec={mkRawSpec(message)} />
        <div className="d-flex justify-content-end">
          <Button onClick={onAck}>{tCommon("button.ok")}</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
