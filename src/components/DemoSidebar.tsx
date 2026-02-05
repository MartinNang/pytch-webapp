import React, {useEffect, useRef, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Button, Col, Collapse, Container, Row} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import {Link, useParams} from "react-router-dom";
import Markdown from 'react-markdown';
import demos from '../data/demos.json';

export const DemoSidebar = () => {
    // get slug parameter from url or component parameter
  const slug = useParams().demoIdString;

  const [md, setMd] = useState<string>("");
  fetch(`../src/assets/demos/${slug}/${slug}.md`)
    .then(r => r.text())
    .then(text => {
      console.log('text decoded:', text);
      setMd(text);
    });

  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [headings, setHeadings] = useState<string[] | null>(null);
  const [chapterContents, setChapterContents] = useState<string[] | null>(null);
    const [open, setOpen] = useState(true);

        // find and set demo
        const foundDemo = demos.find((d) => d.slug === slug);
        console.log("found demo", foundDemo);

  function getTopLevelHeadings(label: string) {
    let headings: RegExpMatchArray | null = label.match(/(?<=(^#)\s).*/gm);
    console.log('top level headings: ', headings);
    // TODO: should empty headings be ignored/filtered?
    let headingsStrings;
    if (headings !== null) headingsStrings = headings?.filter((heading) => heading.length > 0);
    else headingsStrings = headings;

    if (headingsStrings !== null) {
      let j = 0;
      let res = [];
      let lines = label.split("\n");
      // for every line in md
        for (let i = 0; i < lines.length; i++) {
          let line = lines[i];
          // if line contains heading
          if (line.startsWith("# " + headingsStrings[j])) {
            // copy every line until next heading is found or EOF
            j++;
          } else if (j > 0) {
            if (res[j - 1]) {
              res[j - 1] += line + "\n";
            } else {
              res[j - 1] = line;
            }
          }
        }
      console.log('probably not', {headingsStrings, res})
      return {headingsStrings, res};

    }
    return null;

  }

  useEffect(() => {
    let data = getTopLevelHeadings(md);
    setHeadings(data?.headingsStrings || null);
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
              <div className={"w-auto p-0 m-0"}>
                <h1
                  style={{
                    fontSize: "1.1rem",
                    padding: 0,
                    margin: 0,
                    color: "#FFF792",
                  }}
                >
                  {foundDemo?.displayName}
                </h1>
              </div>
              <div className={"w-auto"}>
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
              </div>
            </Row>
            <Row
              className={
                "demo-sub-header p-3 d-flex flex-row justify-content-between"
              }
            >
              <Col xs={11}
                className={"p-0 m-0"}
                style={{ color: "white", fontSize: "0.9rem" }}
              >
                  {foundDemo?.summaryMarkdown}
              </Col>
                <Col xs={1} className={"ms-auto d-flex align-items-center justify-content-end"}>
                    <Button
                        className={"w-auto bg-transparent p-0 border-0"}
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
                            <Markdown>{headings[activeChapter]}</Markdown>
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
                <Row className={"linked-projects"}>
                  <Col>
                    <hr />
                    <h2>Linked projects</h2>
                    <Card className={"d-flex flex-row"}>
                      <Col xs={5}>
                        <Card.Header
                          className={
                            "d-flex align-items-center justify-content-center"
                          }
                        >
                          <Card.Img
                            className={"h-100 object-fit-contain"}
                            src={
                              "https://www.pytch.org/tutorials/9cfcca8136e43ebf04be/script-by-script-hello/tutorial-assets/screenshot.png"
                            }
                          ></Card.Img>
                        </Card.Header>
                      </Col>
                      <Col>
                        <Card.Body>
                          <Link to={"#"}>
                            <h3>Hello world!</h3>
                          </Link>
                          <Row className={"pill-row ms-0"}>
                            <div className={"tutorial-pill w-auto"}>
                              <span>Tutorial</span>
                            </div>
                            <div className={"program-type-icon w-auto"}>
                              <img></img>
                            </div>
                          </Row>
                          <Row>
                            <p>
                              This tutorial will introduce you to the main ideas
                              of writing programs using Pytch.
                            </p>
                          </Row>
                        </Card.Body>
                      </Col>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </Row>
            <Row className={"demo-footer py-2 px-3 d-flex flex-row"}>
              <div className={"d-flex align-items-center flex-grow-1 w-auto"}>
                <p className={"mb-0"}>Published on {new Date(foundDemo?.lastUpdated || "").toLocaleDateString()}</p>
              </div>
              <div className={"w-auto"}>
                <Button className={"share-button"}>
                  <FontAwesomeIcon icon={"share"} />
                  Share
                </Button>
              </div>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};
