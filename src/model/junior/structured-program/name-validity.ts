// Assessment of a string as a possible name for a class.

// TODO: Move this to pytch-vm; too annoying to unit-test with mocha
// here.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let Sk: any;

type NameInvalidReasonKey =
  | "is-stage"
  | "is-empty"
  | "not-identifier"
  | "already-exists"
  | "is-reserved";

export type NameValidity =
  | { status: "valid" }
  | { status: "invalid"; reasonKey: NameInvalidReasonKey };

const invalidBecause = (reasonKey: NameInvalidReasonKey): NameValidity => ({
  status: "invalid",
  reasonKey,
});

/** Assess the validity (or otherwise) of the given `candidateName` for
 * a sprite, given that there already exist sprites names being the
 * elements of `existingNames`. */
export const nameValidity = (
  existingNames: Array<string>,
  candidateName: string
): NameValidity => {
  // This is a fudge but should do the job:
  if (candidateName === "Stage") {
    return invalidBecause("is-stage");
  }

  if (candidateName === "") {
    return invalidBecause("is-empty");
  }

  if (!Sk.token.isIdentifier(candidateName)) {
    return invalidBecause("not-identifier");
  }

  if (existingNames.includes(candidateName)) {
    // TODO: Will this ever be used for things other than Sprites?
    return invalidBecause("already-exists");
  }

  try {
    const classDef = `class ${candidateName}:\n pass`;
    Sk.parse("<stdin>", classDef);
    return { status: "valid" };
  } catch {
    // TODO: Are there other reasons we might find ourselves here?
    return invalidBecause("is-reserved");
  }
};

/** Return the first string of the form `SpriteN` which is not present
 * in the given array of `existingNames`, where `N` counts up the
 * integers from 1. */
export const unusedSpriteName = (existingNames: Array<string>): string => {
  let name = "";
  let suffix = 1;

  do {
    name = `Sprite${suffix++}`;
  } while (existingNames.includes(name));

  return name;
};
