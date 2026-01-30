import { marked } from "marked";

const kAsyncFalseOption = { async: false } as const;

// We can extend to take options if we ever use them.

/** Return a string of HTML rendering the given `src` markdown.  This
 * function is a simple wrapper around the `marked` function provided by
 * the `marked` package, forcing `async` to `false` to allow inference
 * that the returned value is a string (rather than a promise of a
 * string). */
export function markedParse(src: string): string {
  return marked.parse(src, kAsyncFalseOption);
}
