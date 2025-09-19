import { saveButton } from "../utils";
import {
  deleteAllCodeOfSoleHandler,
  loadFromZipfile,
  selectSprite,
  selectStage,
  soleEventHandlerCodeShouldEqual,
  ScriptOps,
  settleModalDialog,
} from "./utils";

context("Edit Python of scripts", () => {
  it("focuses editor of newly-added script", () => {
    loadFromZipfile("newly-created-per-method.zip");
    selectSprite("Snake");
    ScriptOps.chooseHandlerDropdownItem(0, "DELETE");
    settleModalDialog("DELETE");
    ScriptOps.addHandler(ScriptOps.selectGreenFlagHatBlock);
    cy.pytchSendKeysToApp("# 42");
    soleEventHandlerCodeShouldEqual("# 42");
  });

  it("ignores INS key in script body editor", () => {
    loadFromZipfile("newly-created-per-method.zip");

    selectSprite("Snake");
    deleteAllCodeOfSoleHandler();

    cy.get(".ace_editor").type("# 012345{enter}");
    soleEventHandlerCodeShouldEqual("# 012345\n");

    cy.get(".ace_editor").type(
      "{upArrow}{home}{rightArrow}{rightArrow}A" +
        "{insert}{rightArrow}B{insert}{rightArrow}C" +
        "{insert}{rightArrow}D{insert}{rightArrow}E"
    );
    soleEventHandlerCodeShouldEqual("# A0B1C2D3E45\n");
  });

  function assertNCompletions(expNCompletions: number) {
    if (expNCompletions === 0) {
      cy.get(".ace_autocomplete").should("not.be.visible");
    } else {
      cy.get(".ace_autocomplete .ace_line").should(
        "have.length",
        expNCompletions
      );
    }
  }

  it("launches autocomplete with electric dot", () => {
    loadFromZipfile("newly-created-per-method.zip");

    selectSprite("Snake");
    deleteAllCodeOfSoleHandler();

    cy.get(".ace_editor").type("pytch.br");
    assertNCompletions(4);
    cy.pytchSendKeysToApp("{downArrow}{enter}");
    assertNCompletions(0);
    soleEventHandlerCodeShouldEqual("pytch.broadcast");

    cy.pytchSendKeysToApp("{enter}self.{enter}");
    assertNCompletions(0);
    soleEventHandlerCodeShouldEqual("pytch.broadcast\nself.all_clones");

    cy.pytchSendKeysToApp("{enter}rubbish.");
    assertNCompletions(0);
    cy.pytchSendKeysToApp("{enter}");
    soleEventHandlerCodeShouldEqual(
      "pytch.broadcast\nself.all_clones\nrubbish.\n"
    );
  });

  it("focuses editor from activity content", () => {
    loadFromZipfile("newly-created-per-method.zip");

    selectSprite("Snake");
    deleteAllCodeOfSoleHandler();
    cy.pytchSendKeysToApp("# Hello");
    soleEventHandlerCodeShouldEqual("# Hello");

    cy.get(".HelpSidebarSection.category-motion").click();
    cy.contains("turn_degrees");
    cy.pytchSendKeysToApp(" world");
    soleEventHandlerCodeShouldEqual("# Hello world");

    // Switching to a different actor and back again should "forget" the
    // most-recent editor.
    selectStage();
    selectSprite("Snake");

    cy.get(".HelpSidebarSection.category-sensing").click();
    cy.contains("ask_and_wait");
    cy.pytchSendKeysToApp(" again");

    // The " again" should not have been sent to the editor:
    soleEventHandlerCodeShouldEqual("# Hello world");
  });

  it("can edit code, updating Save button", () => {
    loadFromZipfile("per-method-four-scripts.zip");

    selectSprite("Snake");

    cy.get(".ace_editor").as("editors").should("have.length", 4);
    saveButton.click();

    saveButton.shouldReactToInteraction(() => {
      cy.get("@editors").eq(1).type("# Hello world testing");
    });
  });
});
