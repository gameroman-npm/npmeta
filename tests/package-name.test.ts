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
    assert.strictEqual(org, "");
    assert.strictEqual(name, "astro");
  });

  it("handles scoped packages", () => {
    const { org, name } = splitPackageName("@clack/prompts");
    assert.strictEqual(org, "@clack");
    assert.strictEqual(name, "prompts");
  });
});

describe("getTypesPackageName", () => {
  it("handles unscoped package", () => {
    assert.strictEqual(getTypesPackageName("lodash"), "@types/lodash");
  });

  it("handles scoped package", () => {
    assert.strictEqual(getTypesPackageName("@nuxt/kit"), "@types/nuxt__kit");
  });
});

describe("encodePackageName", () => {
  it("handles unscoped package", () => {
    assert.strictEqual(encodePackageName("astro"), "astro");
  });

  it("handles scoped package", () => {
    assert.strictEqual(encodePackageName("@clack/prompts"), "@clack%2Fprompts");
  });
});
