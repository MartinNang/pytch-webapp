import {
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
});
