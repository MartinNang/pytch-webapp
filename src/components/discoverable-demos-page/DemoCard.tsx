import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { useStoreActions } from "../../store";
import { Link } from "react-router-dom";
import {
  Demo,
  displayDemoKindName,
  getProgramKindIcon,
  resetVideo,
} from "../../model/discoverable-demos";
import { pathWithinApp } from "../../env-utils";
import classNames from "classnames";
import { useFocusContext } from "../hooks/focus-steering";
import { focusGroupItemClass } from "../../model/junior/grouped-focus";

type DemoCardProps = {
  demo: Demo;
};

export const DemoCard: React.FC<DemoCardProps> = ({ demo }) => {
  const createProject = useStoreActions(
    (actions) => actions.projectFromDemoFlow.createProject
  );

  const [hover, setHover] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (demo.featuredImageUrl?.toLowerCase().startsWith("/")) {
      setImageSrc(pathWithinApp(demo.featuredImageUrl));
    } else if (demo.featuredImageUrl) {
      setImageSrc(demo.featuredImageUrl);
    }
  }, [hover, demo]);

  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const setProgramKind = useStoreActions(
    (actions) => actions.discoverableDemos.searchFilters.setProgramKindSelector
  );

  const setDemoKind = useStoreActions(
    (actions) => actions.discoverableDemos.searchFilters.setDemoKindSelector
  );

  const searchForDemos = useStoreActions(
    (actions) => actions.discoverableDemos.searchForDemos
  );

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

  const programKindIcon = getProgramKindIcon(demo.programKind);

  const handleProgramKindPillClick = () => {
    setProgramKind(demo.programKind);
    searchForDemos();
  };

  const handleDemoKindPillClick = () => {
    setDemoKind(demo.demoKind);
    searchForDemos();
  };

  const isGame: boolean = demo.demoKind === "game";
  const isSnippet: boolean = demo.demoKind === "snippet";

  const focusContext = useFocusContext();
  const showVideo = hover && demo.featuredVideoUrl;
  const showImage = !showVideo;

  function DemoThumbnailContent() {
    return (
      <>
        {demo.featuredVideoUrl ? (
          <video
            controls={false}
            autoPlay={true}
            muted={true}
            className={classNames("h-100 w-100 object-fit-cover", {
              showVideo,
            })}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            controlsList="nofullscreen"
            ref={videoRef}
            tabIndex={-1}
          >
            <source src={demo.featuredVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : null}
        <Card.Img
          variant={"top"}
          className={classNames("h-100", { showImage })}
          src={imageSrc}
        />
      </>
    );
  }

  return (
    <Card
      className={focusGroupItemClass("flex-row flex-wrap card")}
      tabIndex={0}
      onMouseOver={handleMouseOverCard}
      onMouseOut={handleMouseOutCard}
      onFocus={handleFocusCard}
      onBlur={handleBlurCard}
      onClick={focusContext.onGroupItemClick}
      data-demo-slug={demo.slug}
      ref={cardRef}
    >
      <Card.Header className={"p-0 w-100"}>
        <Row className={"pill-row w-100 p-3 m-0"}>
          <Button
            className={"pill-icon"}
            onClick={handleProgramKindPillClick}
            tabIndex={-1}
          >
            <img src={programKindIcon.src} alt={programKindIcon.alt} />
          </Button>
          <Button
            className={classNames(
              "ms-auto",
              "pill-demo-kind",
              { isGame },
              { isSnippet }
            )}
            onClick={handleDemoKindPillClick}
            tabIndex={-1}
          >
            <p>{displayDemoKindName(demo.demoKind)}</p>
          </Button>
        </Row>
        <div className={"thumbnail-wrapper"}>
          <div className={"thumbnail"}>
            <DemoThumbnailContent />
          </div>
        </div>
      </Card.Header>
      <Card.Body className={"p-4 py-3"}>
        <Link
          to={""}
          onClick={(event) => {
            createProject(demo.slug);
            focusContext.onGroupItemClick(event);
          }}
          tabIndex={-1}
        >
          <h3>{demo.displayName}</h3>
        </Link>
        <p>{demo.summaryMarkdown}</p>

        <Row className={"share-row"}>
          <Col xs={12} sm={12} md={6} className={"align-items-end d-flex"}>
            <p className={"m-0"}>
              {new Date(demo.lastUpdated).toLocaleDateString()}
            </p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
