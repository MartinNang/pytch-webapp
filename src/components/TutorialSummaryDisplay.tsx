import React, { useEffect, createRef } from "react";
import { useStoreActions, useStoreState } from "../store";
import {
  ITutorialSummary,
  SingleTutorialDisplayKind,
} from "../model/tutorials";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import LoadingOverlay from "./LoadingOverlay";
import { PytchProgramKind } from "../model/pytch-program";
import { EditorKindThumbnail } from "./EditorKindThumbnail";
import { useRunFlow } from "../model";

interface TutorialSummaryDisplayProps {
  tutorial: ITutorialSummary;
  kind?: SingleTutorialDisplayKind;
}

export const TutorialSummaryDisplay: React.FC<TutorialSummaryDisplayProps> = ({
  tutorial,
  kind,
}) => {
  const createProjectFromTutorial = useStoreActions(
    (actions) => actions.tutorialCollection.createProjectFromTutorial
  );
  const createDemoFromTutorial = useStoreActions(
    (actions) => actions.tutorialCollection.createDemoFromTutorial
  );

  const runShareTutorial = useRunFlow((f) => f.shareTutorialFlow);

  const alertRef: React.RefObject<HTMLDivElement> = createRef();
  const buttonsRef: React.RefObject<HTMLDivElement> = createRef();

  const maybeSlugCreating = useStoreState(
    (state) => state.tutorialCollection.maybeSlugCreating
  );

  const programKind: PytchProgramKind = tutorial.metadata.programKind ?? "flat";

  const loadingSomeTutorial = maybeSlugCreating != null;
  const loadingThisTutorial = maybeSlugCreating === tutorial.slug;

  useEffect(() => {
    let elt = alertRef.current;
    const buttonsElt = buttonsRef.current;
    if (elt == null || buttonsElt == null) return;

    if (elt.hasAttribute("data-populated")) return;
    for (const ch of tutorial.contentNodes) {
      elt.appendChild(ch);
    }
    elt.setAttribute("data-populated", "yes");
  });

  const launchTutorial = () => {
    createProjectFromTutorial(tutorial.slug);
  };

  const launchDemo = () => {
    createDemoFromTutorial(tutorial.slug);
  };

  const h1s = tutorial.contentNodes.filter((n) => n.nodeName === "H1");
  const maybeDisplayName = h1s.length === 0 ? null : h1s[0].textContent;
  const displayName = maybeDisplayName ?? "Unknown project";

  const launchShare = () => {
    const shareInfo = { slug: tutorial.slug, displayName, programKind };
    runShareTutorial(shareInfo);
  };

  const showDemoButton =
    kind === "tutorial-and-demo" || kind === "tutorial-demo-and-share";
  const showShareButton = kind === "tutorial-demo-and-share";

  // The className is not used in CSS but is used in e2e tests.
  const maybeDifficultyBadge = tutorial.metadata.difficulty && (
    <p className="tag-difficulty m-0">
      <span className="d-inline-block">{tutorial.metadata.difficulty}</span>
    </p>
  );

  const kindBadge = <EditorKindThumbnail programKind={programKind} size="sm" />;

  return (
    <li>
      <LoadingOverlay show={loadingThisTutorial}>
        <p>Creating project for tutorial...</p>
      </LoadingOverlay>
      <Card data-slug={tutorial.slug} className="TutorialCard">
        <Card.Header>
          <div className="tutorial-card-header">
            <div className="difficulty-badge">{maybeDifficultyBadge}</div>
            <Card.Title as="h3">{tutorial.metadata.displayName}</Card.Title>
            <div className="program-kind-badge">{kindBadge}</div>
          </div>
        </Card.Header>
        <Card.Body ref={alertRef} />
        <Card.Footer>
          <div className="button-bar" ref={buttonsRef}>
            {showDemoButton && (
              <Button
                title="Try this project"
                disabled={loadingSomeTutorial}
                variant="outline-primary"
                onClick={launchDemo}
              >
                Demo
              </Button>
            )}
            <Button
              title="Learn how to make this project"
              disabled={loadingSomeTutorial}
              variant="outline-primary"
              onClick={launchTutorial}
            >
              Tutorial
            </Button>
            {showShareButton && (
              <Button
                title="Share this project"
                disabled={loadingSomeTutorial}
                variant="outline-primary"
                onClick={launchShare}
              >
                Share
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>
    </li>
  );
};
