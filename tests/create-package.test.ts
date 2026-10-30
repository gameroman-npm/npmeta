import assert from "node:assert/strict";
import { it, describe } from "node:test";

import {
  getCreatePackageName,
  getCreateShortName,
  isCreatePackage,
} from "npmeta";

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

describe("getCreatePackageName", () => {
  it("handles unscoped package", () => {
    assert(getCreatePackageName("vite") === "create-vite");
  });

  it("handles scoped package", () => {
    assert(getCreatePackageName("@nuxt/app") === "@nuxt/create-app");
  });

  it("handles single-word package", () => {
    assert(getCreatePackageName("next") === "create-next");
  });

  it("handles hyphenated package", () => {
    assert(getCreatePackageName("solid-js") === "create-solid-js");
  });
});

describe("getCreateShortName", () => {
  it("extracts name from unscoped create-* package", () => {
    assert(getCreateShortName("create-vite") === "vite");
  });

  it("extracts name from scoped create-* package preserving scope", () => {
    assert(getCreateShortName("@vue/create-app") === "@vue/app");
  });

  it("returns full name if not a create-* package", () => {
    assert(getCreateShortName("vite") === "vite");
  });

  it("returns full name for scoped package without create- prefix", () => {
    assert(getCreateShortName("@scope/foo") === "@scope/foo");
  });

  it("extracts name from create-next-app style packages", () => {
    assert(getCreateShortName("create-next-app") === "next-app");
  });

  it("returns scope only for @scope/create packages", () => {
    assert(getCreateShortName("@angular/create") === "@angular");
  });
});
