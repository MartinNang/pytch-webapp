import { Button, Col, Collapse, Container, Row } from "react-bootstrap";
import Markdown from "react-markdown";
import React, { KeyboardEventHandler, RefObject } from "react";
import { useStoreActions, useStoreState } from "../../store";
import { useLinkedDemo } from "../Junior/lesson/hooks";
import classNames from "classnames";

export const ChaptersOverview = ({
  chaptersRef,
}: {
  chaptersRef: RefObject<(HTMLLIElement | null)[]>;
}) => {
  const isNavigationExpanded = useStoreState(
    (state) => state.ideLayout.demoSidebar.isNavigationExpanded
  );

  const activeChapter = useStoreState(
    (state) => state.ideLayout.demoSidebar.activeChapter
  );

  const setActiveChapter = useStoreActions(
    (actions) => actions.ideLayout.demoSidebar.setActiveChapter
  );

  const linkedDemo = useLinkedDemo();
  const headings = linkedDemo.demo.headings;

  function ChaptersList() {
    const handleChaptersListOnKeyDown: KeyboardEventHandler = (e) => {
      switch (e.key) {
        case "Enter": {
          let currentContainer = document.activeElement;
          let activeChapterButton = currentContainer?.children.item(
            activeChapter
          )?.firstElementChild as HTMLElement;
          activeChapterButton?.focus();
          break;
        }
      }
    };

    function ChapterHeading({
      index,
      heading,
    }: {
      index: number;
      heading: string;
    }) {
      const handleChapterHeadingOnKeyDown: KeyboardEventHandler = (e) => {
        let currentButton = document.activeElement;
        switch (e.key) {
          case "ArrowUp":
          case "ArrowLeft": {
            let previousButton = currentButton?.parentElement
              ?.previousElementSibling?.firstElementChild as HTMLElement;
            previousButton.focus();
            break;
          }
          case "ArrowDown":
          case "ArrowRight": {
            let nextButton = currentButton?.parentElement?.nextElementSibling
              ?.firstElementChild as HTMLElement;
            nextButton.focus();
            break;
          }
        }
      };

      const active = index === activeChapter;

      return (
        <li
          key={index}
          ref={(el) => {
            if (active) {
              el?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }}
          className={"py-0 ps-0 pe-3 rounded-3"}
        >
          <Button
            key={index}
            tabIndex={index === 0 ? 0 : -1}
            className={classNames("py-2 px-3 rounded-3 mt-2", { active })}
            onClick={() => {
              setActiveChapter(index);
              chaptersRef.current[index]?.focus(); // FIXME
            }}
            onKeyDown={handleChapterHeadingOnKeyDown}
          >
            <Markdown>{heading}</Markdown>
          </Button>
        </li>
      );
    }

    return (
      <Row className={"overflow-scroll nav-tree"}>
        <Col xs={1} className={"p-0 m-0"}>
          <div className={"tree"}>
            <div className={"stem"} />
            {headings?.map(() => {
              return <div className={"branch"} />;
            })}
          </div>
        </Col>
        <Col className={"p-0 m-0"}>
          <ul
            className={"chapters-list m-0 p-0"}
            tabIndex={-1}
            onKeyDown={handleChaptersListOnKeyDown}
          >
            {headings?.map((heading: string, index: number) => {
              return <ChapterHeading index={index} heading={heading} />;
            })}
          </ul>
        </Col>
      </Row>
    );
  }

  return (
    <Row className={"chapters-overview flex-row"}>
      <Col className={"pe-0"}>
        <Container className={"pb-0 flex-column pe-0"}>
          <Row className={"chapters-navigation"}>
            <Collapse in={isNavigationExpanded}>
              <Col className={"ps-4"}>
                <ChaptersList />
              </Col>
            </Collapse>
          </Row>
        </Container>
      </Col>
    </Row>
  );
};
