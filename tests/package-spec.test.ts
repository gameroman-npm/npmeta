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

  it("keeps an @ inside the version", () => {
    const { name, version } = parsePackageSpec("foo@npm:bar@1");
    assert.strictEqual(name, "foo");
    assert.strictEqual(version, "npm:bar@1");
  });

  it("keeps an @ inside the version of a scoped package", () => {
    const { name, version } = parsePackageSpec("@scope/foo@npm:@scope/bar@1");
    assert.strictEqual(name, "@scope/foo");
    assert.strictEqual(version, "npm:@scope/bar@1");
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
