import assert from "node:assert/strict";
import { it, describe } from "node:test";

import { detectModuleFormat, hasBuiltInTypes } from "npmeta";

describe("detectModuleFormat", () => {
  it("detects ESM from type: module", () => {
    assert.strictEqual(
      detectModuleFormat({ type: "module", main: "index.js" }),
      "esm",
    );
  });

  it("detects CJS from type: commonjs", () => {
    assert.strictEqual(
      detectModuleFormat({ type: "commonjs", main: "index.js" }),
      "cjs",
    );
  });

  it("detects empty packages", () => {
    assert.strictEqual(detectModuleFormat({}), "empty");
    assert.strictEqual(
      detectModuleFormat({ name: "npmeta", version: "0.1.0" }),
      "empty",
    );
  });

  it("detects CJS when no type field (default)", () => {
    assert.strictEqual(detectModuleFormat({ main: "index.js" }), "cjs");
  });

  it("detects ESM from module field without main", () => {
    assert.strictEqual(detectModuleFormat({ module: "index.mjs" }), "esm");
  });

  it("detects dual from module + main fields", () => {
    assert.strictEqual(
      detectModuleFormat({ module: "index.mjs", main: "index.js" }),
      "dual",
    );
  });

  it("detects dual from type + module + main fields", () => {
    assert.strictEqual(
      detectModuleFormat({
        type: "module",
        module: "index.js",
        main: "index.cjs",
      }),
      "dual",
    );
  });

  it("detects esm from type + module + main fields", () => {
    assert.strictEqual(
      detectModuleFormat({
        type: "module",
        module: "index.js",
        main: "index.js",
      }),
      "esm",
    );
  });

  it("detects dual from exports with import + require conditions", () => {
    assert.strictEqual(
      detectModuleFormat({
        exports: {
          ".": {
            import: "./index.mjs",
            require: "./index.cjs",
          },
        },
      }),
      "dual",
    );
  });

  it("detects ESM from exports with only import condition", () => {
    assert.strictEqual(
      detectModuleFormat({
        type: "module",
        exports: {
          ".": {
            import: "./index.js",
          },
        },
      }),
      "esm",
    );
  });

  it("detects CJS from exports with only require condition", () => {
    assert.strictEqual(
      detectModuleFormat({
        exports: {
          ".": {
            require: "./index.cjs",
          },
        },
      }),
      "cjs",
    );
  });

  it("detects dual from nested exports with both conditions", () => {
    assert.strictEqual(
      detectModuleFormat({
        exports: {
          ".": {
            import: {
              types: "./dist/index.d.mts",
              default: "./dist/index.mjs",
            },
            require: {
              types: "./dist/index.d.ts",
              default: "./dist/index.cjs",
            },
          },
        },
      }),
      "dual",
    );
  });

  it("detect dual from JSON exports", () => {
    assert.strictEqual(
      detectModuleFormat({
        main: "test.json",
        exports: {
          ".": "./test.json",
        },
      }),
      "dual",
    );
  });

  it("detect esm from JSON exports", () => {
    assert.strictEqual(
      detectModuleFormat({
        exports: {
          ".": "./test.json",
        },
      }),
      "esm",
    );
  });

  it("detects ESM when a type: module package uses default conditions", () => {
    assert.strictEqual(
      detectModuleFormat({
        type: "module",
        exports: {
          ".": {
            types: "./dist/index.d.ts",
            default: "./dist/index.js",
          },
        },
      }),
      "esm",
    );
  });

  it("preserves type: module through export fallback arrays", () => {
    // The .js sits behind a fallback array, so this only resolves to ESM if the
    // package type survives the recursion into the array
    assert.strictEqual(
      detectModuleFormat({
        type: "module",
        exports: {
          ".": ["./dist/index.js"],
          "./init": "./dist/init.cjs",
        },
      }),
      "dual",
    );
  });

  it("detects dual when a type: module package also exports a .cjs subpath", () => {
    // A .js entry in a type: module package is ESM, so a CJS subpath elsewhere
    // makes the package dual rather than reclassifying the whole thing as CJS
    assert.strictEqual(
      detectModuleFormat({
        type: "module",
        exports: {
          ".": {
            types: "./dist/index.d.ts",
            default: "./dist/index.js",
          },
          "./init": {
            types: "./dist/init.d.cts",
            default: "./dist/init.cjs",
          },
        },
      }),
      "dual",
    );
  });

  it("detects CJS when a commonjs package uses default conditions", () => {
    assert.strictEqual(
      detectModuleFormat({
        type: "commonjs",
        exports: {
          ".": {
            types: "./dist/index.d.ts",
            default: "./dist/index.js",
          },
        },
      }),
      "cjs",
    );
  });

  it("ignores a re-exported package.json when inferring format", () => {
    // "./package.json": "./package.json" is boilerplate, not an ESM entry point
    assert.strictEqual(
      detectModuleFormat({
        type: "commonjs",
        exports: {
          ".": {
            types: "./dist/index.d.ts",
            default: "./dist/index.js",
          },
          "./package.json": "./package.json",
        },
      }),
      "cjs",
    );
  });

  it("detects WASM from main field", () => {
    assert.strictEqual(detectModuleFormat({ main: "main.wasm" }), "wasm");
  });

  it("detects binary-only packages", () => {
    assert.strictEqual(
      detectModuleFormat({
        name: "typescript",
        bin: { tsc: "./bin/tsc", tsserver: "./bin/tsserver" },
      }),
      "binary",
    );
  });
});

describe("hasBuiltInTypes", () => {
  it("returns true when types field is present", () => {
    assert.strictEqual(hasBuiltInTypes({ types: "./index.d.ts" }), true);
  });

  it("returns true when typings field is present", () => {
    assert.strictEqual(hasBuiltInTypes({ typings: "./index.d.ts" }), true);
  });

  it("returns true when exports has types condition", () => {
    assert.strictEqual(
      hasBuiltInTypes({
        exports: { ".": { types: "./index.d.ts", default: "./index.js" } },
      }),
      true,
    );
  });

  it("returns false when no types are present", () => {
    assert.strictEqual(hasBuiltInTypes({ main: "index.js" }), false);
  });

  it("returns false for empty package", () => {
    assert.strictEqual(hasBuiltInTypes({}), false);
  });
});
