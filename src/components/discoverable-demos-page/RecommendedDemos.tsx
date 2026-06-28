import React, { useRef } from "react";
import { Button, Card, Carousel, Col, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useStoreActions, useStoreState } from "../../store";
import { CarouselRef } from "react-bootstrap/Carousel";
import { assertNever } from "../../utils";
import { DemoCatalogueEntry } from "../../model/discoverable-demos-schema";
import { useDemoCardContext } from "./useDemoCardContext";

type RecommendedDemoCardProps = { demo: DemoCatalogueEntry };
const RecommendedDemoCard: React.FC<RecommendedDemoCardProps> = ({ demo }) => {
  const {
    cardEventHandlers,
    thumbnail,
    createProject,
    programKindIcon,
    demoKindName,
    demoKindClassName,
    absTimestamp,
  } = useDemoCardContext(demo);

  return (
    <Card
      className={"recommended-card flex-sm-row card"}
      {...cardEventHandlers}
    >
      <Col
        xs={12}
        sm={6}
        md={6}
        className={
          "card-header-wrapper d-flex justify-content-center align-items-center p-1"
        }
      >
        <Card.Header className={"p-0 w-100 h-100"}>{thumbnail}</Card.Header>
      </Col>
      <Col xs={12} sm={6} md={6}>
        <Card.Body className={"p-3 px-4 d-flex flex-column"}>
          <Row className={"pill-row p-0 m-0 mb-3"}>
            <Button className={"pill-icon flat-icon"}>
              <img src={programKindIcon.src} alt={programKindIcon.alt} />
            </Button>
            <div className={demoKindClassName}>
              <p>{demoKindName}</p>
            </div>
          </Row>
          <Link to={""} onClick={createProject}>
            <h3>{demo.displayName}</h3>
          </Link>
          <p className={"demo-description"}>{demo.summaryMarkdown}</p>
          <Row className={"footer-row"}>
            <Col xs={12} sm={6} className={"align-items-end d-flex"}>
              <p className={"m-0"}>{absTimestamp}</p>
            </Col>
          </Row>
        </Card.Body>
      </Col>
    </Card>
  );
};

export const RecommendedDemos = () => {
  const recommendedIndex = useStoreState(
    (state) => state.discoverableDemos.recommendedIndex
  );

  const setRecommendedIndex = useStoreActions(
    (actions) => actions.discoverableDemos.setRecommendedIndex
  );

  const carouselRef = useRef<CarouselRef>(null);

  const handleSelect = (selectedIndex: number) => {
    setRecommendedIndex(selectedIndex);
  };

  const contentFetchState = useStoreState(
    (state) => state.discoverableDemos.fetchedDemos.contentFetchState
  );

  switch (contentFetchState.state) {
    case "idle":
    case "requesting":
      return (
        <div
          className={
            "mx-auto mt-5 w-100 h-100 d-flex justify-content-center align-items-center"
          }
        >
          <div className="spinner-container">
            <Spinner animation="border" />
          </div>
        </div>
      );
    case "available": {
      const recommendedDemos = contentFetchState.content.recommendedDemos;
      return (
        <div className={"row demos-recommended mb-5"}>
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
            touch={true}
            slide={false}
            keyboard={true}
            className={"mb-5"}
            variant={"dark"}
            interval={null}
            ref={carouselRef}
          >
            {recommendedDemos.map((recommendedDemo) => (
              <Carousel.Item key={recommendedDemo.uuid}>
                <RecommendedDemoCard demo={recommendedDemo} />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      );
    }
    case "error":
      return (
        <>
          <h1>Problem</h1>
          <p>Sorry, there was a problem fetching the help information.</p>
        </>
      );
    default:
      return assertNever(contentFetchState);
  }
};
