import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";
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
  displayDemoKindName,
  displayProgramKindName,
  displaySortByName,
  PytchProgramKindSelector,
  SortBy,
  kSortByValues,
} from "../../model/discoverable-demos";
import { kPytchProgramKindValues } from "../../model/pytch-program";
import { FocusGroupContainer } from "../FocusGroupContainer";
import { createFocusContext, FocusContext } from "../hooks/focus-steering";
import { CreateProjectFromDemoModal } from "./CreateProjectFromDemoModal";
import { useDemoListActions, useDemoListState } from "./hooks";
import { useRunFlow } from "../../model";

/** TODO The data files for the demos need to live not in this repo.  There
 * needs to be some machinery to support a reasonable workflow for
 * publishing new demos. */

const DemosHeader: React.FC<EmptyProps> = () => {
  return (
    <div className={"demos-header pt-1 mb-2 border-bottom"}>
      <h1 className={"row pt-5"}>Demos</h1>
      <RecommendedDemos />
    </div>
  );
};

const DemosSearchField: React.FC<EmptyProps> = () => {
  const searchFilters = useDemoListState((s) => s.searchFilters);
  const setDemoKindSelector = useDemoListActions(
    (a) => a.searchFilters.setDemoKindSelector
  );

  const searchForDemos = useDemoListActions((a) => a.searchForDemos);
  const setSearchTerm = useDemoListActions(
    (a) => a.searchFilters.setSearchTerm
  );

  const searchTermRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchTermRef?.current?.focus();
  }, [searchFilters.searchTerm]);

  const handleChangeDemoKind: ChangeEventHandler<HTMLSelectElement> = (evt) => {
    setDemoKindSelector(evt.target.value as DemoKindSelector);
    searchForDemos();
  };

  const handleChangeSearchTerm: ChangeEventHandler<HTMLInputElement> = (
    evt
  ) => {
    setSearchTerm(evt.target.value);
    searchForDemos();
  };

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
              >
                <option value={"all"}>All</option>
                {kDemoKindValues.map((demoKind) => (
                  <option key={demoKind} value={demoKind}>
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
                onInput={handleChangeSearchTerm}
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
};

const DemosSearch: React.FC<EmptyProps> = () => {
  const programKindSelector = useDemoListState(
    (s) => s.searchFilters.programKindSelector
  );
  const sortBy = useDemoListState((s) => s.sortBy);

  const setProgramKindSelector = useDemoListActions(
    (a) => a.searchFilters.setProgramKindSelector
  );
  const setSortBy = useDemoListActions((a) => a.setSortBy);
  const searchForDemos = useDemoListActions((a) => a.searchForDemos);

  const handleChangeSortBy: ChangeEventHandler<HTMLSelectElement> = (evt) => {
    setSortBy(evt.target.value as SortBy);
    searchForDemos();
  };
  const handleChangeProgramKind: ChangeEventHandler<HTMLSelectElement> = (
    evt
  ) => {
    setProgramKindSelector(evt.target.value as PytchProgramKindSelector);
    searchForDemos();
  };

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
                    value={programKindSelector}
                    onInput={handleChangeProgramKind}
                  >
                    <option value={"all"}>Program type</option>
                    {kPytchProgramKindValues.map((programKind) => (
                      <option key={programKind} value={programKind}>
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
                    onInput={handleChangeSortBy}
                    value={sortBy}
                  >
                    {Object.values(kSortByValues).map((sortingOption) => (
                      <option key={sortingOption} value={sortingOption}>
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
};

const DemosResults: React.FC<EmptyProps> = () => {
  const contentFetchState = useDemoListState(
    (s) => s.fetchedDemos.contentFetchState
  );

  const [activePage, setActivePage] = useState(1);

  const itemsPerPage = 10;

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
};

const DemosContent: React.FC<EmptyProps> = () => {
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
};

export const DemosList: React.FC<EmptyProps> = () => {
  const focusContext = createFocusContext("my-projects-list");

  const maybeLoadContent = useDemoListActions(
    (a) => a.fetchedDemos.maybeLoadContent
  );

  const paneRef = React.useRef<HTMLDivElement>(null);

  const createProject = useRunFlow((f) => f.createProjectFromDemoFlow);

  useEffect(() => {
    maybeLoadContent();
  }, []);

  useEffect(() => {
    document.title = "Pytch: Demos";
  });

  return (
    <>
      <CreateProjectFromDemoModal />
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
                  createProject({ uuid: mDemoUuid });
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
