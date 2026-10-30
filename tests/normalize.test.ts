import assert from "node:assert/strict";
import { it, describe } from "node:test";

import { normalizeLicense } from "npmeta";

describe("normalizeLicense", () => {
  it("returns string licenses unchanged", () => {
    assert.strictEqual(normalizeLicense("MIT"), "MIT");
  });

  it("extracts type from legacy object licenses", () => {
    assert.strictEqual(normalizeLicense({ type: "Apache-2.0" }), "Apache-2.0");
  });

  it("returns undefined for empty licenses", () => {
    assert.strictEqual(normalizeLicense(undefined), undefined);
    assert.strictEqual(normalizeLicense(""), undefined);
  });

  it("returns undefined for malformed object licenses", () => {
    // @ts-expect-error: malformed input
    assert.strictEqual(normalizeLicense({}), undefined);
    assert.strictEqual(
      // @ts-expect-error: malformed input
      normalizeLicense({ type: 123 }),
      undefined,
    );
  });
});
