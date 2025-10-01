import { blueColour, emptyColour } from "./crop-scale-constants";
import { interceptDemoZipfile } from "./utils";

context("Standalone play-demo", () => {
  it("runs a demo", () => {
    interceptDemoZipfile("one-cropped-scaled-sprite");
    cy.visit("/play-demo/fake-build-id-for-tests/one-cropped-scaled-sprite");
    cy.pytchCanvasShouldBeSolidColour(blueColour);
    cy.pytchClickStage(0, 0);
    cy.pytchCanvasShouldBeSolidColour(emptyColour);
    cy.pytchGreenFlag();
    cy.pytchCanvasShouldBeSolidColour(blueColour);
  });

  function hiddenStdoutShouldEqual(expStdout: string) {
    cy.waitUntil(() =>
      cy
        .get("#pytch-hidden-stdout")
        .invoke("attr", "data-captured-stdout")
        .then((stdout) => stdout === expStdout)
    );
  }

  it("computes clicks", () => {
    interceptDemoZipfile("blue-and-red-sprites");
    cy.visit("/play-demo/fake-build-id-for-tests/blue-and-red-sprites");
    hiddenStdoutShouldEqual("Hello world\n");
    cy.pytchClickStage(0, 0);
    hiddenStdoutShouldEqual("Hello world\n1");
    cy.pytchClickStage(-239, 179);
    hiddenStdoutShouldEqual("Hello world\n11");
    cy.pytchClickStage(-225, 165);
    hiddenStdoutShouldEqual("Hello world\n112");
    cy.pytchClickStage(-155, 115);
    hiddenStdoutShouldEqual("Hello world\n1122");
    cy.pytchClickStage(-155, 105);
    hiddenStdoutShouldEqual("Hello world\n11221");
  });
});
