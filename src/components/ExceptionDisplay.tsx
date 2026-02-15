import React from "react";
import { useTranslation } from "react-i18next";
import { DivSettingWindowTitle } from "./DivSettingWindowTitle";
import Button from "react-bootstrap/Button";
import { envVarOrDefault } from "../env-utils";
import { ErrorMessageDisplay } from "./ErrorMessageDisplay";

// Accept props of broader type than "FallbackProps" to allow use in
// other contexts.
type ExceptionDisplayProps = { error: { message: string } };

export const ExceptionDisplay: React.FC<ExceptionDisplayProps> = (props) => {
  const { t } = useTranslation("errors");
  const { error } = props;

  // Use <a> in the below, rather than <LinkWithinApp>, to ensure true
  // navigation and reset of app.
  return (
    <DivSettingWindowTitle
      className="ExceptionDisplay"
      windowTitle={t("unexpected.window-title")}
    >
      <div className="content">
        <ErrorMessageDisplay errorMessage={error.message} />
        <div className="button-container">
          <a href={envVarOrDefault("BASE_URL", "https://pytch.org/")}>
            <Button>{t("unexpected.button.return-home")}</Button>
          </a>
        </div>
      </div>
    </DivSettingWindowTitle>
  );
};
