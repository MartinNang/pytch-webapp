import { Button, Col, Container, Placeholder, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Markdown from "react-markdown";
import React, { useEffect, useRef, useState } from "react";

export const DemoChapter = ({
  activeChapter,
  loading,
  headings,
  setActiveChapter,
  navigationOpen,
  chapterContents,
}: {
  activeChapter: number;
  loading: boolean;
  headings: string[] | null;
  setActiveChapter: (ac: number) => void;
  navigationOpen: boolean;
  chapterContents: string[] | null;
}) => {
  const navPrevChapterRef = useRef<HTMLButtonElement | null>(null);
  const navNextChapterRef = useRef<HTMLButtonElement | null>(null);

  const [leftButtonPressed, setLeftButtonPressed] = useState<boolean>(false);
  const [rightButtonPressed, setRightButtonPressed] = useState<boolean>(false);

  useEffect(() => {
    console.log("focus on prev", navPrevChapterRef.current);
    navPrevChapterRef.current?.focus();
  }, [leftButtonPressed]);

  useEffect(() => {
    console.log("focus on next", navNextChapterRef.current);
    navNextChapterRef.current?.focus();
  }, [rightButtonPressed]);

  function PlaceholderChapter() {
    return (
      <>
        <Placeholder
          xs={12}
          className={"rounded-1 placeholder-wave"}
          size={"sm"}
        />
        <Placeholder
          xs={12}
          className={"rounded-1 placeholder-wave"}
          size={"sm"}
        />
        <Placeholder
          xs={5}
          className={"rounded-1 placeholder-wave"}
          size={"sm"}
        />
        <br />
        <br />
        <Placeholder
          xs={12}
          className={"rounded-1 placeholder-wave"}
          size={"sm"}
        />
        <Placeholder
          xs={12}
          className={"rounded-1 placeholder-wave"}
          size={"sm"}
        />
        <Placeholder
          xs={12}
          className={"rounded-1 placeholder-wave"}
          size={"sm"}
        />
        <Placeholder
          xs={12}
          className={"rounded-1 placeholder-wave"}
          size={"sm"}
        />
        <Placeholder
          xs={1}
          className={"rounded-1 placeholder-wave"}
          size={"sm"}
        />
      </>
    );
  }

  function PlaceholderChapterNavigation() {
    return (
      <>
        <Placeholder.Button
          variant={"primary"}
          className={"me-1 placeholder-glow"}
        />
        <Placeholder.Button
          variant={"primary"}
          className={"placeholder-glow"}
        />
      </>
    );
  }

  function DemoChapterNavigation() {
    function handlePrevChapterClicked() {
      if (headings?.length) {
        let newActiveChapter = activeChapter - 1;
        if (newActiveChapter < 0) newActiveChapter = headings.length - 1;
        console.log("new active chapter", newActiveChapter);
        setActiveChapter(newActiveChapter);
        setLeftButtonPressed(!leftButtonPressed);
      } else return 0;
    }

    function handleFocusOnPrevChapter() {
      console.log("focusing on prev button");
      let currentButton = document.activeElement;
      let prevButton = currentButton?.previousElementSibling as HTMLElement;
      prevButton?.focus();
    }

    function handleNextChapterClicked() {
      if (headings?.length) {
        let newActiveChapter = activeChapter + 1;
        console.log("new active chapter", newActiveChapter);
        if (newActiveChapter >= headings.length) newActiveChapter = 0;
        setActiveChapter(newActiveChapter);
        setRightButtonPressed(!rightButtonPressed);
      } else return 0;
    }

    function handleFocusOnNextChapter() {
      console.log("focusing on next chapter button");
      let currentButton = document.activeElement;
      let nextButton = currentButton?.nextElementSibling as HTMLElement;
      nextButton?.focus();
    }

    return (
      <>
        <Button
          key={"prev-chapter"}
          ref={navPrevChapterRef}
          variant={"primary"}
          onClick={handlePrevChapterClicked}
          onKeyDown={(e) => {
            switch (e.key) {
              case "ArrowDown":
              case "ArrowRight": {
                e.preventDefault();
                handleFocusOnNextChapter();
                break;
              }
              case "ArrowLeft":
              case "ArrowUp":
                e.preventDefault();
                break;
            }
          }}
        >
          <FontAwesomeIcon
            icon={"angle-right"}
            color={"white"}
            flip={"horizontal"}
          />
        </Button>
        <Button
          key={"next-chapter"}
          tabIndex={-1}
          ref={navNextChapterRef}
          variant={"primary"}
          className={"ms-1"}
          onClick={handleNextChapterClicked}
          onKeyDown={(e) => {
            switch (e.key) {
              case "ArrowUp":
              case "ArrowLeft": {
                e.preventDefault();
                handleFocusOnPrevChapter();
                break;
              }
              case "ArrowDown":
              case "ArrowRight":
                e.preventDefault();
                break;
            }
          }}
        >
          <FontAwesomeIcon icon={"angle-right"} color={"white"} />
        </Button>
      </>
    );
  }

  return (
    <Row
      className={"h-100"}
      style={{ backgroundColor: "#99E1DF", minHeight: 0 }}
    >
      <Container
        className={"chapter-content px-4 pt-3"}
        style={{
          borderTopLeftRadius: navigationOpen ? "20px" : "0px",
          borderTopRightRadius: navigationOpen ? "20px" : "0px",
          boxShadow: navigationOpen
            ? "rgba(0, 0, 0, 0.12) 0px 3px 8px"
            : "none",
        }}
      >
        <Row className={"mb-3"}>
          <div className={"w-50 flex-grow-1 align-items-center d-flex"}>
            <h2 className={"chapter-heading"}>
              <div className={"d-flex flex-row"}>
                <div className={"w-100"}>
                  {loading ? (
                    <Placeholder
                      xs={12}
                      className={"rounded-1 placeholder-wave"}
                    />
                  ) : (
                    <>
                      {headings ? (
                        <>
                          {headings?.length > 1 ? (
                            <span className={"me-1"}>{activeChapter + 1}.</span>
                          ) : undefined}
                          <span>
                            <Markdown
                              components={{
                                p(props) {
                                  return <span>{props.children}</span>;
                                },
                              }}
                            >
                              {headings[activeChapter]}
                            </Markdown>
                          </span>
                        </>
                      ) : undefined}
                    </>
                  )}
                </div>
              </div>
            </h2>
          </div>
          {(headings && headings?.length > 1) || loading ? (
            <div className={"w-auto chapter-navigation"}>
              {loading ? (
                <PlaceholderChapterNavigation />
              ) : (
                <DemoChapterNavigation />
              )}
            </div>
          ) : undefined}
        </Row>
        <Row className={"flex-grow-1"} style={{ minHeight: 0 }}>
          <Col className={"chapter-markdown"}>
            {loading ? (
              <PlaceholderChapter />
            ) : (
              <Markdown>
                {chapterContents ? chapterContents[activeChapter] : ""}
              </Markdown>
            )}
          </Col>
        </Row>
      </Container>
    </Row>
  );
};
