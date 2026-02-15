import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { stageWidth, stageHeight } from "../../constants";
import { failIfNull } from "../../utils";
import {
  isActive,
  settleFunctions,
} from "../../model/user-interactions/async-user-flow";
import { asyncFlowModal } from "../async-flow-modals/utils";
import { useFlowState } from "../../model";

export const DisplayScreenshotModal = () => {
  const { t } = useTranslation("flows");
  const { t: tCommon } = useTranslation("common");
  const { fsmState, isSubmittable } = useFlowState(
    (f) => f.displayScreenshotFlow
  );

  const imgRef = React.useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (isActive(fsmState)) {
      const img = failIfNull(imgRef.current, "imgRef is null");
      const canvas = failIfNull(
        document.getElementById("pytch-canvas") as HTMLCanvasElement | null,
        "could not find canvas element"
      );
      img.src = canvas.toDataURL();
    }
  });

  return asyncFlowModal(fsmState, (activeFsmState) => {
    const settle = settleFunctions(isSubmittable, activeFsmState);
    return (
      <Modal
        className="DisplayScreenshot"
        size="lg"
        show={isActive(activeFsmState)}
        onHide={settle.cancel}
        animation={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>{t("screenshot.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("screenshot.instruction")}</p>
          <img
            ref={imgRef}
            width={stageWidth}
            height={stageHeight}
            alt={t("screenshot.alt")}
          ></img>
        </Modal.Body>{" "}
        <Modal.Footer>
          <Button variant="primary" onClick={settle.cancel}>
            {tCommon("button.ok")}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  });
};
