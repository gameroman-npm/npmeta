import assert from "node:assert/strict";
import { it, describe } from "node:test";

import { parseDependencyVersion } from "../dist/index.mjs";

describe("parseDependencyVersion", () => {
  it("returns plain semver ranges without a name", () => {
    for (const value of ["^4.2.0", "1.0.0", "*", "latest"]) {
      const { name, range } = parseDependencyVersion(value);
      assert(name === null);
      assert(range === value);
    }
  });

  it("resolves unscoped npm: aliases", () => {
    const { name, range } = parseDependencyVersion("npm:string-width@^4.2.0");
    assert(name === "string-width");
    assert(range === "^4.2.0");
  });

  it("resolves scoped npm: aliases", () => {
    const { name, range } = parseDependencyVersion("npm:@scope/pkg@1.0.0");
    assert(name === "@scope/pkg");
    assert(range === "1.0.0");
  });

  it("resolves npm: aliases without a range", () => {
    for (const value of ["string-width", "@scope/pkg"]) {
      const { name, range } = parseDependencyVersion(`npm:${value}`);
      assert(name === value);
      assert(range === null);
    }
  });

  it("returns nothing resolvable for non-semver references", () => {
    for (const value of [
      "file:../foo",
      "link:../foo",
      "workspace:*",
      "git://github.com/user/repo.git",
      "git+ssh://git@github.com/user/repo.git",
      "git+https://github.com/user/repo.git",
      "github:user/repo",
      "http://example.com/pkg.tgz",
      "https://example.com/pkg.tgz",
      "user/repo",
    ]) {
      const { name, range } = parseDependencyVersion(value);
      assert(name === null);
      assert(range === null);
    }
  });

  it("treats dist-tags that look like protocols as resolvable", () => {
    for (const tag of [
      "git",
      "github",
      "gitlab",
      "http",
      "https",
      "file",
      "next",
    ]) {
      const { name, range } = parseDependencyVersion(tag);
      assert(name === null);
      assert(range === tag);
    }
  });
});
