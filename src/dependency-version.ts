import { parsePackageSpec } from "./package-spec";

/** Parsed result of an npm dependency version value */
interface ParsedDependencyVersion {
  /** The real package name (different from the dependency key only for aliases) */
  name: string | null;
  /** The semver range or version, null for non-resolvable values (file:, git, etc.) */
  range: string | null;
}

/** Git references, e.g. `git://`, `git+ssh://`, `git+https://`, `github:user/repo` */
const GIT_REFERENCE_RE = /^(?:git(?:\+(?:ssh|https?|file))?:|github:)/;
/** Tarball URLs, e.g. `https://example.com/pkg.tgz` */
const HTTP_REFERENCE_RE = /^https?:\/\//;

/**
 * Check if a constraint is a non-semver value (git URL, file path, etc.)
 *
 * Matches protocols rather than bare prefixes so that dist-tags which happen to
 * start with them (`git`, `github`, `http`) are still treated as resolvable.
 */
function isNonSemverConstraint(constraint: string): boolean {
  return (
    GIT_REFERENCE_RE.test(constraint) ||
    HTTP_REFERENCE_RE.test(constraint) ||
    constraint.startsWith("file:") ||
    constraint.startsWith("link:") ||
    constraint.startsWith("workspace:") ||
    constraint.includes("/")
  );
}

function parseDependencyVersion(value: string): ParsedDependencyVersion {
  if (value.startsWith("npm:")) {
    const { name, version } = parsePackageSpec(value.slice(4));
    return { name, range: version ?? null };
  }

  if (isNonSemverConstraint(value)) {
    return { name: null, range: null };
  }

  return { name: null, range: value };
}

export { parseDependencyVersion };
