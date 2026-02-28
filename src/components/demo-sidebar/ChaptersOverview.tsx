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
