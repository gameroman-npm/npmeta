import { isCreatePackage } from "./create-package";
import type { PackageBinField, PackageJson } from "./types";

function hasBin(bin: PackageBinField): boolean {
  return (
    bin != null && (typeof bin === "string" || Object.keys(bin).length > 0)
  );
}

function isBinaryOnlyPackage(pkg: PackageJson): boolean {
  if (pkg.name && isCreatePackage(pkg.name)) {
    return true;
  }

  const hasEntryPoint = !!pkg.main || !!pkg.module || pkg.exports != null;

  return hasBin(pkg.bin) && !hasEntryPoint;
}

export { isBinaryOnlyPackage, hasBin };
export type { PackageBinField };
