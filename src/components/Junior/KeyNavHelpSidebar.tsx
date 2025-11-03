import React from "react";
import { marked } from "marked";
import { assertNever } from "../../utils";
import { Row, Col, Container } from "react-bootstrap";
import {
  Content,
  KeyDescriptor,
  Section,
  SectionEntry,
} from "../../model/keyboard-shortcuts-help";
import { useDevWorkContext } from "../../model/help-sidebar";

function joinedList(
  keyDescrs: Array<KeyDescriptor>,
  joinText: string
): JSX.Element {
  let pieces: Array<JSX.Element> = [];
  keyDescrs.forEach((keyDescr, idx) => {
    const keyElt = <Key key={idx} keyDescr={keyDescr} />;
    pieces.push(
      idx > 0 ? (
        <div key={idx} className="d-inline-block">
          <span className="key-conj px-2">{joinText}</span>
          {keyElt}
        </div>
      ) : (
        keyElt
      )
    );
  });
  return <>{pieces}</>;
}

const Key: React.FC<{ keyDescr: KeyDescriptor }> = ({ keyDescr }) => {
  if (typeof keyDescr === "string") {
    return <span className="help-key">{keyDescr}</span>;
  }

  switch (keyDescr.kind) {
    case "chord": {
      const pieces = joinedList(keyDescr.keys, "+");
      return <span className="help-key-chord">{pieces}</span>;
    }
    case "alternatives": {
      const pieces = joinedList(keyDescr.keys, "or");
      return <span className="help-key-alternatives">{pieces}</span>;
    }
    case "respective": {
      const pieces = joinedList(keyDescr.keys, "/");
      return <span className="help-key-respective">{pieces}</span>;
    }
    case "sequence": {
      if (keyDescr.keys.length !== 2) {
        throw new Error("only 2-elt sequences are supported");
      }
      const pieces = joinedList(keyDescr.keys, "then");
      return <span className="help-key-sequence">{pieces}</span>;
    }
    default:
      return assertNever(keyDescr);
  }
};

const TextContent: React.FC<{ markdown: string }> = ({ markdown }) => {
  marked.use({ mangle: false, headerIds: false });
  const html = marked.parse(markdown);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const ItemContent: React.FC<{ keyDescr: KeyDescriptor; help: string }> = ({
  keyDescr,
  help,
}) => {
  return (
    <Row className="ItemContent mb-3">
      <Col xs={5} className="key-descr text-end pe-1">
        <Key keyDescr={keyDescr} />
      </Col>
      <Col className="help-text-container">
        <span>:</span>
        <TextContent markdown={help} />
      </Col>
    </Row>
  );
};

const SectionEntryContent: React.FC<{ entry: SectionEntry }> = ({ entry }) => {
  switch (entry.kind) {
    case "text":
      return <TextContent markdown={entry.markdown} />;
    case "item":
      return <ItemContent keyDescr={entry.key} help={entry.help} />;
    default:
      return assertNever(entry);
  }
};

const SectionEntriesContent: React.FC<{
  entries: Array<SectionEntry>;
}> = ({ entries }) =>
  entries.map((entry, idx) => <SectionEntryContent key={idx} entry={entry} />);

const SectionContent: React.FC<{ section: Section }> = ({ section }) => {
  const workContext = useDevWorkContext();

  const entryIsRelevant = (entry: SectionEntry) =>
    entry.forProgramKind == null ||
    entry.forProgramKind === workContext.programKind;

  const relevantEntries = section.entries.filter(entryIsRelevant);

  return (
    <div className="SectionContent mb-3">
      <Row className="section-heading">
        <h2>{section.heading}</h2>
      </Row>
      <SectionEntriesContent entries={relevantEntries} />
    </div>
  );
};

const KeyNavHelpSidebarContent: React.FC<{ content: Content }> = ({
  content,
}) => {
  const workContext = useDevWorkContext();

  const sectionIsRelevant = (section: Section) =>
    section.forProgramKind == null ||
    section.forProgramKind === workContext.programKind;

  const relevantSections = content.sections.filter(sectionIsRelevant);

  return (
    <Container>
      <h1>Using Pytch with the keyboard</h1>
      <p>
        You might prefer to use Pytch mostly with the keyboard (rather than a
        mouse or trackpad or other pointing device). Here is a summary of some
        useful keyboard shortcuts.
      </p>
      {relevantSections.map((section, idx) => (
        <SectionContent key={idx} section={section} />
      ))}
    </Container>
  );
};
