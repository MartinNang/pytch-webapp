import { useRef } from "react";
import { EmptyProps } from "../utils";
import { useFlowState } from "../model";
import { asyncFlowModal } from "./async-flow-modals/utils";
import { settleFunctions } from "../model/user-interactions/async-user-flow";
import { Button, Card, Spinner } from "react-bootstrap";
import { ExceptionDisplay } from "./ExceptionDisplay";

const Content: React.FC<EmptyProps> = () => {
  const { fsmState } = useFlowState((f) => f.startTutorialAtCheckpointFlow);
  let lastErrorMessage = useRef<string>(null);

  // In the case of error, remember the message and display it even
  // after the async-user-flow has completed.  This avoids the user
  // looking at a mostly-blank page.

  if (fsmState.kind === "awaiting-ack-of-error")
    lastErrorMessage.current = fsmState.errorMessage;

  if (fsmState.kind === "idle" && lastErrorMessage.current != null)
    return <ExceptionDisplay error={{ message: lastErrorMessage.current }} />;

  // Otherwise, handle as normal "modal".

  return asyncFlowModal(fsmState, (activeFsmState) => {
    const { displaySummary, displayName, chapterIndex } =
      activeFsmState.runState;
    const settle = settleFunctions(true, activeFsmState);

    const summaryDivRef: React.Ref<HTMLDivElement> = (div) => {
      if (div == null || div.hasAttribute("data-populated")) return;
      displaySummary.forEach((node) => div.appendChild(node.cloneNode(true)));
      div.setAttribute("data-populated", "yes");
    };

    // TODO: Add difficulty badge and program-kind badge?

    const buttonContent =
      activeFsmState.kind === "attempting" ? <Spinner size="sm" /> : "Tutorial";

    return (
      <div className="TutorialList">
        <ul>
          <li>
            <Card
              data-slug={activeFsmState.runState.slug}
              className="TutorialCard"
            >
              <Card.Header>
                <div className="tutorial-card-header">
                  <Card.Title as="h3" className="mt-2">
                    {displayName}
                  </Card.Title>
                </div>
                <p className="text-center mt-3">
                  Starting at chapter {chapterIndex}
                </p>
              </Card.Header>
              <Card.Body>
                <div ref={summaryDivRef} />
                <p>
                  You will start this tutorial at the start of chapter{" "}
                  {chapterIndex}.
                </p>
              </Card.Body>
              <Card.Footer>
                <div className="button-bar">
                  <Button
                    title="Create project"
                    variant="outline-primary"
                    onClick={settle.submit}
                  >
                    {buttonContent}
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </li>
        </ul>
      </div>
    );
  });
};
