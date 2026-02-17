import React, {useEffect, useRef, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Button, Col, Collapse, Container, Placeholder, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import Markdown from 'react-markdown';
import {useLinkedDemo} from "./Junior/lesson/hooks";

export const DemoSidebar = () => {
  const maybeDemo = useLinkedDemo();
  const [md, setMd] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setMd(maybeDemo?.demo.chapters || "");
    if (maybeDemo?.demo) setLoading(false);
  }, [maybeDemo]);

  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [headings, setHeadings] = useState<string[] | null>(null);
  const [chapterContents, setChapterContents] = useState<string[] | null>(null);
    const [open, setOpen] = useState(true);

  /**
   * Parse markdown file by mapping every line of text to the previous
   * top level heading. Ignores lines of text written before the first heading.
   * @param markdown markdown text
   */
  function parseMarkdown(markdown: string) {
    let headingsMatch: RegExpMatchArray | null = markdown.match(/(?<=(^#)\s).*/gm);

    if (headingsMatch) {
      // TODO: should empty headings be ignored/filtered?
      let headings: string[] = headingsMatch?.filter((heading) => heading.length > 0);

      if (headings !== null) {
          let headingsIndex = 0;
          let content = [];
          let lines = markdown.split("\n");
          for (let linesIndex = 0; linesIndex < lines.length; linesIndex++) {
            let line = lines[linesIndex];
            if (line.startsWith("# " + headings[headingsIndex])) {
              headingsIndex++;
            } else if (headingsIndex > 0) {
              if (content[headingsIndex - 1]) {
                content[headingsIndex - 1] += line + "\n";
              } else {
                content[headingsIndex - 1] = line;
              }
            }
          }
          return {headings, res: content};
      }
    }
    return null;

  }

  useEffect(() => {
    let data = parseMarkdown(md || "");
    setHeadings(data?.headings || null);
    setChapterContents(data?.res || null);
  }, [md]);

    const chaptersRef =useRef<Array<HTMLLIElement | null>>([]);

    useEffect(() => {
      chaptersRef.current = chaptersRef.current.slice(0, headings?.length);
  }, [headings])


    useEffect(() => {
        console.log('scrolling?', chaptersRef);
        if (chaptersRef && chaptersRef.current) {
            console.log('scrolling into view', activeChapter, chaptersRef.current);
            chaptersRef?.current[activeChapter]?.scrollIntoView({behavior: "smooth", block: "start"});
        }
    }, [activeChapter]);

  return (
    <div className="DemoSidebar h-100" style={{ overflow: "auto" }}>
      <div className="content h-100">
        <div className="inner-content h-100">
          <Container className={"d-flex flex-column h-100"}>
            <Row
              className="demo-header d-flex justify-content-between align-items-center p-3"
              style={{ backgroundColor: "#306998" }}
            >
              <div className={"w-auto p-0 m-0 ps-2"}>
                <h1
                  style={{
                    fontSize: "1.1rem",
                    padding: 0,
                    margin: 0,
                    color: "#FFF792",
                  }}
                >
                  {maybeDemo?.demo.displayName}
                </h1>
              </div>
              <div className={"w-auto d-flex"}>
                <div
                  className={
                    "chapter-pill bg-white rounded-pill d-flex justify-content-center align-items-center"
                  }
                  style={{ padding: "5px 10px" }}
                >
                  <FontAwesomeIcon icon={"layer-group"} />
                  <span style={{ fontSize: "0.8rem", paddingLeft: 2 }}>
                    {activeChapter+1}/{headings?.length}
                  </span>
                </div>
                <Button
                    className={"w-auto bg-transparent p-0 border-0 ms-2"}
                    onClick={() => {
                      setOpen(!open);
                      console.log("switching to", !open);
                    }}
                    onFocus={() => chaptersRef.current[activeChapter]?.scrollIntoView({behavior: "smooth"})}
                >
                  <FontAwesomeIcon
                      icon={"caret-down"}
                      className={"nav-caret " + (open ? "nav-expanded" : "")}
                  />
                </Button>
              </div>
            </Row>
            <Row
              className={
                "demo-sub-header d-flex flex-row justify-content-between " + (maybeDemo?.demo.summaryMarkdown ? "p-3" : "p-2")
              }
            >
              <Col xs={11}
                className={"p-0 m-0"}
                style={{ color: "white", fontSize: "0.9rem" }}
              >
                  {
                    loading
                      ?
                        <Placeholder animation={"glow"}/>
                      :
                        maybeDemo?.demo.summaryMarkdown
                  }
              </Col>
            </Row>
            <Row className={"chapters-overview flex-row"} style={{}}>
              <Col className={"pe-0"}>
                <Container className={"pb-0 flex-column pe-0"}>
                  {headings?.length && headings.length > 1 ? (
                    <>
                      <Row className={"chapters-navigation"}>
                        <Collapse in={open} >
                          <Col className={"ps-4"}>
                            <ul className={"chapters m-0 p-0"} tabIndex={0}>
                              {headings?.map(
                                (heading: string, index: number) => {
                                  return (
                                    <li
                                      key={index}
                                      ref={(el) =>
                                        (chaptersRef.current[index] = el) || undefined
                                      }
                                      className={
                                        "w-100 py-0 px-3 rounded-3 chapter-navigation-link "
                                      }
                                      style={{
                                        top:
                                          headings.length === 2 ? "-6rem" : "",
                                      }}
                                    >
                                      <Link
                                        to={"#basic"}
                                        className={
                                          "py-2 px-3 rounded-3 d-inline-block mt-2 " +
                                          (index === activeChapter
                                            ? " active"
                                            : "")
                                        }
                                        onClick={() => setActiveChapter(index)}
                                        style={{
                                          color: "white",
                                          backgroundColor: "#00B5B0",
                                          textAlign: "start",
                                          border: "none",
                                        }}
                                      >
                                        <Markdown>{heading}</Markdown>
                                      </Link>
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </Col>
                        </Collapse>
                      </Row>
                    </>
                  ) : undefined}
                </Container>
              </Col>
            </Row>
            <Row className={"h-100"} style={{ backgroundColor: "#99E1DF", minHeight: 0 }}>
              <Container
                className={"chapter-content h-100 px-4 py-3 d-flex flex-column"}
                style={{borderTopLeftRadius: open ? "20px" : "0px", borderTopRightRadius: open ? "20px" : "0px", boxShadow: open ? "rgba(0, 0, 0, 0.12) 0px 3px 8px" : "none"}}
              >
                <Row className={"d-flex mb-3"}>
                  <div className={"w-50 flex-grow-1 align-items-center d-flex"}>
                    <h2 className={"w-100 m-0 chapter-heading"}>
                      {headings ? (
                        <div className={"d-flex flex-row"}>
                          <span className={"me-1"}>{activeChapter + 1}.</span>
                          <div className={"w-100"}>
                            {
                              loading ?
                                  <Placeholder animation={"glow"}/>
                                  :
                                  <Markdown>{headings[activeChapter]}</Markdown>
                            }
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </h2>
                  </div>
                  <div className={"w-auto chapter-navigation"}>
                    <Button
                      variant={"primary"}
                      onClick={() => {
                        if (headings?.length) {
                          let newActiveChapter = activeChapter - 1;
                          if (newActiveChapter < 0)
                            newActiveChapter = headings.length - 1;
                          setActiveChapter(newActiveChapter);
                        } else return 0;
                      }}
                    >
                      <FontAwesomeIcon
                        icon={"angle-right"}
                        color={"white"}
                        flip={"horizontal"}
                      />
                    </Button>
                    <Button
                      variant={"primary"}
                      className={"ms-1"}
                      onClick={() => {
                        if (headings?.length) {
                          let newActiveChapter = activeChapter + 1;
                          if (newActiveChapter >= headings.length)
                            newActiveChapter = 0;
                          setActiveChapter(newActiveChapter);
                        } else return 0;
                      }}
                    >
                      <FontAwesomeIcon icon={"angle-right"} color={"white"} />
                    </Button>
                  </div>
                </Row>
                <Row className={"flex-grow-1"} style={{minHeight: 0}}>
                  <Col className={"chapter-markdown h-100"} style={{  }}>
                    <Markdown>
                      {chapterContents ? chapterContents[activeChapter] : ""}
                    </Markdown>
                  </Col>
                </Row>
              </Container>
            </Row>
            <Row className={"demo-footer py-2 px-3 d-flex flex-row"}>
              <div className={"d-flex align-items-center flex-grow-1 w-auto"}>
                {
                  loading ?
                      <Placeholder animation={"glow"}/>
                      :
                      <p className={"mb-0"}>Published on {new Date(maybeDemo?.demo.lastUpdated || "").toLocaleDateString()}</p>
                }
              </div>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};
