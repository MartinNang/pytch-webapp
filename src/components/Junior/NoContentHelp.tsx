import React from "react";
import Card from "react-bootstrap/Card";
import { ResourceKind } from "../../model/resource";
import { AssetOperationScope } from "../../model/asset/core";

type NoContentHelpProps = {
  scope: AssetOperationScope;
  resourceKind: ResourceKind;
};
export const NoContentHelp: React.FC<NoContentHelpProps> = ({
  scope,
  resourceKind,
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
