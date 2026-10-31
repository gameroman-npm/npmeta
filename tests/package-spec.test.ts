import assert from "node:assert/strict";
import { it, describe } from "node:test";

import { parsePackageSpec } from "npmeta";

describe("parsePackageSpec", () => {
  it("handles unscoped packages", () => {
    const { name, version } = parsePackageSpec(" astro ");
    assert.strictEqual(name, "astro");
    assert.strictEqual(version, undefined);
  });

  it("handles scoped packages", () => {
    const { name, version } = parsePackageSpec(" @clack/prompts ");
    assert.strictEqual(name, "@clack/prompts");
    assert.strictEqual(version, undefined);
  });

  it("handles unscoped packages with version", () => {
    const { name, version } = parsePackageSpec(" vite @ 7 ");
    assert.strictEqual(name, "vite");
    assert.strictEqual(version, "7");
  });

  it("handles scoped packages with version", () => {
    const { name, version } = parsePackageSpec(" @biomejs/biome @ 2.5.0 ");
    assert.strictEqual(name, "@biomejs/biome");
    assert.strictEqual(version, "2.5.0");
  });

  it("handles a trailing @ without version", () => {
    const { name, version } = parsePackageSpec("react@");
    assert.strictEqual(name, "react");
    assert.strictEqual(version, "");
  });

  it("handles empty and whitespace-only input", () => {
    const { name, version } = parsePackageSpec(" ");
    assert.strictEqual(name, "");
    assert.strictEqual(version, undefined);
  });
});
