/// <reference types="cypress" />

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
});
