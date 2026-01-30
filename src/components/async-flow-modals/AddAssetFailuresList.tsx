import { useTranslation } from "react-i18next";
import { GeneralisedAssetKind } from "../../model/asset/core";
import { FileProcessingFailures } from "../FileProcessingFailures";
import { FileProcessingFailure } from "../../model/user-interactions/process-files";
import { AddAssetFailure } from "../../model/user-interactions/add-assets";

type AddAssetFailuresListProps = {
  failures: Array<AddAssetFailure>;
  assetKind: GeneralisedAssetKind;
  dismiss: () => void;
};
export const AddAssetFailuresList: React.FC<AddAssetFailuresListProps> = ({
  failures,
  assetKind,
  dismiss,
}) => {
  const { t } = useTranslation("assets");
  const keyStem = `add.${assetKind}`;

  const fileFailures: Array<FileProcessingFailure> = failures.map(
    (failure) => ({
      filename: failure.displayName,
      reason: failure.reason,
    })
  );

  const nFailures = failures.length;
  const titleText = t(`${keyStem}.failures.title`, { count: nFailures });
  const introText = t(`${keyStem}.failures.intro`, { count: nFailures });

  return (
    <FileProcessingFailures
      titleText={titleText}
      introText={introText}
      failures={fileFailures}
      dismiss={dismiss}
    />
  );
};
