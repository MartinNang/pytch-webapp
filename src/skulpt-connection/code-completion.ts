/* eslint-disable @typescript-eslint/no-explicit-any */

// Very rudimentary auto-completion
//
// Only complete "pytch." and "self.", with hard-coded list of options
// based on the public module functions and base-class methods.

import { IAceEditor } from "react-ace/lib/types";
import { assertNever } from "../utils";
import { HelpDisplayContext } from "../model/help-sidebar";

declare let Sk: any;

interface IAceCompletion {
  caption: string;
  value: string;
  meta?: string;
  message: string;
}

const completionFromPyTuple = (meta: string | null) => (tup: any) => ({
  caption: tup.v[0].v + tup.v[1].v,
  value: tup.v[0].v,
  meta,
  message: tup.v[3].v,
});

const withoutMeta = (completion: IAceCompletion): IAceCompletion => ({
  caption: completion.caption,
  value: completion.value,
  message: completion.message,
});

const completionsFromPyList = (meta: string | null, lst: any) =>
  lst.v.map(completionFromPyTuple(meta));

// Invoke the Python function _user_facing_completions() and
// use the provided info on the user-facing attributes of pytch,
// Actor, Sprite, and Stage.
//
const kCompletions = (() => {
  Sk.configure({});
  const pyStr = (s: string) => new Sk.builtin.str(s);
  const sUserFacingCompletions = pyStr("_user_facing_completions");
  const sPytch = pyStr("pytch");
  const sActor = pyStr("Actor");
  const sSprite = pyStr("Sprite");
  const sStage = pyStr("Stage");

  const pyMod = Sk.builtin.__import__("pytch", {}, {}, [], -1);
  const pyCompletionsInfoFun = Sk.builtin.getattr(
    pyMod,
    sUserFacingCompletions
  );
  const pyCompletionsInfo = pyCompletionsInfoFun.tp$call([], {});

  // Return value is (completions, attrsWithoutDocs); ignore the latter.
  const pyCompletionsByKind = pyCompletionsInfo.v[0];

  // Set top-level var holding completions for "pytch.":
  //
  const pytch = completionsFromPyList(
    null,
    pyCompletionsByKind.mp$subscript(sPytch)
  );

  // Set top-level var holding completions for "self.":
  //
  const actorCompletions = completionsFromPyList(
    "[Spr/Stg]",
    pyCompletionsByKind.mp$subscript(sActor)
  );
  const spriteCompletions = completionsFromPyList(
    "[Spr]",
    pyCompletionsByKind.mp$subscript(sSprite)
  );
  const stageCompletions = completionsFromPyList(
    "[Stg]",
    pyCompletionsByKind.mp$subscript(sStage)
  );
  const actor = [
    ...actorCompletions,
    ...spriteCompletions,
    ...stageCompletions,
  ];

  const sprite = actorCompletions.concat(spriteCompletions).map(withoutMeta);
  const stage = actorCompletions.concat(stageCompletions).map(withoutMeta);

  return { pytch, actor, sprite, stage };
})();

export class PytchAceAutoCompleter {
  readonly context: HelpDisplayContext;

  constructor(context: HelpDisplayContext) {
    this.context = context;
  }

  // TODO: Proper types for the remaining arguments.
  getCompletions(
    _editor: IAceEditor,
    session: any,
    pos: any,
    prefix: string,
    callback: any
  ) {
    const cursorLine = session.getLine(pos.row);
    const lineHead = cursorLine.substring(0, pos.column);

    if (!lineHead.endsWith(prefix)) {
      // TODO: What's the right way to report this error to Ace?
      callback(null, []);
    }

    const prePrefixLength = lineHead.length - prefix.length;
    const prePrefix = lineHead.substring(0, prePrefixLength);

    const candidates = (() => {
      if (prePrefix.endsWith("pytch.")) {
        return kCompletions.pytch;
      } else if (prePrefix.endsWith("self.")) {
        switch (this.context.programKind) {
          case "flat":
            return kCompletions.actor;
          case "per-method":
            switch (this.context.actorKind) {
              case "sprite":
                return kCompletions.sprite;
              case "stage":
                return kCompletions.stage;
              default:
                return assertNever(this.context.actorKind);
            }
          default:
            return assertNever(this.context);
        }
      } else {
        return [];
      }
    })();

    callback(null, candidates);
  }
}
