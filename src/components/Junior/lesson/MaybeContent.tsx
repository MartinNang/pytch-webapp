import React from "react";
import { EmptyProps, assertNever } from "../../../utils";
import { useLinkedContentLoadingStateSummary } from "../../../model/linked-content";

import { Content } from "./Content";
import { ContentLoadingSpinner } from "./ContentLoadingSpinner";
import { SpecimenInformation } from "./SpecimenInformation";
import { ErrorMessageDisplay } from "../../ErrorMessageDisplay";
import { mkRawSpec } from "../../../model/i18n/core-types";

export const MaybeContent: React.FC<EmptyProps> = () => {
  const linkedContentState = useLinkedContentLoadingStateSummary();
  console.log("linkedContentstate", linkedContentState);
  switch (linkedContentState.kind) {
    case "idle":
      return null;
    case "succeeded": {
      const contentKind = linkedContentState.contentKind;
      switch (contentKind) {
        case "none":
          return null;
        case "jr-tutorial":
          return <Content />;
        case "specimen":
          return <SpecimenInformation />;
        default:
          return assertNever(contentKind);
      }
    }
    case "failed":
      return (
        <div className="m-4">
          <h2>Problem loading content</h2>
          <ErrorMessageDisplay
            errorSpec={mkRawSpec(linkedContentState.message)}
          />
        </div>
      );
    case "pending": {
      const contentKind = linkedContentState.contentKind;
      switch (contentKind) {
        case "none":
          return null;
        case "jr-tutorial":
        case "specimen":
          return <ContentLoadingSpinner />;
        default:
          return assertNever(contentKind);
      }
    }
    default:
      return assertNever(linkedContentState);
  }
};
