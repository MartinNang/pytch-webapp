import React, { useEffect, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useLinkedDemo } from "../Junior/lesson/hooks";
import { DemoHeader } from "./DemoHeader";
import { ChaptersOverview } from "./ChaptersOverview";
import { DemoChapter } from "./DemoChapter";
import { useStoreActions, useStoreState } from "../../store";
import classNames from "classnames";
import { format } from "date-fns/format";

export const DemoSidebar = () => {
  const linkedDemo = useLinkedDemo();

  const isNavigationExpanded = useStoreState(
    (state) => state.ideLayout.demoSidebar.isNavigationExpanded
  );

  const setIsNavigationExpanded = useStoreActions(
    (actions) => actions.ideLayout.demoSidebar.setIsNavigationExpanded
  );

  const setActiveChapter = useStoreActions(
    (actions) => actions.ideLayout.demoSidebar.setActiveChapter
  );

  const chaptersRef = useRef<Array<HTMLLIElement | null>>([]);
  const navCaretRef = useRef<HTMLButtonElement | null>(null);

  chaptersRef.current = chaptersRef.current.slice(
    0,
    linkedDemo.demo.headings?.length
  );

  useEffect(() => {
    if (linkedDemo.demo.headings.length > 1) {
      setIsNavigationExpanded(true);
    } else setIsNavigationExpanded(false);

    // reset to prevent new demo from starting at a non-existing chapter on load
    setActiveChapter(0);
  }, []);

  // the following useEffect methods are needed to return focus to the previously used button after scrolling
  // to the active chapter in the chapter navigation
  useEffect(() => {
    navCaretRef.current?.focus();
  }, [isNavigationExpanded]);

  function DemoSubheader() {
    return (
      <Row
        className={classNames(
          "demo-sub-header",
          "px-4",
          linkedDemo.demo.summaryMarkdown ? "py-3" : "py-2"
        )}
      >
        <Col>{linkedDemo.demo.summaryMarkdown}</Col>
      </Row>
    );
  }

  function DemoFooter() {
    const absTimestamp = format(linkedDemo.demo.lastUpdated, "PP");

    return (
      <Row className={"demo-footer py-3 px-3"}>
        <div>
          <p>Published on {absTimestamp}</p>
        </div>
      </Row>
    );
  }

  return (
    <div className="DemoSidebar" tabIndex={-1}>
      <div className="content">
        <div className="inner-content">
          <Container>
            <DemoHeader chaptersRef={chaptersRef} navCaretRef={navCaretRef} />
            <DemoSubheader />
            <ChaptersOverview chaptersRef={chaptersRef} />
            <DemoChapter />
            <DemoFooter />
          </Container>
        </div>
      </div>
    </div>
  );
};
