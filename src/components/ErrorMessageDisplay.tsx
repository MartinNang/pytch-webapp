import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { RawOrI18nStringSpec } from "../model/i18n/core-types";
import { useResolveStringSpec } from "./hooks/resolve-string-spec";

type ErrorMessageDisplayProps = { errorSpec: RawOrI18nStringSpec };

export const ErrorMessageDisplay: React.FC<ErrorMessageDisplayProps> = ({
  errorSpec,
}) => {
  const resolveStringSpec = useResolveStringSpec();
  const errorMessage = resolveStringSpec(errorSpec);

  return (
    <div className="ErrorMessageDisplay">
      <p>
        <FontAwesomeIcon className="me-1" icon="exclamation-triangle" />
        Sorry, there was an unexpected problem. Please contact the Pytch team if
        the problem persists.
      </p>
      <div className="technical-details">
        <p className="intro">Technical details:</p>
        <p className="error-message">{errorMessage}</p>
      </div>
    </div>
  );
};
