import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Carousel, Col, Row, Spinner } from "react-bootstrap";
import { useStoreActions, useStoreState } from "../../store";
import { Link } from "react-router-dom";
import {
  Demo,
  displayDemoKindName,
  getProgramKindIcon,
  resetVideo,
} from "../../model/discoverable-demos";
import classNames from "classnames";
import { CarouselRef } from "react-bootstrap/Carousel";
import { pathWithinApp } from "../../env-utils";

export const RecommendedDemos = () => {
  function RecommendedDemoCard({ recommendedDemo }: { recommendedDemo: Demo }) {
    const createProject = useStoreActions(
      (actions) => actions.projectFromDemoFlow.createProject
    );

    const isGame: boolean = recommendedDemo.demoKind === "game";
    const isSnippet: boolean = recommendedDemo.demoKind === "snippet";

    const linkRef = useRef<HTMLAnchorElement>(null);

    const [hover, setHover] = useState<boolean>(false);
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

    useEffect(() => {
      if (recommendedDemo.featuredImageUrl?.toLowerCase().startsWith("/")) {
        setImageSrc(pathWithinApp(recommendedDemo.featuredImageUrl));
      } else if (recommendedDemo.featuredImageUrl) {
        setImageSrc(recommendedDemo.featuredImageUrl);
      }
    }, [hover, recommendedDemo]);

    const cardRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const showVideo = hover && recommendedDemo.featuredVideoUrl;
    const showImage = !showVideo;

    function RecommendedDemoThumbnail() {
      return (
        <>
          {recommendedDemo.featuredVideoUrl ? (
            <video
              controls={false}
              autoPlay={true}
              muted={true}
              className={classNames("h-100 w-100 thumbnail-bg", {
                showVideo,
              })}
              onMouseOver={() => {
                setHover(true);
              }}
              onMouseOut={() => setHover(false)}
              controlsList="nofullscreen"
              ref={videoRef}
              tabIndex={-1}
            >
              <source src={recommendedDemo.featuredVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : null}
          <Card.Img
            variant={"top"}
            className={classNames("h-100 thumbnail-bg", { showImage })}
            src={imageSrc}
          />
        </>
      );
    }

    const handleMouseOverCard = () => {
      setHover(true);
      resetVideo(videoRef);
    };

    const handleMouseOutCard = () => {
      setHover(false);
    };

    const handleFocusCard = () => {
      setHover(true);
      resetVideo(videoRef);
    };

    const handleBlurCard = () => {
      setHover(false);
    };

    const programKindIcon = getProgramKindIcon(recommendedDemo.programKind);

    return (
      <Card
        className={"recommended-card flex-sm-row card"}
        ref={cardRef}
        onMouseOver={handleMouseOverCard}
        onMouseOut={handleMouseOutCard}
        onFocus={handleFocusCard}
        onBlur={handleBlurCard}
      >
        <Col
          xs={12}
          sm={6}
          md={6}
          className={
            "card-header-wrapper d-flex justify-content-center align-items-center p-1"
          }
        >
          <Card.Header className={"p-0 w-100 h-100"}>
            <RecommendedDemoThumbnail />
          </Card.Header>
        </Col>
        <Col xs={12} sm={6} md={6}>
          <Card.Body className={"p-3 px-4 d-flex flex-column"}>
            <Row className={"pill-row p-0 m-0 mb-3"}>
              <Button className={"pill-icon flat-icon"}>
                <img src={programKindIcon.src} alt={programKindIcon.alt} />
              </Button>

              <div
                className={classNames(
                  "ms-auto",
                  "pill-demo-kind",
                  { isGame },
                  { isSnippet }
                )}
              >
                <p>{displayDemoKindName(recommendedDemo.demoKind)}</p>
              </div>
            </Row>
            <Link
              ref={linkRef}
              to={""}
              onClick={() => createProject(recommendedDemo.slug)}
            >
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
              {recommendedIndex + 1}/{recommendedDemos?.length}
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
            {recommendedDemos?.map((recommendedDemo) => (
              <Carousel.Item>
                <RecommendedDemoCard recommendedDemo={recommendedDemo} />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      );
    }
    case "error":
    default:
      return (
        <>
          <h1>Problem</h1>
          <p>Sorry, there was a problem fetching the help information.</p>
        </>
      );
  }
};
