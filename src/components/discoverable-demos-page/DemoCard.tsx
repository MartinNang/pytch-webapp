import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import flatIcon from "../../images/flat-simple.png";
import permethodIcon from "../../images/per-method-simple.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStoreActions } from "../../store";
import { Link } from "react-router-dom";
import { PytchProgramKind } from "../../model/pytch-program";

type DemoCardProps = {
  demo: Demo;
  setProjectType: (type: string) => void;
  setProgramType: (type: string) => void;
};

/** There is already a type which captures this concept.
 * PytchProgramKind is a union of string literals. */
export enum ProgramType {
  flat = "Flat",
  perMethod = "Per-method",
}

/** Might make sense to split this into two types.  Thers's the concept
 * of what kind of example this is --- "demo" or "snippet".  And then
 * there's the concept of which kind of examples the user is interested
 * in seeing, which is those two and also "all".  Something like: */
export type ExampleKind = "demo" | "snippet";
export type ExampleKindSelector = ExampleKind | "all";

export enum ProjectType {
  all = "All",
  game = "Game",
  snippet = "Snippet",
}

/** True classes don't play well with Easy-Peasy unfortunately, so it
 * seems to be better to just define a type at the TypeScript level, and
 * then at the JavaScript level it's just a plain object. */
export class Demo {
  displayName: string;
  summaryMarkdown: string | undefined;
  lastUpdated: Date;
  featuredImage: string | undefined;
  programKind: PytchProgramKind;
  projectType: ProjectType;
  slug: string;
  recommended?: string;

  constructor(
    displayName: string,
    summaryMarkdown: string | undefined,
    lastUpdated: Date,
    isGroup: boolean,
    featuredImage: string | undefined,
    programType: PytchProgramKind,
    projectType: ProjectType,
    slug: string
  ) {
    this.displayName = displayName;
    this.summaryMarkdown = summaryMarkdown;
    this.lastUpdated = lastUpdated;
    this.featuredImage = featuredImage;
    this.programKind = programType;
    this.projectType = projectType;
    this.slug = slug;
  }
}

/** Program-type (elsewhere "program kind") is not a human-readable
 * string, so shouldn't need capitalisation anywhere.  If we want to
 * present the program-kind to the user then it should be via a lookup,
 * which can then fairly easily be made translateable. */

export const DemoCard: React.FC<DemoCardProps> = ({
  demo,
  setProjectType,
  setProgramType,
}) => {
  const createProject = useStoreActions(
    (actions) => actions.projectFromDemoFlow.createProject
  );

  function capitalise(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <Card className={"flex-row flex-wrap card"}>
      <Card.Header className={"p-0 w-100"}>
        <Row className={"pill-row w-100 p-3 m-0"}>
          {
            /** This could be done without the ?: since the two results
             * are very similar. */
            capitalise(demo.programKind) === ProgramType.flat ? (
              <Button
                className={"pill-icon flat-icon"}
                onClick={() =>
                  setProgramType(capitalise(demo.programKind.toString()))
                }
              >
                <img src={flatIcon} alt={"flat project"} />
              </Button>
            ) : demo.programKind === ProgramType.perMethod.toLowerCase() ? (
              <Button
                className={"pill-icon per-method-icon"}
                onClick={() => {
                  setProgramType(capitalise(demo.programKind?.toString()));
                  console.log(
                    "setting program type to",
                    demo.programKind.toString()
                  );
                }}
              >
                <img src={permethodIcon} alt={"per-method project"} />
              </Button>
            ) : undefined
          }

          <Button
            className={
              "ms-auto pill-project-type " +
              (demo.projectType === ProjectType.game
                ? "game-pill"
                : "snippet-pill")
            }
            onClick={() => setProjectType(capitalise(demo.projectType))}
          >
            <p>{capitalise(demo.projectType)}</p>
          </Button>
        </Row>
        <Card.Img
          variant={"top"}
          className={"h-100 p-1"}
          src={demo.featuredImage}
        />
      </Card.Header>
      <Card.Body className={"p-4 py-3"}>
        <Link to={""} onClick={() => createProject(demo.slug)}>
          <h3>{demo.displayName}</h3>
        </Link>
        <p className={"demo-summaryMarkdown"}>{demo.summaryMarkdown}</p>

        <Row className={"share-row"}>
          <Col xs={6} className={"align-items-end d-flex"}>
            <p className={"m-0"}>
              {new Date(demo.lastUpdated).toLocaleDateString()}
            </p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
