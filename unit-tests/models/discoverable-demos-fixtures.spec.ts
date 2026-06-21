import { assert } from "chai";
import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { join as joinPath } from "path";

import {
  zDemoCatalogue,
  zDemoCatalogueEntry,
} from "../../src/model/discoverable-demos-schema";
import { parseMarkdown } from "../../src/model/demo-sidebar";

// Layer B — fixture-validity check (no network).  Runs every catalogue
// fixture through the app's own Zod schema, and every description.md
// through the app's own chapter parser, so the Cypress fixtures can never
// silently drift from the shape the app expects.  See
// `disco-demos-e2e-tests.md`.

const kCatalogueRoot = joinPath(
  __dirname,
  "..",
  "..",
  "cypress",
  "fixtures",
  "demo-catalogue"
);

function readJson(...segments: Array<string>): unknown {
  return JSON.parse(readFileSync(joinPath(kCatalogueRoot, ...segments), "utf-8"));
}

/** UUID-named per-demo directories present on disk. */
function perDemoDirs(): Array<string> {
  return readdirSync(kCatalogueRoot).filter(
    (name) =>
      name !== "index" &&
      statSync(joinPath(kCatalogueRoot, name)).isDirectory()
  );
}

describe("Discoverable-demos Cypress fixtures", () => {
  it("catalogue index parses against zDemoCatalogue", () => {
    const raw = readJson("index", "en", "demos.json");
    const catalogue = zDemoCatalogue.parse(raw);
    assert.isAbove(catalogue.length, 0);
  });

  it("every per-demo metadata.json parses against zDemoCatalogueEntry", () => {
    for (const uuid of perDemoDirs()) {
      const metadataPath = joinPath(uuid, "en", "metadata.json");
      assert.isTrue(
        existsSync(joinPath(kCatalogueRoot, metadataPath)),
        `missing ${metadataPath}`
      );
      const entry = zDemoCatalogueEntry.parse(readJson(uuid, "en", "metadata.json"));
      assert.equal(entry.uuid, uuid, `uuid mismatch in ${metadataPath}`);
    }
  });

  it("every catalogue entry's metadata matches the index entry", () => {
    const catalogue = zDemoCatalogue.parse(readJson("index", "en", "demos.json"));
    for (const indexEntry of catalogue) {
      const entry = zDemoCatalogueEntry.parse(
        readJson(indexEntry.uuid, "en", "metadata.json")
      );
      assert.deepEqual(entry, indexEntry, `index/metadata mismatch for ${indexEntry.uuid}`);
    }
  });

  it("every catalogue entry's description.md parses into >= 1 chapter", () => {
    const catalogue = zDemoCatalogue.parse(readJson("index", "en", "demos.json"));
    for (const entry of catalogue) {
      const md = readFileSync(
        joinPath(kCatalogueRoot, entry.uuid, "en", "content", "description.md"),
        "utf-8"
      );
      const parsed = parseMarkdown(md);
      assert.isNotNull(parsed, `description.md for ${entry.uuid} yielded no chapters`);
      assert.isAbove(parsed!.headings.length, 0);
      assert.equal(
        parsed!.content.length,
        parsed!.headings.length,
        `every chapter of ${entry.uuid} should have body content`
      );
    }
  });

  it("the fixtures cover the cases the E2E scenarios need", () => {
    const catalogue = zDemoCatalogue.parse(readJson("index", "en", "demos.json"));

    // More than one page of results (kDemosPerPage = 10).
    assert.isAbove(catalogue.length, 10);

    // A known number of recommended demos.
    assert.isAbove(catalogue.filter((d) => d.recommended).length, 0);

    // A mix of demo kinds and program kinds.
    const demoKinds = new Set(catalogue.map((d) => d.demoKind));
    assert.isTrue(demoKinds.has("game") && demoKinds.has("snippet"));
    const programKinds = new Set(catalogue.map((d) => d.programKind));
    assert.isTrue(programKinds.has("flat") && programKinds.has("per-method"));

    // At least one demo with, and one without, a thumbnail video.
    assert.isAbove(
      catalogue.filter((d) => d.thumbnailVideoExtension != null).length,
      0
    );
    assert.isAbove(
      catalogue.filter((d) => d.thumbnailVideoExtension == null).length,
      0
    );

    // At least one single-chapter and one multi-chapter demo.
    const chapterCounts = catalogue.map((entry) => {
      const md = readFileSync(
        joinPath(kCatalogueRoot, entry.uuid, "en", "content", "description.md"),
        "utf-8"
      );
      return parseMarkdown(md)!.headings.length;
    });
    assert.isTrue(chapterCounts.some((n) => n === 1), "need a single-chapter demo");
    assert.isTrue(chapterCounts.some((n) => n > 1), "need a multi-chapter demo");
  });
});
