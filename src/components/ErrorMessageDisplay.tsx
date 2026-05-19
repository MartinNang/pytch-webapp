import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useTranslation } from "react-i18next";
import { RawOrI18nStringSpec } from "../model/i18n/core-types";
import { useResolveStringSpec } from "./hooks/resolve-string-spec";

type ErrorMessageDisplayProps = { errorSpec: RawOrI18nStringSpec };

export const ErrorMessageDisplay: React.FC<ErrorMessageDisplayProps> = ({
  errorSpec,
}) => {
  const { t } = useTranslation("errors");
  const resolveStringSpec = useResolveStringSpec();
  const errorMessage = resolveStringSpec(errorSpec);

  return (
    <div className="ErrorMessageDisplay">
      <p>
        <FontAwesomeIcon className="me-1" icon="exclamation-triangle" />
        {t("error-message-display.intro")}
      </p>
      <div className="technical-details">
        <p className="intro">
          {t("error-message-display.technical-details.intro")}
        </p>
        <p className="error-message">{errorMessage}</p>
      </div>
    </div>
  );
};
