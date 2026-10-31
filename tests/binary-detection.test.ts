import assert from "node:assert/strict";
import { it, describe } from "node:test";

import { isBinaryOnlyPackage, hasBin } from "npmeta";

describe("isBinaryOnlyPackage", () => {
  it("returns true for create-* packages regardless of fields", () => {
    assert.strictEqual(isBinaryOnlyPackage({ name: "create-vite" }), true);
    assert.strictEqual(
      isBinaryOnlyPackage({ name: "create-vite", main: "./index.js" }),
      true,
    );
  });

  it("returns true for scoped create-* packages", () => {
    assert.strictEqual(isBinaryOnlyPackage({ name: "@lit/create-lit" }), true);
  });

  it("returns true for packages with bin but no entry points", () => {
    assert.strictEqual(
      isBinaryOnlyPackage({ name: "eslint", bin: "./bin/eslint.js" }),
      true,
    );
    assert.strictEqual(
      isBinaryOnlyPackage({
        name: "typescript",
        bin: { tsc: "./bin/tsc", tsserver: "./bin/tsserver" },
      }),
      true,
    );
  });

  it("returns false for packages with bin and main", () => {
    assert.strictEqual(
      isBinaryOnlyPackage({
        name: "eslint",
        bin: "./bin/eslint.js",
        main: "./lib/index.js",
      }),
      false,
    );
  });

  it("returns false for packages with bin and module", () => {
    assert.strictEqual(
      isBinaryOnlyPackage({
        name: "some-pkg",
        bin: "./bin/cli.js",
        module: "./dist/index.mjs",
      }),
      false,
    );
  });

  it("returns false for packages with bin and exports", () => {
    assert.strictEqual(
      isBinaryOnlyPackage({
        name: "some-pkg",
        bin: "./bin/cli.js",
        exports: { ".": "./dist/index.js" },
      }),
      false,
    );
  });

  it("returns false for packages with no bin and no entry points", () => {
    assert.strictEqual(isBinaryOnlyPackage({ name: "some-pkg" }), false);
  });

  it("returns false for packages with empty bin object", () => {
    assert.strictEqual(
      isBinaryOnlyPackage({ name: "some-pkg", bin: {} }),
      false,
    );
  });

  it("returns false for library-only packages", () => {
    assert.strictEqual(
      isBinaryOnlyPackage({ name: "lodash", main: "./lodash.js" }),
      false,
    );
  });
});

describe("hasBin", () => {
  it("returns true when has bin", () => {
    assert.strictEqual(hasBin("./bin/eslint.js"), true);
    assert.strictEqual(
      hasBin({ tsc: "./bin/tsc", tsserver: "./bin/tsserver" }),
      true,
    );
  });

  it("returns false when does not have bin", () => {
    assert.strictEqual(hasBin(undefined), false);
    assert.strictEqual(hasBin({}), false);
  });
});
