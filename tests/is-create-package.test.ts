import assert from "node:assert/strict";
import { it, describe } from "node:test";

import { isCreatePackage } from "npmeta";

describe("isCreatePackage", () => {
  it("returns true for create-* packages", () => {
    assert(isCreatePackage("create-vite") === true);
    assert(isCreatePackage("create-svelte-app") === true);
    assert(isCreatePackage("create-lit-app") === true);
  });

  it("returns true for scoped create-* packages", () => {
    assert(isCreatePackage("@lit/create-lit") === true);
    assert(isCreatePackage("@scope/create-something") === true);
  });

  it("returns false for non-create packages", () => {
    assert(isCreatePackage("vite") === false);
    assert(isCreatePackage("lit") === false);
    assert(isCreatePackage("my-create-tool") === false);
  });

  it("returns false for scoped non-create packages", () => {
    assert(isCreatePackage("@scope/some-package") === false);
  });
});
