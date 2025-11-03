import React from "react";
import { marked } from "marked";
import { assertNever } from "../../utils";
import { Row, Col } from "react-bootstrap";
import {
  KeyDescriptor,
  SectionEntry,
} from "../../model/keyboard-shortcuts-help";

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
