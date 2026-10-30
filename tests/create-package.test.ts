import assert from "node:assert/strict";
import { it, describe } from "node:test";

import {
  getCreatePackageName,
  getCreateShortName,
  isCreatePackage,
} from "npmeta";

describe("isCreatePackage", () => {
  it("returns true for create-* packages", () => {
    assert.strictEqual(isCreatePackage("create-vite"), true);
    assert.strictEqual(isCreatePackage("create-svelte-app"), true);
    assert.strictEqual(isCreatePackage("create-lit-app"), true);
  });

  it("returns true for scoped create-* packages", () => {
    assert.strictEqual(isCreatePackage("@lit/create-lit"), true);
    assert.strictEqual(isCreatePackage("@scope/create-something"), true);
  });

  it("returns false for non-create packages", () => {
    assert.strictEqual(isCreatePackage("vite"), false);
    assert.strictEqual(isCreatePackage("lit"), false);
    assert.strictEqual(isCreatePackage("my-create-tool"), false);
  });

  it("returns false for scoped non-create packages", () => {
    assert.strictEqual(isCreatePackage("@scope/some-package"), false);
  });
});

describe("getCreatePackageName", () => {
  it("handles unscoped package", () => {
    assert.strictEqual(getCreatePackageName("vite"), "create-vite");
  });

  it("handles scoped package", () => {
    assert.strictEqual(getCreatePackageName("@nuxt/app"), "@nuxt/create-app");
  });

  it("handles single-word package", () => {
    assert.strictEqual(getCreatePackageName("next"), "create-next");
  });

  it("handles hyphenated package", () => {
    assert.strictEqual(getCreatePackageName("solid-js"), "create-solid-js");
  });
});

describe("getCreateShortName", () => {
  it("extracts name from unscoped create-* package", () => {
    assert.strictEqual(getCreateShortName("create-vite"), "vite");
  });

  it("extracts name from scoped create-* package preserving scope", () => {
    assert.strictEqual(getCreateShortName("@vue/create-app"), "@vue/app");
  });

  it("returns null if not a create-* package", () => {
    assert.strictEqual(getCreateShortName("vite"), null);
  });

  it("returns null for scoped package without create- prefix", () => {
    assert.strictEqual(getCreateShortName("@scope/foo"), null);
  });

  it("extracts name from create-next-app style packages", () => {
    assert.strictEqual(getCreateShortName("create-next-app"), "next-app");
  });

  it("returns scope only for @scope/create packages", () => {
    assert.strictEqual(getCreateShortName("@angular/create"), "@angular");
  });
});
