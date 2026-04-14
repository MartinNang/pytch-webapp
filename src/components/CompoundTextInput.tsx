import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { assertNever } from "../utils";
import {
  FormatFragment,
  FormatSpecifier,
  uniqueUserInputFragment,
} from "../model/compound-text-input";
import { useTranslation } from "react-i18next";
import { resolveRawOrI18n, translatedSpec } from "../model/i18n/utils";

type CompoundTextInputProps = {
  formatSpecifier: FormatSpecifier;
  onNewUiFragmentValue: (uiFragmentValue: string) => void;
  onEnterKey: () => void;
  ref: React.Ref<HTMLInputElement>;
};
export const CompoundTextInput: React.FC<CompoundTextInputProps> = ({
  formatSpecifier,
  onNewUiFragmentValue,
  onEnterKey,
  ref,
}) => {
  const { i18n } = useTranslation();

  const uiFragment = uniqueUserInputFragment(formatSpecifier);
  const uiInitialValue = resolveRawOrI18n(i18n, uiFragment.initialValue);
  const uiPlaceholder = translatedSpec(i18n, uiFragment.placeholder);

  const [uiValue, setUiValue] = useState(uiInitialValue);

  const handleUiChange: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    const uiValue = evt.target.value;
    setUiValue(uiValue);
    onNewUiFragmentValue(uiValue);
  };

  const handleUiKeyPress: React.KeyboardEventHandler = (evt) => {
    if (evt.key === "Enter") {
      evt.preventDefault();
      onEnterKey();
    }
  };

  // Define this locally to avoid having to pass things like
  // handleUiChange down to a standalone function.  We rely on the
  // uniqueness of the "user-input" fragment, as enforced by
  // uniqueUserInputFragment() above.
  const fragmentComponent = (key: string, fragment: FormatFragment) => {
    switch (fragment.kind) {
      case "user-input":
        return (
          <Form.Control
            key={key}
            type="text"
            value={uiValue}
            placeholder={uiPlaceholder}
            onChange={handleUiChange}
            onKeyDown={handleUiKeyPress}
            ref={ref}
          />
        );
      case "literal":
        return (
          <span key={key} className="literal-fragment">
            {fragment.value}
          </span>
        );
      default:
        return assertNever(fragment);
    }
  };

  return (
    <Form>
      <div className="CompoundTextInput">
        {formatSpecifier.map((fragment, idx) =>
          fragmentComponent(idx.toString(), fragment)
        )}
      </div>
    </Form>
  );
};
