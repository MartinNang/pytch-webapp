import React from "react";
import Card from "react-bootstrap/Card";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("ide");
  const content = t(`no-content-help.${scope}.${resourceKind}`);

  return (
    <Card className="NoContentHelp" body>
      <p>{content}</p>
    </Card>
  );
};
