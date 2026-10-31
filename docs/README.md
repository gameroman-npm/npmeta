# `npmeta`

Zero-dependency utilities for parsing npm package metadata: package specs, package names, dependency version values, module formats.

## Install

```sh
npm install npmeta
```

## Usage

```js
import { parsePackageSpec } from "npmeta";

parsePackageSpec("react@18.2.0");
// => { name: "react", version: "18.2.0" }
```

## API

### `parsePackageSpec(input)`

Splits a package spec into a name and an optional version.

```ts
parsePackageSpec(input: string): { name: string; version?: string }
```

```js
parsePackageSpec("react");
// => { name: "react" }

parsePackageSpec("react@18.2.0");
// => { name: "react", version: "18.2.0" }

parsePackageSpec("@babel/core");
// => { name: "@babel/core" }

parsePackageSpec("@babel/core@^7.24.0");
// => { name: "@babel/core", version: "^7.24.0" }

parsePackageSpec("vite@next");
// => { name: "vite", version: "next" }
```

### `parseDependencyVersion(value)`

Parses the dependency entry in `package.json`.

```ts
parseDependencyVersion(value: string): {
  name: string | null;
  range: string | null;
}
```

```js
parseDependencyVersion("^1.2.3");
// => { name: null, range: "^1.2.3" }

parseDependencyVersion("npm:lodash-es@^4.17.21");
// => { name: "lodash-es", range: "^4.17.21" }

parseDependencyVersion("npm:@babel/core@7.24.0");
// => { name: "@babel/core", range: "7.24.0" }

parseDependencyVersion("workspace:*");
// => { name: null, range: null }

parseDependencyVersion("github:user/repo");
// => { name: null, range: null }

parseDependencyVersion("file:../local");
// => { name: null, range: null }
```

### `splitPackageName(packageName)`

Splits a package name into org and name.

```ts
splitPackageName(packageName: string): {
  org: string;
  scope: string | null;
  name: string;
}
```

```js
splitPackageName("react");
// => { org: "", scope: null, name: "react" }

splitPackageName("@babel/core");
// => { org: "@babel", scope: "babel", name: "core" }
```

### `getTypesPackageName(packageName)`

Returns the corresponding `@types` package name.

```ts
getTypesPackageName(packageName: string): string
```

```js
getTypesPackageName("lodash");
// => "@types/lodash"

getTypesPackageName("@babel/core");
// => "@types/babel__core"
```

### `encodePackageName`

Encodes a package name for use in URLs.

```ts
encodePackageName(name: string): string
```

```js
encodePackageName("@babel/core");
// => "@babel%2Fcore"
```

### `detectModuleFormat(pkg)`

Detects the module format of a package from its `package.json` fields.

```ts
detectModuleFormat(pkg: PackageJson): ModuleFormat

type ModuleFormat = "esm" | "cjs" | "dual" | "wasm" | "binary" | "empty";
```

| Result     | Meaning                       |
| ---------- | ----------------------------- |
| `"esm"`    | ESM only                      |
| `"cjs"`    | CommonJS only                 |
| `"dual"`   | Both ESM and CJS entry points |
| `"wasm"`   | WASM package                  |
| `"binary"` | Bin-only package              |
| `"empty"`  | No entry points at all        |

```js
detectModuleFormat({ type: "module", exports: "./dist/index.mjs" });
// => "esm"

detectModuleFormat({ main: "index.js" });
// => "cjs"

detectModuleFormat({
  type: "module",
  exports: {
    ".": {
      import: "./dist/index.mjs",
      require: "./dist/index.cjs",
    },
  },
});
// => "dual"

detectModuleFormat({ bin: "cli.js" });
// => "binary"
```

### `hasBuiltInTypes(pkg)`

Checks whether a package provides built-in TypeScript types via the `types`/`typings` field or a `types` condition / `.d.ts` file in `exports`.

```ts
hasBuiltInTypes(pkg: PackageJson): boolean
```

```js
hasBuiltInTypes({ types: "./dist/index.d.ts" });
// => true

hasBuiltInTypes({
  exports: {
    ".": {
      types: "./dist/index.d.mts",
      import: "./dist/index.mjs",
    },
  },
});
// => true

hasBuiltInTypes({ main: "index.js" });
// => false
```

### `hasBin(bin)`

Checks whether a `bin` field describes any binary

```ts
hasBin(bin: PackageBinField): boolean
```

```js
hasBin("cli.js");
// => true

hasBin({ npmeta: "cli.js" });
// => true

hasBin(undefined);
// => false

hasBin({});
// => false
```

### `isBinaryOnlyPackage(pkg)`

Checks whether a package is binary-only (it has a `bin` field but no entry point). Retruns `true` for create-packages.

```ts
isBinaryOnlyPackage(pkg: PackageJson): boolean
```

```js
isBinaryOnlyPackage({ name: "remix", bin: "cli.js" });
// => true

isBinaryOnlyPackage({ name: "remix", bin: "cli.js", main: "index.js" });
// => false

isBinaryOnlyPackage({ name: "create-vite" });
// => true
```

### `isCreatePackage(packageName)`

Detects whether a package name is a create-package.

```ts
isCreatePackage(packageName: string): boolean
```

```js
isCreatePackage("create-vite");
// => true

isCreatePackage("vite-create");
// => false

isCreatePackage("@vue/create-vite");
// => true
```

### `getCreatePackageName(packageName)`

Returns the corresponding create-package name.

```ts
getCreatePackageName(packageName: string): string
```

```js
getCreatePackageName("vite");
// => "create-vite"

getCreatePackageName("@myorg/tool");
// => "@myorg/create-tool"
```

### `getCreateShortName(createPackageName)`

Converts a create-package name to its short form (the inverse of `getCreatePackageName`). Returns `null` if the name isn't a create-package.

```ts
getCreateShortName(createPackageName: string): string | null
```

```js
getCreateShortName("create-vite");
// => "vite"

getCreateShortName("@vue/create-vite");
// => "@vue/vite"

getCreateShortName("@remix-run/create");
// => "@remix-run"

getCreateShortName("vite");
// => null
```

### `normalizeLicense(license)`

Normalizes the `license` field.

```ts
normalizeLicense(license?: string | { type: string }): string | undefined
```

```js
normalizeLicense("MIT");
// => "MIT"

normalizeLicense({ type: "MIT" });
// => "MIT"

normalizeLicense(undefined);
// => undefined
```
