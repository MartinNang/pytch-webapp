import React from "react";
import { assertNever } from "../../utils";
import {
  KeyDescriptor,
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
