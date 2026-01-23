import React from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import flatIcon from "../images/flat-simple.png";
import permethodIcon from "../images/per-method-simple.png";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";

type DemoCardProps = {
    demo: Demo;
}

export enum ProgramType {
    flat = "Flat",
    perMethod = "Per-method",
}

export enum ProjectType {
    game = "Game",
    snippet = "Snippet",
    all ="All"
}

export class Demo {
    displayName: string;
    summaryMarkdown: string | undefined;
    lastUpdated: Date;
    isGroup: boolean;
    featuredImage: string | undefined;
    programType: ProgramType;
    projectType: ProjectType;
    projectUrl: string;

    constructor(displayName: string, summaryMarkdown: string | undefined, lastUpdated: Date, isGroup: boolean, featuredImage: string | undefined,
                programType: ProgramType, projectType: ProjectType, projectUrl: string) {
        this.displayName = displayName;
        this.summaryMarkdown = summaryMarkdown;
        this.lastUpdated = lastUpdated;
        this.isGroup = isGroup;
        this.featuredImage = featuredImage;
        this.programType = programType;
        this.projectType = projectType;
        this.projectUrl = projectUrl;
    }
}

export const DemoCard: React.FC<DemoCardProps> = ({
                                                      demo,
                                                  }) => {

    return (
        <Card className={"flex-row flex-wrap card"}>
            <Card.Header className={"p-0 w-100"}>
                <Row className={"pill-row w-100 p-3 m-0"}>
                    {
                        demo.programType === ProgramType.flat ?
                            (
                                <div className={"pill-icon flat-icon"}>
                                    <img src={flatIcon} alt={"flat project"} />
                                </div>
                            )
                            :
                            (
                                <div className={"pill-icon per-method-icon"}>
                                    <img src={permethodIcon} alt={"per-method project"} />
                                </div>
                            )
                    }

                    <div className={"pill-project-type " + (demo.projectType === ProjectType.game ? "game-pill" : "snippet-pill")}>
                        <p>{demo.projectType}</p>
                    </div>
                    {
                        demo.isGroup && (
                            <div className={"pill-project-type group-pill ms-auto p-1"}>
                                <FontAwesomeIcon icon={"layer-group"} />
                            </div>
                        )
                    }

                </Row>
                <Card.Img
                    variant={"top"}
                    className={"h-100 p-1"}
                    src={demo.featuredImage}
                />
            </Card.Header>
            <Card.Body className={"p-4 py-3"}>
                <Link to={demo.projectUrl}><h3>{demo.displayName}</h3></Link>
                <p className={"demo-summaryMarkdown"}>{demo.summaryMarkdown}</p>
                <Row className={"share-row"}>
                    <Col xs={6} className={"align-items-end d-flex"}>
                        <p className={"m-0"}>{demo.lastUpdated.toLocaleDateString()}</p>
                    </Col>
                    <Col xs={6} className={"d-flex justify-content-end"}>
                        <Button className={"px-3"}>
                            <FontAwesomeIcon icon="share" className={"me-1"} />
                            Share
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}