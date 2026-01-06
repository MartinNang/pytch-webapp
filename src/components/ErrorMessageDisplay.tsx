import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type ErrorMessageDisplayProps = { errorMessage: string };

export const ErrorMessageDisplay: React.FC<ErrorMessageDisplayProps> = ({
  errorMessage,
}) => {
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
