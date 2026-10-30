export { detectModuleFormat, hasBuiltInTypes } from "./analysis";
export type { ModuleFormat } from "./analysis";

export { isBinaryOnlyPackage } from "./binary-detection";

export {
  isCreatePackage,
  getCreatePackageName,
  getCreateShortName,
} from "./create-package";

export { parseDependencyVersion } from "./dependency-version";

export { normalizeLicense } from "./normalize";

export {
  splitPackageName,
  getTypesPackageName,
  encodePackageName,
} from "./package-name";

export { parsePackageSpec } from "./package-spec";
