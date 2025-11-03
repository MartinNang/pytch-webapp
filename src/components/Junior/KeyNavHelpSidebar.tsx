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
