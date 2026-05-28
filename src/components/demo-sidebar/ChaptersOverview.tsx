import { Button, Col, Collapse, Container, Row } from "react-bootstrap";
import Markdown from "react-markdown";
import React, { KeyboardEventHandler, RefObject } from "react";
import { useStoreActions, useStoreState } from "../../store";
import { useLinkedDemo, useMappedLinkedDemo } from "../Junior/lesson/hooks";
import classNames from "classnames";

type ChapterHeadingProps = {
  index: number;
  heading: string;
  chaptersRef: RefObject<(HTMLLIElement | null)[]>;
};

const ChapterHeading: React.FC<ChapterHeadingProps> = ({
  index,
  heading,
  chaptersRef,
}) => {
  const activeChapter = useStoreState(
    (state) => state.ideLayout.demoSidebar.activeChapter
  );
  const setActiveChapter = useStoreActions(
    (actions) => actions.ideLayout.demoSidebar.setActiveChapter
  );

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
                block: "center",
                //FIXME: smooth scroll snaps to top of parent before scrolling;
                // this becomes more noticable with higher chapter counts
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
    };

export const ChaptersOverview = ({
  chaptersRef,
}: {
  chaptersRef: RefObject<(HTMLLIElement | null)[]>;
}) => {
  const demoUuid = useMappedLinkedDemo((demo) => demo.demo.uuid);
  const isNavigationExpanded = useStoreState(
    (state) => state.ideLayout.demoSidebar.isNavigationExpanded
  );

  const activeChapter = useStoreState(
    (state) => state.ideLayout.demoSidebar.activeChapter
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

    return (
      <Row tabIndex={-1} className={"nav-tree"}>
        <Col xs={1} className={"p-0 m-0"}>
          <div className={"tree"}>
            <div className={"stem"} />
            {headings.map((_, index) => {
              return <div key={`${demoUuid}/${index}`} className={"branch"} />;
            })}
          </div>
        </Col>
        <Col className={"p-0 m-0"}>
          <ul
            className={"chapters-list m-0 p-0"}
            tabIndex={-1}
            onKeyDown={handleChaptersListOnKeyDown}
          >
            {headings.map((heading: string, index: number) => {
              return (
                <ChapterHeading
                  key={`${demoUuid}/${index}`}
                  index={index}
                  heading={heading}
                  chaptersRef={chaptersRef}
                />
              );
            })}
          </ul>
        </Col>
      </Row>
    );
  }

  return (
    <Row className={"chapters-overview flex-row"}>
      <Col className={"p-0"}>
        <Container className={"p-0 flex-column"}>
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
