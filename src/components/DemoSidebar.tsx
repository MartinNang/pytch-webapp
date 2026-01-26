import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Container, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";

export const DemoSidebar = () => {
  // useActionAsEffect(
  //   (actions) => actions.ideLayout.demoSidebar.maybeLoadContent
  // );

  return (
    <div className="DemoSidebar" style={{height: "100vh", overflow: "auto"}}>
      <div className="content">
        <div className="inner-content">
          <Container>
            <Row className="demo-header d-flex justify-content-between align-items-center p-3" style={{backgroundColor: "#306998"}}>
              <div className={"w-auto"}>
                <h1 style={{fontSize: "1rem"}}>Smooth Movement with Directional Keys</h1>
              </div>
              <div className={"w-auto"}>
                <div className={"chapter-pill"}>
                  <span>1/3</span>
                </div>
              </div>
            </Row>
            <Row className={"demo-sub-header"} style={{backgroundColor: "#265378"}}>
              <p>Three versions, all using W A S D for movement</p>
            </Row>
            <Row className={"chapters-overview flex-row"} style={{backgroundColor: "#99E1DF"}}>
              <Col>
                <Container>
                  <Row>
                    <Col xs={2}>
                    </Col>
                    <Col xs={10} className={"chapter-section active"} style={{backgroundColor: "#00B5B0"}}>
                      <Button style={{color: "white"}}>Basic</Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={2}>

                    </Col>
                    <Col xs={10} className={"chapter-section"}>
                      <Button>Stay on screen</Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={2}>

                    </Col>
                    <Col xs={10} className={"chapter-section"}>
                      <Button>Smoother movement</Button>
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
            <Row className={"chapter-content"}>
              <Container>
                <Row>
                  <Col>
                    <h2>Basics</h2>
                  </Col>
                  <Col>
                    <Button>
                      <FontAwesomeIcon icon={"arrow-left"} />
                    </Button>
                    <Button>
                      <FontAwesomeIcon icon={"arrow-right"} />
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p>Simple, but player can move off the screen.</p>
                    <p>Useful links</p>
                    <ul>
                      <li>
                        <a>PDFs</a>
                      </li>
                      <li>
                        <a>Drive link</a>
                      </li>
                    </ul>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h2>Linked projects</h2>
                    <Card>
                      <Card.Header>
                        <Card.Img></Card.Img>
                      </Card.Header>
                      <Card.Body>
                        <h3>Hello world!</h3>
                        <Row className={"pill-row"}>
                          <div className={"tutorial-pill"}>
                            <span>Tutorial</span>
                          </div>
                          <div className={"program-type-icon"}>
                            <img></img>
                          </div>
                        </Row>
                        <Row>
                          <p>
                            This tutorial will introduce you to the main ideas of
                            writing programs using Pytch.
                          </p>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <p>Published on 05.12.25</p>
                  </Col>
                  <Col>
                    <Button>
                      <FontAwesomeIcon icon={"share"} />
                      Share
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};
