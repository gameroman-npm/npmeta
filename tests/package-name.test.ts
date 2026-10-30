import assert from "node:assert/strict";
import { it, describe } from "node:test";

import { getTypesPackageName, splitPackageName } from "npmeta";

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

describe("getTypesPackageName", () => {
  it("handles unscoped package", () => {
    assert(getTypesPackageName("lodash") === "@types/lodash");
  });

  it("handles scoped package", () => {
    assert(getTypesPackageName("@nuxt/kit") === "@types/nuxt__kit");
  });
});
