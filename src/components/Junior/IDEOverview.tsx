import React from "react";
import { assertNever, EmptyProps } from "../../utils";
import {
  Row,
  Container,
  Spinner,
  Carousel,
  Card,
  Accordion,
} from "react-bootstrap";
import { Content } from "../../model/keyboard-shortcuts-help";
import { useStoreState } from "../../store";
import { useActionAsEffect } from "../hooks/use-action-as-effect";

import "./KeyNavHelpSidebar.scss";
import "./IDEOverview.scss";
import codingArea from "../../images/ide-overview/coding-area.png";
import helpArea from "../../images/ide-overview/help-area.png";
import stageAndSpritesArea from "../../images/ide-overview/stage-and-sprites-area.png";
import { useJrEditActions } from "./hooks";

const IDEOverviewContent: React.FC<{ content: Content }> = () => {
  const expandAction = useJrEditActions((a) => a.expandActivityContent);

  return (
    <Container className={"d-flex flex-column h-100 px-0 m-0"}>
      <Row className={"m-0"}>
        <h1 className={"pt-4 pb-3 px-3"}>User Interface overview</h1>
        <p>
          Welcome to the Pytch <i>Integrated Development Environment</i> (IDE)
          page! An IDE is software that is used to make coding easier. While you
          can write code in any text-editor, Pytch has helpful features that
          will make running, changing and fixing problems in your projects
          easier as you create them.
        </p>
        <p>
          There are three main sections in Pytch's IDE: The <b>help area</b>,
          the <b>coding</b> area and the <b>stage and sprites</b> area.
        </p>
      </Row>
      <Accordion defaultActiveKey="0" className={"border-0 rounded-0"}>
        <Accordion.Item eventKey="0" className={"border-0 rounded-0"}>
          <Accordion.Header>
            <h2>Areas</h2>
          </Accordion.Header>
          <Accordion.Body>
            <Carousel
              variant={"dark"}
              className={"flex-grow-1"}
              interval={null}
              wrap={false}
            >
              <Carousel.Item>
                <Card className={"mx-auto"}>
                  <Card.Img
                    variant="top"
                    src={helpArea}
                    alt={
                      "The expanded help area displaying the example code panel."
                    }
                  />
                  <Card.Body>
                    <Card.Title>Help area</Card.Title>
                    <Card.Text>
                      This section has a bunch of information that might become
                      useful throughout your work, including Scratch/Python
                      example code, tutorials, lessons, project descriptions,
                      keyboard navigation shortcuts and this overview panel!
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Carousel.Item>
              <Carousel.Item>
                <Card className={"mx-auto h-100"}>
                  <Card.Img
                    variant="top"
                    src={codingArea}
                    alt={
                      "The coding area with its 'Code' tab open. A script has been added inside of the tab and filled with one line of example code."
                    }
                  />
                  <Card.Body>
                    <Card.Title>Coding area</Card.Title>
                    <Card.Text>
                      In this section you are able to change the behavior, look
                      and sound of your project and its sprites.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Carousel.Item>
              <Carousel.Item>
                <Card className={"mx-auto h-100"}>
                  <Card.Img
                    variant="top"
                    src={stageAndSpritesArea}
                    alt={
                      "The stage and sprites area. The top portion of the section is displaying a preview of a Pytch project while to bottom portion lists the stage and the sprite used to create the project."
                    }
                  />
                  <Card.Body>
                    <Card.Title>Stage and Sprites area</Card.Title>
                    <Card.Text>
                      This section allows you to run a preview of what your
                      current project can do and gives you a list of all the
                      sprites you are using in your project.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Carousel.Item>
            </Carousel>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" className={"border-0 rounded-0"}>
          <Accordion.Header>
            <h2>Keyboard Navigation</h2>
          </Accordion.Header>
          <Accordion.Body>
            <p>
              Pytch has recently added new features to make navigating our IDE
              via keyboard easier. If you would like to learn more about our
              list of currently supported keyboard shortcuts to navigate around
              and between IDE sections, please have a look at our{" "}
              <button
                className={"btn btn-primary"}
                onClick={() => expandAction("keynavhelp")}
              >
                Keyboard navigation help pane
              </button>
              .
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

const IDEOverviewMaybeContent: React.FC<EmptyProps> = () => {
  const contentState = useStoreState(
    (s) => s.ideLayout.keyboardShortcutsHelpContent
  );
  switch (contentState.contentFetchState.state) {
    case "idle":
    case "requesting":
      return (
        <div className="spinner-container h-100 w-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </div>
      );
    case "available":
      return (
        <IDEOverviewContent content={contentState.contentFetchState.content} />
      );
    case "error":
      return (
        <>
          <h1>Problem</h1>
          <p>Sorry, there was a problem fetching the help information.</p>
        </>
      );
    default:
      return assertNever(contentState.contentFetchState);
  }
};

export const IDEOverview: React.FC<EmptyProps> = () => {
  useActionAsEffect(
    (actions) => actions.ideLayout.keyboardShortcutsHelpContent.maybeLoadContent
  );

  return (
    <div
      className="IDEOverview gfs__help-content h-100 overflow-y-scroll"
      tabIndex={0}
    >
      <IDEOverviewMaybeContent />
    </div>
  );
};
