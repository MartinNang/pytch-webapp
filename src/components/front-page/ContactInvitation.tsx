import React from "react";
import { Trans } from "react-i18next";
import { EmptyProps } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ContactInvitation.scss";

export const ContactInvitation: React.FC<EmptyProps> = () => {
  return (
    <div id="contact-info" className="ContactInvitation">
      <p className="mail-icon">
        <a href="mailto:info@pytch.org">
          <FontAwesomeIcon icon={["far", "envelope"]} />
        </a>
      </p>
      <p className="content-text">
        <Trans
          ns="welcome"
          i18nKey="contact-invitation"
          components={{
            emailLink: <a href="mailto:info@pytch.org">info@pytch.org</a>,
          }}
        />
      </p>
    </div>
  );
};
