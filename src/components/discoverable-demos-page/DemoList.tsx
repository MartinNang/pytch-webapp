import React, { useEffect, useState } from "react";
import { NavBanner } from "../NavBanner";
import { EmptyProps } from "../../utils";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Placeholder,
  Row,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Demo, DemoCard, ProgramType, ProjectType } from "./DemoCard";
import { PaginationProvider } from "../PaginationProvider";
import { RecommendedDemos } from "./RecommendedDemos";

export enum SortingOptions {
  lastUpdated = "Last Updated",
  alphabetAsc = "A to Z",
}

/** See comments elsewhere about using wavy placeholders instead of a
 * simple spinner being a separate PR. */
function DemosContentSkeleton() {
  function DemoCardSkeleton() {
    return (
      <>
        <Card className={"flex-row flex-wrap card"}>
          <Card.Header className={"p-0 w-100"}>
            <Placeholder as={Card.Img} className={"h-100"} />
          </Card.Header>
          <Card.Body className={"p-4 py-3"}>
            <Placeholder
              xs={12}
              as={Card.Title}
              className={"placeholder rounded-1"}
              animation={"wave"}
              size={"lg"}
            />
            <Placeholder
              xs={12}
              as={Card.Subtitle}
              className={"placeholder rounded-1"}
              animation={"wave"}
            />
            <Placeholder
              xs={3}
              as={Card.Subtitle}
              className={"placeholder rounded-1"}
              animation={"wave"}
            />

            <Row className={"share-row mt-3"}>
              <Col xs={6} className={"align-items-end d-flex"}>
                <Placeholder
                  as={Card.Footer}
                  className={"w-100 placeholder rounded-1"}
                  animation={"wave"}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  }

  return (
    <>
      <Col xs={12} sm={6} lg={4} className={"mb-5"}>
        <DemoCardSkeleton />
      </Col>
      <Col xs={12} sm={6} lg={4} className={"mb-5"}>
        <DemoCardSkeleton />
      </Col>
      <Col xs={12} sm={6} lg={4} className={"mb-5"}>
        <DemoCardSkeleton />
      </Col>
      <Col xs={12} sm={6} lg={4} className={"mb-5"}>
        <DemoCardSkeleton />
      </Col>
      <Col xs={12} sm={6} lg={4} className={"mb-5"}>
        <DemoCardSkeleton />
      </Col>
      <Col xs={12} sm={6} lg={4} className={"mb-5"}>
        <DemoCardSkeleton />
      </Col>
    </>
  );
}

/** fetch() logic belongs in the model not the component. */

/** Use string literal union types not enum.  (There are a few old
 * places in the code where I still have enums but in general string
 * literal unions seem preferred.) */

/** Use stronger type than "string" where possible, e.g., for enum /
 * string literal union types. */

/** Use the same program-kind string literals as elsewhere, to avoid the
 * kludge for perMethod below.  In fact is demo.programKind.toString()
 * === "perMethod" possible, if the typing on demo.programKind is to be
 * believed? */

/** Don't use human-readable strings as enum values.  Makes i18n harder.
 * */

/** The data files for the demos need to live not in this repo.  There
 * needs to be some machinery to support a reasonable workflow for
 * publishing new demos. */

export const DemoList: React.FC<EmptyProps> = () => {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [sortedDemos, setSortedDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredDemos, setFilteredDemos] = useState(sortedDemos);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectType, setProjectType] = useState<string>(ProjectType.all);
  const [programType, setProgramType] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Last Updated");
  const [activePage, setActivePage] = useState(1);
  const [recommendedDemos, setRecommendedDemos] = useState<Demo[]>([]);

  useEffect(() => {
    document.title = "Pytch: Demos";
  });

  // Fetch JSON, parse into `demos`, `sortedDemos`, `filteredDemos` state.
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

  // Set `recommendedDemos` on change to `demos`.
  useEffect(() => {
    const r = demos.filter((demo: Demo) => demo.recommended === "true");
    setRecommendedDemos(r);
    console.log("set recommended demos to", r);
  }, [demos]);

  const paneRef = React.useRef<HTMLDivElement>(null);

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
          demo.programKind.toLowerCase() === programType.toLowerCase() ||
          (demo.programKind.toString() === "perMethod" &&
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

  /** Break this 150-line expression into pieces by creating local
   * components for each of the major parts.  The level of nesting is
   * also very high. */
  return (
    <>
      <NavBanner />
      <div className="DemoList" tabIndex={-1} ref={paneRef}>
        <div className={"demos-header pt-1 mb-2 border-bottom"}>
          <h1 className={"row pt-5"}>Demos</h1>
          <RecommendedDemos
            loading={loading}
            recommendedDemos={recommendedDemos}
          />
        </div>
        <div className={"demos-content"}>
          <Container>
            <Row className={"p-3"}>
              <Form className={"py-3"}>
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
                                  className={"project-type"}
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
                                  id={"search-field"}
                                  autoFocus={true}
                                  className={"w-100"}
                                  placeholder=""
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <Button
                                  id={"search-button"}
                                  className={"flex-shrink-1"}
                                >
                                  <FontAwesomeIcon
                                    icon={"search"}
                                    inverse={true}
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
              {loading ? (
                <DemosContentSkeleton />
              ) : (
                <>
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
                    <Col className={"no-results"}>
                      <p>No demos found.</p>
                    </Col>
                  ) : undefined}
                </>
              )}
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
