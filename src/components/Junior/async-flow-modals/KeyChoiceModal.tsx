import React, { MouseEventHandler, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import classNames from "classnames";
import {
  KeyDescriptor,
  keyboardLayout,
} from "../../../model/junior/keyboard-layout";
import { FocusGroupContainer } from "../../FocusGroupContainer";
import { kFocusGroupItemClassName } from "../../../model/junior/grouped-focus";
import { useFocusContext } from "../../hooks/focus-steering";

type KeyOptionProps = {
  descriptor: KeyDescriptor;
  selectedKey: KeyDescriptor;
  onClick(): void;
  onDoubleClick(): void;
};
const KeyOption: React.FC<KeyOptionProps> = ({
  descriptor,
  selectedKey,
  onClick,
  onDoubleClick,
}) => {
  const focusContext = useFocusContext("per-method");
  const { browserKeyName, displayName } = descriptor;
  const isSelected = browserKeyName === selectedKey.browserKeyName;

  // Ugly hack to get wide spacebar:
  const classes = classNames(kFocusGroupItemClassName, "KeyOption", {
    isSelected,
    spacebar: browserKeyName === " ",
  });

  const combinedOnClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick();
    focusContext.onGroupItemClick(event);
  };

  return (
    <li>
      <Button
        variant="secondary"
        className={classes}
        onClick={combinedOnClick}
        onDoubleClick={onDoubleClick}
      >
        <span>{displayName}</span>
      </Button>
    </li>
  );
};

type KeyChoiceModalProps = {
  startingKey: KeyDescriptor;
  onCancel(): void;
  onAccept(chosenKey: KeyDescriptor): void;
};
export const KeyChoiceModal: React.FC<KeyChoiceModalProps> = ({
  startingKey,
  onCancel,
  onAccept,
}) => {
  const { t } = useTranslation("ide");
  const { t: tCommon } = useTranslation("common");
  const [selectedKey, setSelectedKey] = useState(startingKey);

  // Suppress bootstrap's restore-focus behaviour; we handle that
  // ourselves in the UpsertHandlerModal.
  return (
    <Modal
      className="KeyChoiceModal"
      onHide={onCancel}
      animation={false}
      centered={true}
      restoreFocus={false}
      show={true}
    >
      <Modal.Header>
        <Modal.Title>{t("key-choice-modal.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FocusGroupContainer groupedFocusKey="WhenKeyPressedOptionsList">
          <ol className="keyboard">
            {keyboardLayout.map((row) => (
              <li key={"row-" + row[0].browserKeyName} className="key-row">
                <ol className="keyboard-row">
                  {row.map((descr) => (
                    <KeyOption
                      key={descr.browserKeyName}
                      descriptor={descr}
                      selectedKey={selectedKey}
                      onClick={() => setSelectedKey(descr)}
                      onDoubleClick={() => onAccept(descr)}
                    />
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </FocusGroupContainer>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          {tCommon("button.cancel")}
        </Button>
        <Button variant="primary" onClick={() => onAccept(selectedKey)}>
          {tCommon("button.ok")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
