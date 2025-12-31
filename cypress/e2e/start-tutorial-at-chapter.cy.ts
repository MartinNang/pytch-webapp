/// <reference types="cypress" />

import { settleModalDialog } from "./junior/utils";

context("Start jr tutorial at chapter", () => {
  beforeEach(() => {
    cy.pytchResetDatabase();
  });

  function assertTutorialNameIncludes(match: string) {
    cy.get(".TutorialCard.start-at-chapter .card-title").should(
      "include.text",
      match
    );
  }

  function assertChapterStartContent(expChapterIndex: number) {
    cy.get(".TutorialCard.start-at-chapter .chapter-index-content").should(
      "have.text",
      `Starting at chapter ${expChapterIndex}`
    );
  }

  function attemptCreateProject() {
    cy.get(".TutorialCard.start-at-chapter button").click();
  }

  function assertError(messageMatch: string) {
    cy.get(".GenericErrorModal").contains(messageMatch);

    // Dismissing the modal should give the full page structure, but
    // with error message.
    settleModalDialog("OK");
    cy.get(".NavBar.inert");
    cy.get(".TutorialList");
    cy.get(".ExceptionDisplay").contains(messageMatch);
  }
});
