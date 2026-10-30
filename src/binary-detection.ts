import { isCreatePackage } from "./create-package";

interface PackageMetadata {
  name: string;
  bin?: string | Record<string, string>;
  main?: string;
  module?: unknown;
  exports?: unknown;
}

function hasBin(pkg: Pick<PackageMetadata, "bin">): boolean {
  return (
    pkg.bin != null &&
    (typeof pkg.bin === "string" || Object.keys(pkg.bin).length > 0)
  );
}

function isBinaryOnlyPackage(pkg: PackageMetadata): boolean {
  if (isCreatePackage(pkg.name)) {
    return true;
  }

  const hasEntryPoint = !!pkg.main || !!pkg.module || pkg.exports != null;

  return hasBin(pkg) && !hasEntryPoint;
}

export { isBinaryOnlyPackage, hasBin };
