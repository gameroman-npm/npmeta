import assert from "node:assert/strict";
import { it, describe } from "node:test";

import { splitPackageName } from "npmeta";

describe("splitPackageName", () => {
  it("should handle non-scoped packages", () => {
    const { org, name } = splitPackageName("astro");
    assert(org === "");
    assert(name === "astro");
  });

  it("should handle scoped packages", () => {
    const { org, name } = splitPackageName("@clack/prompts");
    assert(org === "@clack");
    assert(name === "prompts");
  });
});
