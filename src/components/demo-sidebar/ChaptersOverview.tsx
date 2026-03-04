import {
  Button,
  Col,
  Collapse,
  Container,
  Placeholder,
  Row,
} from "react-bootstrap";
import Markdown from "react-markdown";
import React, { RefObject } from "react";

/** The placeholder buttons: Large copy/paste chunks are undesirable,
 * but anyway I think v1 of this should use a simple spinner.  The wave
 * placeholders are nice but would be out of place with other spinners,
 * so if we do change, it should be a separate PR which converts all of
 * them. */

/** Event handlers are hard to read inline unless they're (say) two
 * lines max.  Give the function a name.  I can't claim never to have
 * left diagnostic console.log()s in, but in general they shouldn't be
 * there. */

/** The "loading" machinery shouldn't be needed once the "loading state"
 * is managed higher up, by MaybeContent. */

/** Unless not possible (e.g., something has to be dynamically computed)
 * put styles in SCSS not inline. */

/** Use the classNames() utility function to construct class values. */

export const ChaptersOverview = ({
  navigationOpen,
  activeChapter,
  loading,
  headings,
  chaptersRef,
  setActiveChapter,
}: {
  navigationOpen: boolean;
  activeChapter: number;
  loading: boolean;
  headings: string[] | null;
  chaptersRef: RefObject<(HTMLLIElement | null)[]>;
  setActiveChapter: (ac: number) => void;
}) => {
  return (
    <Row className={"chapters-overview flex-row"} style={{}}>
      <Col className={"pe-0"}>
        <Container className={"pb-0 flex-column pe-0"}>
          <Row className={"chapters-navigation"}>
            <Collapse in={navigationOpen}>
              <Col className={"ps-4"}>
                <ul
                  className={"chapters-list m-0 p-0"}
                  tabIndex={-1}
                  onKeyDown={(e) => {
                    switch (e.key) {
                      case "Enter": {
                        console.log("focusing on active chapter");
                        let currentContainer = document.activeElement;
                        console.log("current container", currentContainer);
                        let activeChapterButton =
                          currentContainer?.children.item(activeChapter)
                            ?.firstElementChild as HTMLElement;
                        console.log(
                          "active chapter button",
                          activeChapterButton
                        );
                        activeChapterButton?.focus();
                        break;
                      }
                    }
                  }}
                >
                  {loading || (headings && headings?.length === 1) ? (
                    <>
                      <li
                        className={
                          "w-100 py-0 px-3 rounded-3 chapter-navigation-link "
                        }
                      >
                        <Placeholder.Button
                          className={
                            "py-2 px-3 rounded-3 d-inline-block mt-2 active loading placeholder-wave"
                          }
                          style={{
                            color: "white",
                            backgroundColor: "#00B5B0",
                            textAlign: "start",
                            border: "none",
                          }}
                          aria-hidden={"true"}
                        >
                          <Placeholder
                            xs={12}
                            size={"sm"}
                            className={"rounded-1 placeholder-wave"}
                          />
                        </Placeholder.Button>
                      </li>
                      <li
                        className={
                          "w-100 py-0 px-3 rounded-3 chapter-navigation-link"
                        }
                      >
                        <Placeholder.Button
                          className={
                            "py-2 px-3 rounded-3 d-inline-block mt-2 loading placeholder-wave"
                          }
                          style={{
                            color: "white",
                            backgroundColor: "#00B5B0",
                            textAlign: "start",
                            border: "none",
                          }}
                          aria-hidden={"true"}
                        >
                          <Placeholder
                            xs={12}
                            size={"sm"}
                            className={"rounded-1 placeholder-wave"}
                          />
                        </Placeholder.Button>
                      </li>
                      <li
                        className={
                          "w-100 py-0 px-3 rounded-3 chapter-navigation-link"
                        }
                      >
                        <Placeholder.Button
                          className={
                            "py-2 px-3 rounded-3 d-inline-block mt-2 loading placeholder-wave"
                          }
                          style={{
                            color: "white",
                            backgroundColor: "#00B5B0",
                            textAlign: "start",
                            border: "none",
                          }}
                          aria-hidden={"true"}
                        >
                          <Placeholder
                            xs={12}
                            size={"sm"}
                            className={"rounded-1 placeholder-wave"}
                          />
                        </Placeholder.Button>
                      </li>
                    </>
                  ) : (
                    <>
                      {headings?.map((heading: string, index: number) => {
                        return (
                          <li
                            key={index}
                            ref={(el) =>
                              (chaptersRef.current[index] = el) || undefined
                            }
                            className={
                              "w-100 py-0 px-3 rounded-3 chapter-navigation-link "
                            }
                          >
                            <Button
                              key={index}
                              tabIndex={index === 0 ? 0 : -1}
                              className={
                                "py-2 px-3 rounded-3 mt-2 " +
                                (index === activeChapter ? " active" : "")
                              }
                              onClick={() => setActiveChapter(index)}
                              style={{
                                color: "white",
                                backgroundColor: "#00B5B0",
                                textAlign: "start",
                                border: "none",
                              }}
                              onKeyDown={(e) => {
                                let currentButton = document.activeElement;
                                switch (e.key) {
                                  case "ArrowUp":
                                  case "ArrowLeft": {
                                    console.log("going up");
                                    console.log(
                                      "current active element",
                                      currentButton
                                    );
                                    let previousButton = currentButton
                                      ?.parentElement?.previousElementSibling
                                      ?.firstElementChild as HTMLElement;
                                    console.log(
                                      "next element sibling",
                                      previousButton
                                    );
                                    previousButton.focus();
                                    break;
                                  }
                                  case "ArrowDown":
                                  case "ArrowRight": {
                                    console.log("going down");
                                    console.log(
                                      "current active element",
                                      currentButton
                                    );
                                    let nextButton = currentButton
                                      ?.parentElement?.nextElementSibling
                                      ?.firstElementChild as HTMLElement;
                                    console.log(
                                      "next element sibling",
                                      nextButton
                                    );
                                    nextButton.focus();
                                    break;
                                  }
                                }
                              }}
                            >
                              <Markdown>{heading}</Markdown>
                            </Button>
                          </li>
                        );
                      })}
                    </>
                  )}
                </ul>
              </Col>
            </Collapse>
          </Row>
        </Container>
      </Col>
    </Row>
  );
};
