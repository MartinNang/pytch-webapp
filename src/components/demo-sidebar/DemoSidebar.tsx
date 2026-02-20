import React, { useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  Placeholder,
  Row,
} from "react-bootstrap";
import { useLinkedDemo } from "../Junior/lesson/hooks";
import {DemoHeader} from "./DemoHeader";
import {ChaptersOverview} from "./ChaptersOverview";
import {DemoChapter} from "./DemoChapter";

export const DemoSidebar = () => {
  const maybeDemo = useLinkedDemo();
  const [md, setMd] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setMd(maybeDemo?.demo.chapters || "");
    if (maybeDemo?.demo) setLoading(false);
  }, [maybeDemo]);

  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [headings, setHeadings] = useState<string[] | null>(null);
  const [chapterContents, setChapterContents] = useState<string[] | null>(null);
  const [navigationOpen, setNavigationOpen] = useState(true);

  /**
   * Parse markdown file by mapping every line of text to the previous
   * top level heading. Ignores lines of text written before the first heading.
   * @param markdown markdown text
   */
  function parseMarkdown(markdown: string) {
    let headingsMatch: RegExpMatchArray | null =
      markdown.match(/(?<=(^#)\s).*/gm);

    if (headingsMatch) {
      // TODO: should empty headings be ignored/filtered?
      let headings: string[] = headingsMatch?.filter(
        (heading) => heading.length > 0
      );

      if (headings !== null) {
        let headingsIndex = 0;
        let content = [];
        let lines = markdown.split("\n");
        for (let linesIndex = 0; linesIndex < lines.length; linesIndex++) {
          let line = lines[linesIndex];
          if (line.startsWith("# " + headings[headingsIndex])) {
            headingsIndex++;
          } else if (headingsIndex > 0) {
            if (content[headingsIndex - 1]) {
              content[headingsIndex - 1] += line + "\n";
            } else {
              content[headingsIndex - 1] = line;
            }
          }
        }
        return { headings, res: content };
      }
    }
    return null;
  }

  useEffect(() => {
    let data = parseMarkdown(md || "");
    setHeadings(data?.headings || null);
    setChapterContents(data?.res || null);
  }, [md]);

  const chaptersRef = useRef<Array<HTMLLIElement | null>>([]);
  const navCaretRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    chaptersRef.current = chaptersRef.current.slice(0, headings?.length);
    if (headings && headings?.length <= 1) {
      setNavigationOpen(false);
    }
  }, [headings]);

  useEffect(() => {
    console.log("scrolling?", chaptersRef);
    if (chaptersRef && chaptersRef.current) {
      console.log("scrolling into view", activeChapter, chaptersRef.current);
      chaptersRef?.current[activeChapter]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    }
  }, [activeChapter]);

  // the following useEffect methods are needed to return focus to the previously used button after scrolling
  // to the active chapter in the chapter navigation
  useEffect(() => {
    navCaretRef.current?.focus();
  }, [navigationOpen]);

  function DemoSubheader() {
    return (
      <Row
        className={
          "demo-sub-header px-4 " +
          (maybeDemo?.demo.summaryMarkdown || loading ? "py-3" : "py-2")
        }
      >
        <Col
          className={"p-0 m-0"}
          style={{ color: "white", fontSize: "0.9rem" }}
        >
          {loading ? (
            <>
              <Placeholder xs={12} className={"rounded-1 placeholder-wave"} />
              <Placeholder xs={10} className={"rounded-1 placeholder-wave"} />
            </>
          ) : (
            maybeDemo?.demo.summaryMarkdown
          )}
        </Col>
      </Row>
    );
  }

  function DemoFooter() {
    return (
      <Row className={"demo-footer py-3 px-3"}>
        <div className={"d-flex align-items-center flex-grow-1 w-auto"}>
          {loading ? (
            <Placeholder animation={"wave"} />
          ) : (
            <p className={"mb-0"}>
              Published on{" "}
              {new Date(maybeDemo?.demo.lastUpdated || "").toLocaleDateString()}
            </p>
          )}
        </div>
      </Row>
    );
  }

  return (
    <div className="DemoSidebar" tabIndex={-1}>
      <div className="content">
        <div className="inner-content">
          <Container className={"d-flex flex-column h-100"}>
            <DemoHeader
                loading={loading}
                activeChapter={activeChapter}
                maybeDemo={maybeDemo}
                headings={headings}
                chaptersRef={chaptersRef}
                navCaretRef={navCaretRef}
                navigationOpen={navigationOpen}
                setNavigationOpen={setNavigationOpen}
            />
            <DemoSubheader />
            <ChaptersOverview
                navigationOpen={navigationOpen}
                activeChapter={activeChapter}
                loading={loading}
                headings={headings}
                chaptersRef={chaptersRef}
                setActiveChapter={setActiveChapter}
            />
            <DemoChapter
            activeChapter={activeChapter}
            loading={loading}
            headings={headings}
            setActiveChapter={setActiveChapter}
            navigationOpen={navigationOpen}
            chapterContents={chapterContents}
            />
            <DemoFooter />
          </Container>
        </div>
      </div>
    </div>
  );
};
