import React from "react";
import { Trans, useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  sharingUrlFromSlug,
  sharingUrlFromSlugForDemo,
} from "../../model/user-interactions/share-tutorial";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { copyTextToClipboard } from "../../utils";
import { asyncFlowModal } from "./utils";
import { settleFunctions } from "../../model/user-interactions/async-user-flow";
import { useFlowState } from "../../model";

export const ShareTutorialModal = () => {
  const { t } = useTranslation("tutorials");
  const { t: tCommon } = useTranslation("common");
  const { fsmState, isSubmittable } = useFlowState((f) => f.shareTutorialFlow);

  return asyncFlowModal(fsmState, (activeFsmState) => {
    const info = activeFsmState.runState;
    const settle = settleFunctions(isSubmittable, activeFsmState);

    return (
      <Modal
        className="ShareTutorial"
        size="lg"
        show={true}
        onHide={settle.cancel}
        animation={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>
            <Trans
              i18nKey="share.title"
              ns="tutorials"
              values={{ displayName: info.displayName }}
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <Trans i18nKey="share.tutorial-only" ns="tutorials" />
          </p>

          <div className="CopyLinkDiv">
            <Button
              title={t("share.button.copy-tutorial-only.title")}
              className="copy-button"
              variant="outline-success"
              onClick={() => {
                copyTextToClipboard(sharingUrlFromSlug(info.slug));
              }}
            >
              {t("share.button.copy")}
              <FontAwesomeIcon
                style={{ marginLeft: "10px" }}
                className="fa-lg"
                icon="copy"
              />
            </Button>
            <label>{sharingUrlFromSlug(info.slug)}</label>
          </div>
          <p>
            <Trans i18nKey="share.tutorial-and-demo" ns="tutorials" />
          </p>
          <div className="CopyLinkDiv">
            <Button
              title={t("share.button.copy-tutorial-demo.title")}
              className="copy-button"
              variant="outline-success"
              onClick={() => {
                copyTextToClipboard(sharingUrlFromSlugForDemo(info.slug));
              }}
            >
              {t("share.button.copy")}
              <FontAwesomeIcon
                style={{ marginLeft: "10px" }}
                className="fa-lg"
                icon="copy"
              />
            </Button>
            <label>{sharingUrlFromSlugForDemo(info.slug)}</label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={settle.cancel}>
            {tCommon("button.ok")}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  });
};
