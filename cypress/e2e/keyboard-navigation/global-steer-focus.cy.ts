import { selectStage } from "../junior/utils";
import { assertInIDE } from "../utils";
import {
  activateFlatAsset,
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

    it("tutorial link", () => {
      cy.pytchProjectFollowingTutorial();
      assertInIDE("flat");
      activateFlatAsset(0);

      invokeFocusShortcut("h");
      assertFocus("tutorial-content");

      invokeFocusShortcut("a");
      assertFocus("flat-asset", 0);
      realPress("ArrowDown", 4);
      assertFocus("flat-asset", 4);

      invokeFocusShortcut("h");
      assertFocus("tutorial-content");

      cy.get('button[data-activity-bar-tab="helpsidebar"]')
        .as("helpButton")
        .click();

      invokeFocusShortcut("h");
      assertFocus("help-sidebar", [0]);

      realPress("ArrowDown", 3);
      realPress("Enter");
      realPress("ArrowDown", 3);
      assertFocus("help-sidebar", [3, 2]);

      invokeFocusShortcut("a");
      assertFocus("flat-asset", 4);

      invokeFocusShortcut("h");
      assertFocus("help-sidebar", [3, 2]);

      cy.get("@helpButton").click();
      invokeFocusShortcut("c");
      assertFocus("flat-code-editor");
      realPress("Escape");
      invokeFocusShortcut("h");
      assertFocus("activity-tab", "helpsidebar");

      realPress("End");
      assertFocus("activity-tab", "keynavhelp");
      invokeFocusShortcut("a");
      assertFocus("flat-asset", 4);
      invokeFocusShortcut("h");
      assertFocus("activity-tab", "keynavhelp");

      realPress("Enter");
      realPress("Tab");
      assertFocus("keynav-help");

      invokeFocusShortcut("a");
      assertFocus("flat-asset", 4);
      invokeFocusShortcut("h");
      assertFocus("keynav-help");
    });
  });

  context("per-method IDE", () => {
    it("specimen link", () => {
      cy.intercept("GET", "**/_by_content_hash_/1234.zip", {
        fixture: "lesson-specimens/per-method-blue-invaders.zip",
      });
      cy.pytchTryUploadZipfiles(["v4-jr-linked-to-specimen.zip"]);
      assertInIDE("per-method");

      selectStage();
      assertFocus("actor-card", 0);

      cy.get('button[data-activity-bar-tab="helpsidebar"]').click();
      realPress("ArrowDown");
      realPress("Enter");

      invokeFocusShortcut("h");
      assertFocus("specimen-info");

      invokeFocusShortcut("c");
      assertFocus("add-script-button");

      invokeFocusShortcut("h");
      assertFocus("specimen-info");
    });
  });
});
