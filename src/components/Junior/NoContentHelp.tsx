import React from "react";
import Card from "react-bootstrap/Card";
import { useTranslation } from "react-i18next";
import { ScopedResourceKind } from "../../model/resource";

type NoContentHelpProps = {
  scopedResourceKind: ScopedResourceKind;
};
export const NoContentHelp: React.FC<NoContentHelpProps> = ({
  scopedResourceKind,
}) => {
  const { t } = useTranslation("ide");
  const content = t(`no-content-help.${scopedResourceKind}`);

  return (
    <Card className="NoContentHelp" body>
      <p>{content}</p>
    </Card>
  );
};
