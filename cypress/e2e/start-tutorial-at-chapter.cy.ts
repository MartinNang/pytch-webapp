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

  function assertChapterStartContent(expChapterIndex: number) {
    cy.get(".TutorialCard.start-at-chapter .chapter-index-content").should(
      "have.text",
      `Starting at chapter ${expChapterIndex}`
    );
  }

  function attemptCreateProject() {
    cy.get(".TutorialCard.start-at-chapter button").click();
  }
});
