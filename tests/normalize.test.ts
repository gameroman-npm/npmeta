import assert from "node:assert/strict";
import { it, describe } from "node:test";

import { normalizeLicense } from "npmeta";

describe("normalizeLicense", () => {
  it("returns string licenses unchanged", () => {
    assert(normalizeLicense("MIT") === "MIT");
  });

  it("extracts type from legacy object licenses", () => {
    assert(normalizeLicense({ type: "Apache-2.0" }) === "Apache-2.0");
  });

  it("returns undefined for empty licenses", () => {
    assert(normalizeLicense(undefined) === undefined);
    assert(normalizeLicense("") === undefined);
  });

  it("returns undefined for malformed object licenses", () => {
    // @ts-expect-error: malformed input
    assert(normalizeLicense({}) === undefined);
    assert(
      // @ts-expect-error: malformed input
      normalizeLicense({ type: 123 }) === undefined,
    );
  });
});
