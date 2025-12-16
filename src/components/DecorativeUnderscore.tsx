import React from "react";
import { EmptyProps } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const DecorativeUnderscore: React.FC<EmptyProps> = () => (
  <span aria-hidden={true}>_</span>
);

export const ExternalLinkIndicator: React.FC<EmptyProps> = () => {
  return (
    <FontAwesomeIcon
      style={{ fontSize: "0.75rem", transform: "translateY(-5px)" }}
      className="ExternalLinkIndicator"
      icon="arrow-up-right-from-square"
    />
  );
};
