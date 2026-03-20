import { Action } from "easy-peasy";
import {propSetterAction} from "../utils";

/**
 * Parse markdown file by mapping every line of text to the previous
 * top level heading. Ignores lines of text written before the first heading.
 * @param markdown markdown text
 */
export function parseMarkdown(markdown: string) {
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
            return { headings, content };
        }
    }
    return null;
}

export type IDemoSidebar = {
  isNavigationExpanded: boolean;
  setIsNavigationExpanded: Action<IDemoSidebar, boolean>;
  activeChapter: number;
  setActiveChapter: Action<IDemoSidebar, number>;
}

export const demoSidebar: IDemoSidebar = {
  isNavigationExpanded: false,
  setIsNavigationExpanded: propSetterAction("isNavigationExpanded"),
  activeChapter: 0,
  setActiveChapter: propSetterAction("activeChapter")
}