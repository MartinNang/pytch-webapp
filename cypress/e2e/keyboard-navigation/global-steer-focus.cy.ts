import { assertInIDE } from "../utils";
import {
  assertFocus,
  KeyOrShortcut,
  realPress,
} from "./utils";

context("Global focus steering shortcuts", () => {
  beforeEach(() => {
    cy.pytchResetDatabase();
  });

  function invokeFocusShortcut(key: KeyOrShortcut) {
    realPress("g");
    realPress(key);
  }

  context("flat IDE", () => {
    it("specimen link", () => {
      cy.intercept("GET", "**/_by_content_hash_/1234.zip", {
        fixture: "lesson-specimens/hello-world-lesson.zip",
      });
      cy.pytchTryUploadZipfiles(["v4-flat-linked-to-specimen.zip"]);
      assertInIDE("flat");

      cy.get('button[data-activity-bar-tab="helpsidebar"]').click();
      realPress("ArrowDown");
      realPress("Enter");

      invokeFocusShortcut("c");
      assertFocus("flat-code-editor");
      realPress("Escape");

      invokeFocusShortcut("h");
      assertFocus("specimen-info");
    });
  });
});
