import React, { useState } from "react";
import { Card, Carousel, Col, Placeholder, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Demo, ProgramType, ProjectType } from "./DemoCard";
import { useStoreActions } from "../../store";
import flatIcon from "../../images/flat-simple.png";
import permethodIcon from "../../images/per-method-simple.png";
import { Link } from "react-router-dom";

export const RecommendedDemos = ({
  loading,
  recommendedDemos,
}: {
  loading: boolean;
  recommendedDemos: Demo[];
}) => {
  function RecommendedDemoCardSkeleton() {
    return (
      <Card className={"recommended-card flex-sm-row card"}>
        <Col xs={12} sm={5} md={4}>
          <Card.Header className={"p-0 me-1 w-100 h-100"}>
            <Placeholder as={Card.Img} className={"h-100 loading"} />
          </Card.Header>
        </Col>
        <Col xs={12} sm={7} md={8}>
          <Card.Body className={"p-3 px-4 d-flex flex-column"}>
            <Placeholder
              as={Card.Title}
              className={"mb-3 placeholder rounded-1"}
              animation={"wave"}
              size={"lg"}
            />
            <Placeholder
              as={Card.Subtitle}
              className={"demo-description placeholder rounded-1"}
              animation={"wave"}
            />
            <Row className={"footer-row mt-5"}>
              <Col xs={12} sm={6} className={"align-items-end d-flex"}>
                <Placeholder
                  xs={12}
                  className={"mt-3 rounded-1 placeholder"}
                  animation={"wave"}
                />
              </Col>
            </Row>
          </Card.Body>
        </Col>
      </Card>
    );
  }

  function RecommendedDemoCard({ recommendedDemo }: { recommendedDemo: Demo }) {
    const createProject = useStoreActions(
      (actions) => actions.projectFromDemoFlow.createProject
    );

    return (
      <Card className={"recommended-card flex-sm-row card"}>
        <Col xs={12} sm={5} md={4}>
          <Card.Header className={"p-0 me-1 w-100 h-100"}>
            <Card.Img
              variant={"top"}
              className={"h-100 object-fit-cover p-1"}
              src={recommendedDemo.featuredImage}
            />
          </Card.Header>
        </Col>
        <Col xs={12} sm={7} md={8}>
          <Card.Body className={"p-3 px-4 d-flex flex-column"}>
            <Row className={"pill-row p-0 m-0 mb-3"}>
              {
                recommendedDemo.programKind ===
                ProgramType.flat.toLowerCase() ? (
                  <div className={"pill-icon flat-icon"}>
                    <img src={flatIcon} alt={"flat project"} />
                  </div>
                ) : (
                  <div className={"pill-icon per-method-icon"}>
                    <img src={permethodIcon} alt={"per-method project"} />
                  </div>
                )
              }

              <div
                className={
                  "ms-auto pill-project-type " +
                  (recommendedDemo.projectType === ProjectType.game
                    ? "game-pill"
                    : "snippet-pill")
                }
              >
                <p>
                  {recommendedDemo.projectType[0].toUpperCase() +
                    recommendedDemo.projectType.slice(1)}
                </p>
              </div>
            </Row>
            <Link to={""} onClick={() => createProject(recommendedDemo.slug)}>
              <h3 style={{ fontWeight: "bold" }}>
                {recommendedDemo.displayName}
              </h3>
            </Link>
            <p className={"demo-description"}>
              {recommendedDemo.summaryMarkdown}
            </p>
            <Row className={"footer-row"}>
              <Col xs={12} sm={6} className={"align-items-end d-flex"}>
                <p className={"m-0"}>
                  {new Date(recommendedDemo.lastUpdated).toLocaleDateString()}
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Col>
      </Card>
    );
  }

  const [recommendedIndex, setRecommendedIndex] = useState(0);

  const handleSelect = (selectedIndex: number) => {
    setRecommendedIndex(selectedIndex);
  };

  return (
    <>
      <div className={"row demos-recommended"}>
        <Row className={"pt-5 justify-content-between mb-3"}>
          <h2 className={"w-auto m-0"}>Recommended</h2>
          <p className={"w-auto m-0 mt-auto"}>
            {recommendedIndex + 1}/{recommendedDemos.length}
          </p>
        </Row>
        <Carousel
          activeIndex={recommendedIndex}
          onSelect={handleSelect}
          fade
          className={"mb-5"}
          variant={"dark"}
        >
          {loading ? (
            <Carousel.Item>
              <RecommendedDemoCardSkeleton />
            </Carousel.Item>
          ) : (
            recommendedDemos.map((recommendedDemo) => (
              <Carousel.Item>
                <RecommendedDemoCard recommendedDemo={recommendedDemo} />
              </Carousel.Item>
            ))
          )}
        </Carousel>
      </div>
    </>
  );
};
