import React, { RefObject } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Row } from "react-bootstrap";
import { useStoreActions, useStoreState } from "../../store";
import { useLinkedDemo } from "../Junior/lesson/hooks";
import classNames from "classnames";

/** Put style in SCSS not inline.  Then you can use variables like
 * $pytch-colour-main-yellow instead of the RGB string. */

/** Handling "loading" state should be done higher up. - Done*/

/** Same comment as elsewhere re should we distinguish between
 * "monolithic" and "structured" demos (according to one big lump vs
 * split into chapters). */

export const DemoHeader = ({
  chaptersRef,
  navCaretRef,
}: {
  chaptersRef: RefObject<(HTMLLIElement | null)[]>;
  navCaretRef: RefObject<HTMLButtonElement | null>;
}) => {
  const activeChapter = useStoreState(
    (state) => state.ideLayout.demoSidebar.activeChapter
  );

  const isNavigationExpanded = useStoreState(
    (state) => state.ideLayout.demoSidebar.isNavigationExpanded
  );

  const setIsNavigationExpanded = useStoreActions(
    (actions) => actions.ideLayout.demoSidebar.setIsNavigationExpanded
  );

  const linkedDemo = useLinkedDemo();
  const nChapters = linkedDemo.demo.headings.length;

  function DemoHeaderContent() {
    function DemoName() {
      return (
        <div className={classNames("px-0", "py-1", "m-0", "ps-2", "w-auto")}>
          <h1>{linkedDemo.demo.displayName}</h1>
        </div>
      );
    }

    function DemoChapterCount() {
      return (
        <div className={classNames("chapter-pill", "rounded-pill")}>
          <FontAwesomeIcon icon={"layer-group"} />
          <span aria-label={`Chapter ${activeChapter + 1} out of ${nChapters}`}>
            {activeChapter + 1}/{nChapters}
          </span>
        </div>
      );
    }

    function DemoChapterNavButton() {
      return (
        <Button
          aria-label={"Expand or collapse chapters navigation menu"}
          className={classNames("w-auto", "caret", "p-0", "ms-2", {
            isNavigationExpanded,
          })}
          key={"nav-caret"}
          id={"nav-caret"}
          ref={navCaretRef}
          onClick={() => {
            setIsNavigationExpanded(!isNavigationExpanded);
            navCaretRef.current?.focus();
          }}
          onFocus={() => {
            chaptersRef.current[activeChapter]?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          <FontAwesomeIcon
            icon={"caret-down"}
            className={classNames("nav-caret", { isNavigationExpanded })}
          />
        </Button>
      );
    }

    function DemoHeaderMono() {
      return <DemoName />;
    }

    function DemoHeaderStructured() {
      return (
        <>
          <DemoName />
          <div className={classNames("w-auto", "d-flex")}>
            <DemoChapterCount />
            <DemoChapterNavButton />
          </div>
        </>
      );
    }

    if (nChapters > 1) {
      return <DemoHeaderStructured />;
    } else {
      return <DemoHeaderMono />;
    }
  }

  return (
    <Row className={classNames("demo-header", "p-3")}>
      <DemoHeaderContent />
    </Row>
  );
};
