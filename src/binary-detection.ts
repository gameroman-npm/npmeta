import { isCreatePackage } from "./create-package";

interface PackageMetadata {
  name: string;
  bin?: string | Record<string, string>;
  main?: string;
  module?: unknown;
  exports?: unknown;
}

function isBinaryOnlyPackage(pkg: PackageMetadata): boolean {
  if (isCreatePackage(pkg.name)) {
    return true;
  }

  // Has bin but no entry points
  const hasBin =
    pkg.bin !== undefined &&
    (typeof pkg.bin === "string" || Object.keys(pkg.bin).length > 0);

  const hasEntryPoint = !!pkg.main || !!pkg.module || !!pkg.exports;

  return hasBin && !hasEntryPoint;
}

export { isBinaryOnlyPackage };
