import { useTranslation } from "react-i18next";
import { GeneralisedAssetKind } from "../../model/asset/core";
import { FileProcessingFailures } from "../FileProcessingFailures";
import { FileProcessingFailure } from "../../model/user-interactions/process-files";

type AddAssetFailuresListProps = {
  failures: Array<FileProcessingFailure>;
  assetKind: GeneralisedAssetKind;
  dismiss: () => void;
};
export const AddAssetFailuresList: React.FC<AddAssetFailuresListProps> = ({
  failures,
  assetKind,
  dismiss,
}) => {
  const { t } = useTranslation("assets");
  const keyStem = `add.${assetKind}` as const;

  const nFailures = failures.length;
  const titleText = t(`${keyStem}.failures.title`, { count: nFailures });
  const introText = t(`${keyStem}.failures.intro`, { count: nFailures });

  return (
    <FileProcessingFailures
      titleText={titleText}
      introText={introText}
      failures={failures}
      dismiss={dismiss}
    />
  );
};
