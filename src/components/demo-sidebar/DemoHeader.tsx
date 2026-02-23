import React, {RefObject} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    Button,
    Placeholder,
    Row,
} from "react-bootstrap";
import {LinkedDemo} from "../../model/linked-content";

export const DemoHeader = (
    {
        loading,
        activeChapter,
        maybeDemo,
        headings,
        chaptersRef,
        navCaretRef,
        navigationOpen,
        setNavigationOpen
    }: {
        loading: boolean;
        activeChapter: number;
        maybeDemo: LinkedDemo | null;
        headings: string[] | null;
        chaptersRef: RefObject<(HTMLLIElement | null)[]>;
        navCaretRef: RefObject<(HTMLButtonElement | null)>;
        navigationOpen: boolean;
        setNavigationOpen: (ac: boolean) => void;
    }) => {

    return (
        <Row className="demo-header p-3">
            <div className={"p-0 py-1 m-0 ps-2 " + (loading ? "w-75" : "w-auto")}>
                {loading ? (
                    <Placeholder
                        xs={12}
                        size={"lg"}
                        className={"placeholder-wave rounded-1"}
                    />
                ) : (
                    <h1
                        style={{
                            fontSize: "1.1rem",
                            padding: 0,
                            margin: 0,
                            color: "#FFF792",
                            lineBreak: "anywhere",
                        }}
                    >
                        {maybeDemo?.demo.displayName}
                    </h1>
                )}
            </div>
            <div className={"w-auto d-flex"}>
                <div
                    className={
                        "chapter-pill rounded-pill " +
                        (loading ? "placeholder" : undefined)
                    }
                >
                    {loading ? (
                        <div className={"rounded-1 p-2"}/>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={"layer-group"}/>
                            <span style={{fontSize: "0.8rem", paddingLeft: 2}}>
                  {activeChapter + 1}/{headings?.length}
                </span>
                        </>
                    )}
                </div>
                {loading ? (
                    <div
                        className={"placeholder rounded-1 ms-3 placeholder-caret"}
                    ></div>
                ) : undefined}
                {headings && headings?.length > 1 ? (
                    <Button
                        aria-label={"Expand or collapse chapters navigation menu"}
                        className={"w-auto caret p-0 ms-2"}
                        key={"nav-caret"}
                        id={"nav-caret"}
                        ref={navCaretRef}
                        onClick={() => {
                            setNavigationOpen(!navigationOpen);
                            console.log("switching to", !navigationOpen, document.activeElement);
                            navCaretRef.current?.focus();
                        }}
                        onFocus={() => {
                            chaptersRef.current[activeChapter]?.scrollIntoView({
                                behavior: "smooth",
                            });
                            console.log('focusing')
                        }
                        }
                    >
                        <FontAwesomeIcon
                            icon={"caret-down"}
                            className={
                                "nav-caret " + (navigationOpen ? "nav-expanded" : "")
                            }
                        />
                    </Button>
                ) : undefined}
            </div>
        </Row>
    );
};