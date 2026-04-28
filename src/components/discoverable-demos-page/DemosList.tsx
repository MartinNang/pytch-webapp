import React, { useEffect, useRef, useState } from "react";
import { NavBanner } from "../NavBanner";
import { assertNever, EmptyProps, mDataAttrStringValue } from "../../utils";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DemoCard } from "./DemoCard";
import { PaginationProvider } from "../PaginationProvider";
import { RecommendedDemos } from "./RecommendedDemos";
import {
  kDemoKindValues,
  DemoKindSelector,
  discoverableDemos,
  displayDemoKindName,
  displayProgramKindName,
  displaySortByName,
  PytchProgramKindSelector,
  SortBy,
  kSortByValues,
} from "../../model/discoverable-demos";
import { useStoreActions, useStoreState } from "../../store";
import { kPytchProgramKindValues } from "../../model/pytch-program";
import { FocusGroupContainer } from "../FocusGroupContainer";
import { createFocusContext, FocusContext } from "../hooks/focus-steering";

/** TODO The data files for the demos need to live not in this repo.  There
 * needs to be some machinery to support a reasonable workflow for
 * publishing new demos. */

export const DemosList: React.FC<EmptyProps> = () => {
  const focusContext = createFocusContext("my-projects-list");

  const maybeLoadContent = useStoreActions(
    (actions) => actions.discoverableDemos.fetchedDemos.maybeLoadContent
  );

  useEffect(() => {
    maybeLoadContent();
  }, []);

  const contentFetchState = useStoreState(
    (state) => state.discoverableDemos.fetchedDemos.contentFetchState
  );
  const searchFilters = useStoreState(
    (state) => state.discoverableDemos.searchFilters
  );
  const sortBy = useStoreState((state) => state.discoverableDemos.sortBy);
  const setSearchTerm = useStoreActions(
    (actions) => actions.discoverableDemos.searchFilters.setSearchTerm
  );
  const setSortBy = useStoreActions(
    (actions) => actions.discoverableDemos.setSortBy
  );
  const setProgramKindSelector = useStoreActions(
    (actions) => actions.discoverableDemos.searchFilters.setProgramKindSelector
  );
  const setDemoKindSelector = useStoreActions(
    (actions) => actions.discoverableDemos.searchFilters.setDemoKindSelector
  );
  const searchForDemos = useStoreActions(
    (actions) => actions.discoverableDemos.searchForDemos
  );

  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    document.title = "Pytch: Demos";
  });

  useEffect(() => {
    searchTermRef?.current?.focus();
  }, [searchFilters.searchTerm]);

  const paneRef = React.useRef<HTMLDivElement>(null);

  const itemsPerPage = 10;

  const searchTermRef = useRef<HTMLInputElement>(null);
  const programKindRef = useRef<HTMLSelectElement>(null);
  const demoKindRef = useRef<HTMLSelectElement>(null);
  const sortByRef = useRef<HTMLSelectElement>(null);

  function handleChangeProgramKind() {
    if (programKindRef.current) {
      setProgramKindSelector(
        (programKindRef.current.value as PytchProgramKindSelector) || "all"
      );
      searchForDemos();
    }
  }

  function DemosHeader() {
    return (
      <div className={"demos-header pt-1 mb-2 border-bottom"}>
        <h1 className={"row pt-5"}>Demos</h1>
        <RecommendedDemos />
      </div>
    );
  }

  function DemosContent() {
    return (
      <Container>
        <Row className={"p-3"}>
          <DemosSearch />
        </Row>
        <Row className={"p-3"}>
          <DemosResults />
        </Row>
      </Container>
    );
  }

  function DemosSearch() {
    function handleChangeSortBy() {
      if (sortByRef.current) {
        setSortBy(sortByRef?.current?.value as SortBy);
        searchForDemos();
      }
    }

    return (
      <>
        <Form className={"py-3"}>
          <Container className={"p-0"}>
            <Row className={"d-flex"}>
              <Col xs={12} md={5} className={"px-0"}>
                <DemosSearchField />
              </Col>
              <Col xs={12} md={7} className={"ms-auto"}>
                <Row>
                  <Form.Group
                    className={"w-auto ms-auto"}
                    controlId={"formProgramType"}
                  >
                    <Form.Label visuallyHidden={true}>Program type</Form.Label>
                    <Form.Select
                      aria-label="Program type"
                      className={"border-0"}
                      onInputCapture={handleChangeProgramKind}
                      ref={programKindRef}
                    >
                      <option value={"all"}>Program type</option>
                      {kPytchProgramKindValues.map((programKind) => (
                        <option
                          key={programKind}
                          selected={
                            programKind === searchFilters.programKindSelector
                          }
                          value={programKind}
                        >
                          {displayProgramKindName(programKind)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className={"w-auto"}>
                    <Form.Label visuallyHidden={true}>Sort by</Form.Label>
                    <Form.Select
                      aria-label="Sort by"
                      className={"border-0"}
                      onInputCapture={handleChangeSortBy}
                      value={sortBy}
                      ref={sortByRef}
                    >
                      {Object.values(kSortByValues).map((sortingOption) => (
                        <option
                          key={sortingOption}
                          selected={sortingOption === discoverableDemos.sortBy}
                          value={sortingOption}
                        >
                          {displaySortByName(sortingOption)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Row>
              </Col>
            </Row>
          </Container>
        </Form>
      </>
    );
  }

  function DemosResults() {
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
        const demosContent = contentFetchState.content;

        return (
          <>
            {demosContent.searchResults
              .slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage)
              .map((demo) => (
                <Col key={demo.uuid} xs={12} sm={6} lg={4} className={"mb-5"}>
                  <DemoCard demo={demo} />
                </Col>
              ))}
            {demosContent.searchResults.length === 0 ? (
              <Col className={"no-results"}>
                <p>No demos found.</p>
              </Col>
            ) : undefined}
            <PaginationProvider
              activePage={activePage}
              setActivePage={setActivePage}
              nItems={demosContent.searchResults.length}
              itemsPerPage={itemsPerPage}
            />
          </>
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
  }

  function handleChangeSearchTerm() {
    setSearchTerm(searchTermRef?.current?.value || "");
    searchForDemos();
  }

  function DemosSearchField() {
    function handleChangeDemoKind() {
      setDemoKindSelector(demoKindRef?.current?.value as DemoKindSelector);
      searchForDemos();
    }

    return (
      <Form.Group className="mb-3">
        <Form.Label visuallyHidden={true}>Search</Form.Label>
        <Container className={"p-0"}>
          <Row>
            <div className="d-flex p-0">
              <div>
                <Form.Select
                  key={"ProjectType"}
                  value={searchFilters.demoKindSelector}
                  className={"project-type"}
                  onInput={handleChangeDemoKind}
                  ref={demoKindRef}
                >
                  <option value={"all"}>All</option>
                  {kDemoKindValues.map((demoKind) => (
                    <option
                      key={demoKind}
                      selected={demoKind === searchFilters.demoKindSelector}
                      value={demoKind}
                    >
                      {displayDemoKindName(demoKind)}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="flex-grow-1">
                <Form.Control
                  key={"searchField"}
                  id={"search-field"}
                  className={"w-100"}
                  placeholder=""
                  value={searchFilters.searchTerm}
                  onInputCapture={handleChangeSearchTerm}
                  ref={searchTermRef}
                />
              </div>
              <div>
                <Button
                  id={"search-button"}
                  className={"flex-shrink-1"}
                  onClick={() => searchForDemos()}
                >
                  <FontAwesomeIcon icon={"search"} inverse={true} />
                </Button>
              </div>
            </div>
          </Row>
        </Container>
      </Form.Group>
    );
  }

  const createProject = useStoreActions(
    (actions) => actions.projectFromDemoFlow.createProject
  );

  return (
    <>
      <FocusContext.Provider value={focusContext}>
        <NavBanner />
        <div className="DemosList" tabIndex={-1} ref={paneRef}>
          <DemosHeader />
          <FocusGroupContainer
            className="demos-content p-xs-0"
            groupedFocusKey={`DemosList`}
            opts={{
              onFocusFromKeyboard: (elt: HTMLElement) =>
                elt.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                }),
              onActivate: (elt: HTMLElement) => {
                const mDemoUuid = mDataAttrStringValue(elt, "demoUuid");
                if (mDemoUuid) {
                  createProject(mDemoUuid);
                } else {
                  console.warn("no demo uuid found");
                }
              },
            }}
          >
            <DemosContent />
          </FocusGroupContainer>
        </div>
      </FocusContext.Provider>
    </>
  );
};
