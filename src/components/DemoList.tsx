import React, { useEffect, useState } from "react";
import { NavBanner } from "./NavBanner";
import { EmptyProps } from "../utils";
import {
  Button,
  Card,
  Carousel,
  Col,
  Container,
  Form, Placeholder,
  Row,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import flatIcon from "../images/flat-simple.png";
import permethodIcon from "../images/per-method-simple.png";
import { Link } from "react-router-dom";
import { Demo, DemoCard, ProgramType, ProjectType } from "./DemoCard";
import {PaginationProvider} from "./PaginationProvider";
import { useStoreActions } from "../store";

export enum SortingOptions {
    lastUpdated = "Last Updated",
    alphabetAsc ="A to Z"
}

function RecommendedDemoCardSkeleton() {
  return (
    <Card className={"recommended-card flex-sm-row card"}>
      <Col xs={12} sm={5} md={4}>
        <Card.Header className={"p-0 me-1 w-100 h-100"}>
          <Placeholder as={Card.Img} className={"h-100"} />
        </Card.Header>
      </Col>
      <Col xs={12} sm={7} md={8}>
        <Card.Body className={"p-3 px-4 d-flex flex-column"}>
          <Placeholder as={Card.Title} className={"mb-3 placeholder rounded-1"} animation={"wave"} size={"lg"}/>
          <Placeholder as={Card.Subtitle} className={"demo-description placeholder rounded-1"} animation={"wave"}/>
          <Row className={"footer-row"}>
            <Col
              xs={12}
              sm={6}
              className={"align-items-end d-flex"}
            >
              <Placeholder xs={12} className={"mt-3 rounded-1"}/>
            </Col>
          </Row>
        </Card.Body>
      </Col>
    </Card>
  );
}

function RecommendedDemoCard({ recommendedDemo } : {recommendedDemo: Demo}) {
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
            {recommendedDemo.programType ===
            ProgramType.flat ? (
              <div className={"pill-icon flat-icon"}>
                <img src={flatIcon} alt={"flat project"} />
              </div>
            ) : (
              <div className={"pill-icon per-method-icon"}>
                <img
                  src={permethodIcon}
                  alt={"per-method project"}
                />
              </div>
            )}

            <div
              className={
                "pill-project-type " +
                (recommendedDemo.projectType ===
                ProjectType.game
                  ? "game-pill"
                  : "snippet-pill")
              }
            >
              <p>
                {recommendedDemo.projectType[0].toUpperCase() +
                  recommendedDemo.projectType.slice(1)}
              </p>
            </div>
            {recommendedDemo.isGroup && (
              <div
                className={
                  "pill-project-type group-pill ms-auto p-1"
                }
              >
                <FontAwesomeIcon icon={"layer-group"} />
              </div>
            )}
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
            <Col
              xs={12}
              sm={6}
              className={"align-items-end d-flex"}
            >
              <p className={"m-0"}>
                {new Date(
                  recommendedDemo.lastUpdated
                ).toLocaleDateString()}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Col>
    </Card>
  );
}

export const DemoList: React.FC<EmptyProps> = () => {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [sortedDemos, setSortedDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = "Pytch: Demos";
  });

  useEffect(() => {
    async function getDemos() {
      await fetch("/data/demos/demos.json").then((res) =>
        res.json().then((data: Demo[]) => {
          console.log("data", data);
          setDemos(data);
          const sorted = data.sort((a, b) => {
            return (
              new Date(b.lastUpdated).getTime() -
              new Date(a.lastUpdated).getTime()
            );
          });
          console.log("sorted", sorted);
          setSortedDemos(sorted);
          setFilteredDemos(data);
          setLoading(false);
        })
      );
    }
    getDemos();
  }, []);

  useEffect(() => {
    const r = demos.filter((demo: Demo) => demo.recommended === "true");
    setRecommendedDemos(r);
    console.log("set recommended demos to", r);
  }, [demos]);

  const paneRef = React.useRef<HTMLDivElement>(null);

  const [filteredDemos, setFilteredDemos] = useState(sortedDemos);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectType, setProjectType] = useState<string>(ProjectType.all);
  const [programType, setProgramType] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Last Updated");
  const [recommendedIndex, setRecommendedIndex] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [recommendedDemos, setRecommendedDemos] = useState<Demo[]>([]);

  const handleSelect = (selectedIndex: number) => {
    setRecommendedIndex(selectedIndex);
  };

  function handleSearch(): void {
    let searchResults = [...sortedDemos];

    if (searchTerm.length > 0) {
      searchResults = searchResults.filter((demo) =>
        demo.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (projectType.toLowerCase() !== ProjectType.all.toLowerCase()) {
      console.log("searching for project type", projectType.toString());
      searchResults = searchResults.filter((demo) => {
        console.log("found project type", demo.projectType);
        return projectType
          ?.toLowerCase()
          .includes(demo.projectType.toLowerCase());
      });
    }

    if (programType?.length > 0 && programType !== "Program type") {
      searchResults = searchResults.filter((demo) => {
        return (
          demo.programType.toLowerCase() === programType.toLowerCase() ||
          (demo.programType.toString() === "perMethod" &&
            programType === "Per-method")
        );
      });
    }

    if (sortBy.toLowerCase() === SortingOptions.alphabetAsc.toLowerCase()) {
      console.log("sorting by alphabet");
      searchResults = searchResults.sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
      );
    } else {
      console.log("sorting by date");
      searchResults = searchResults.sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
    }
    setFilteredDemos(searchResults);
  }

  useEffect(() => {
    handleSearch();
  }, [searchTerm, programType, projectType, sortBy]);

  const itemsPerPage = 10;

  return (
    <>
      <NavBanner />
      <div className="DemoList" tabIndex={-1} ref={paneRef}>
        <div
          className={
            "demos-header w-100 pt-1 mb-2 border-bottom d-flex flex-column justify-content-center align-items-center"
          }
        >
          <h1 className={"row pt-5 justify-content-center w-100"}>Demos</h1>
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
                  <RecommendedDemoCardSkeleton/>
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
        </div>
        <div className={"demos-content d-flex flex-column w-100"}>
          <Container>
            <Row className={"p-3"}>
              <Form className={"d-flex flex-row py-3"}>
                <Container>
                  <Row className={"d-flex"}>
                    <Col xs={12} md={5} className={"px-0"}>
                      <Form.Group className="mb-3">
                        <Form.Label visuallyHidden={true}>Search</Form.Label>
                        <Container>
                          <Row>
                            <div className="d-flex p-0">
                              <div>
                                <Form.Select
                                  key={"ProjectType"}
                                  value={projectType}
                                  style={{
                                    borderRadius: "10px",
                                    borderTopRightRadius: "0",
                                    borderBottomRightRadius: "0",
                                    borderRight: "none",
                                    minWidth: "4rem",
                                    borderColor: "#8B8B8B",
                                  }}
                                  onChange={(e) => {
                                    console.log("e", e.target.value);
                                    setProjectType(e.target.value);
                                  }}
                                >
                                  {Object.values(ProjectType).map(
                                    (projectType) => (
                                      <option>{projectType}</option>
                                    )
                                  )}
                                </Form.Select>
                              </div>
                              <div className="flex-grow-1">
                                <Form.Control
                                  key={"searchField"}
                                  autoFocus={true}
                                  className={"w-100"}
                                  placeholder=""
                                  value={searchTerm}
                                  style={{
                                    borderRadius: "0",
                                    borderRight: "none",
                                    borderColor: "#8B8B8B",
                                  }}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                />
                              </div>
                              <div className="">
                                <Button
                                  className={"flex-shrink-1"}
                                  style={{
                                    borderRadius: "10px",
                                    borderColor: "#8B8B8B",
                                    borderLeft: "none",
                                    borderTopLeftRadius: "0",
                                    borderBottomLeftRadius: "0",
                                    background: "none",
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={"search"}
                                    inverse={true}
                                    style={{ color: "black" }}
                                  />
                                </Button>
                              </div>
                            </div>
                          </Row>
                        </Container>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={7} className={"ms-auto"}>
                      <Row>
                        <Form.Group className={"w-auto ms-auto"}>
                          <Form.Label visuallyHidden={true}>
                            Program type
                          </Form.Label>
                          <Form.Select
                            key={"programType"}
                            className={"border-0"}
                            value={programType}
                            onChange={(e) => {
                              console.log("programType", e.target.value);
                              setProgramType(e.target.value);
                            }}
                          >
                            <option hidden={false}>Program type</option>
                            {Object.values(ProgramType).map((programType) => (
                              <option>{programType}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className={"w-auto"}>
                          <Form.Label visuallyHidden={true}>Sort by</Form.Label>
                          <Form.Select
                            className={"border-0"}
                            value={sortBy}
                            onChange={(e) => {
                              setSortBy(e.target.value);
                            }}
                          >
                            <option>Last Updated</option>
                            <option>A to Z</option>
                          </Form.Select>
                        </Form.Group>
                      </Row>
                    </Col>
                  </Row>
                </Container>
              </Form>
            </Row>
            <Row className={"p-3"}>
              {filteredDemos
                .slice(
                  (activePage - 1) * itemsPerPage,
                  activePage * itemsPerPage
                )
                .map((demo) => (
                  <Col xs={12} sm={6} lg={4} className={"mb-5"}>
                    <DemoCard
                      demo={demo}
                      setProjectType={setProjectType}
                      setProgramType={setProgramType}
                    />
                  </Col>
                ))}
              {filteredDemos.length === 0 ? (
                <Col
                  className={
                    "d-flex justify-content-center align-items-center no-results"
                  }
                >
                  <p>No demos found.</p>
                </Col>
              ) : undefined}
            </Row>
          </Container>

          <PaginationProvider
            activePage={activePage}
            setActivePage={setActivePage}
            list={filteredDemos}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </>
  );
};


