import assert from "node:assert/strict";
import { it, describe } from "node:test";

import { parsePackageSpec } from "npmeta";

describe("parsePackageSpec", () => {
  it("should handle non-scoped packages", () => {
    const { name, version } = parsePackageSpec(" astro ");
    assert(name === "astro");
    assert(version === undefined);
  });

  it("should handle scoped packages", () => {
    const { name, version } = parsePackageSpec(" @clack/prompts ");
    assert(name === "@clack/prompts");
    assert(version === undefined);
  });

  it("should handle non-scoped packages with version", () => {
    const { name, version } = parsePackageSpec(" vite @ 7 ");
    assert(name === "vite");
    assert(version === "7");
  });

  it("should handle scoped packages with version", () => {
    const { name, version } = parsePackageSpec(" @biomejs/biome @ 2.5.0 ");
    assert(name === "@biomejs/biome");
    assert(version === "2.5.0");
  });

  it("should handle and empty and whitespace-only input", () => {
    const { name, version } = parsePackageSpec(" ");
    assert(name === "");
    assert(version === undefined);
  });
});
