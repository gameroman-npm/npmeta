import assert from "node:assert/strict";
import { it, describe } from "node:test";

import {
  getTypesPackageName,
  splitPackageName,
  encodePackageName,
} from "npmeta";

describe("splitPackageName", () => {
  it("handles unscoped packages", () => {
    const { org, name } = splitPackageName("astro");
    assert(org === "");
    assert(name === "astro");
  });

  it("handles scoped packages", () => {
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

describe("encodePackageName", () => {
  it("handles unscoped package", () => {
    assert(encodePackageName("astro") === "astro");
  });

  it("handles scoped package", () => {
    assert(encodePackageName("@clack/prompts") === "@clack%2Fprompts");
  });
});
