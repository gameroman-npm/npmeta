import { isCreatePackage } from "./create-package";

type PackageBinField = string | Record<string, string> | undefined;

interface PackageMetadata {
  name: string;
  bin?: PackageBinField;
  main?: string;
  module?: unknown;
  exports?: unknown;
}

function hasBin(bin: PackageBinField): boolean {
  return (
    bin != null && (typeof bin === "string" || Object.keys(bin).length > 0)
  );
}

function isBinaryOnlyPackage(pkg: PackageMetadata): boolean {
  if (isCreatePackage(pkg.name)) {
    return true;
  }

  const hasEntryPoint = !!pkg.main || !!pkg.module || pkg.exports != null;

  return hasBin(pkg.bin) && !hasEntryPoint;
}

export { isBinaryOnlyPackage, hasBin };
