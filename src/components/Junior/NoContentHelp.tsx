import React from "react";
import Card from "react-bootstrap/Card";

type NoContentHelpProps = {
  actorKind: string;
  contentKind: string;
  buttonsPlural: boolean;
};
export const NoContentHelp: React.FC<NoContentHelpProps> = ({
  actorKind,
  contentKind,
  buttonsPlural,
}) => {
  const buttonOrButtons = buttonsPlural ? "buttons" : "button";
  return (
    <Card className="NoContentHelp" body>
      <p>
        Your {actorKind} has no {contentKind} yet. Use the {buttonOrButtons}{" "}
        below to add one!
      </p>
    </Card>
  );
};
