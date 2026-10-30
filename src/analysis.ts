import { hasBin } from "./binary-detection";

interface ExportsAnalysis {
  hasImport: boolean;
  hasRequire: boolean;
  hasModule: boolean;
  hasTypes: boolean;
}

function analyzeExports(
  exports: PackageExports,
  isTypeModule: boolean,
  depth = 0,
): ExportsAnalysis {
  const result: ExportsAnalysis = {
    hasImport: false,
    hasRequire: false,
    hasModule: false,
    hasTypes: false,
  };

  // Prevent infinite recursion
  if (depth > 10) return result;

  if (exports == null) {
    return result;
  }

  if (typeof exports === "string") {
    if (exports === "./package.json") {
      return result;
    }

    // Check file extension for format hints
    if (
      exports.endsWith(".mjs") ||
      exports.endsWith(".mts") ||
      exports.endsWith(".json")
    ) {
      result.hasImport = true;
    } else if (exports.endsWith(".cjs") || exports.endsWith(".cts")) {
      result.hasRequire = true;
    } else if (exports.endsWith(".js")) {
      // A bare .js file has no format of its own. Node resolves it against the
      // package's "type" field. Without this, an ESM package that points its
      // conditions at .js files gives off no ESM signal at all, and a single
      // .cjs subpath elsewhere in the tree is enough to classify it as CJS.
      if (isTypeModule) {
        result.hasImport = true;
      } else {
        result.hasRequire = true;
      }
    }
    if (
      exports.endsWith(".d.ts") ||
      exports.endsWith(".d.mts") ||
      exports.endsWith(".d.cts")
    ) {
      result.hasTypes = true;
    }
    return result;
  }

  if (Array.isArray(exports)) {
    for (const item of exports) {
      const subResult = analyzeExports(item, isTypeModule, depth + 1);
      mergeExportsAnalysis(result, subResult);
    }
    return result;
  }

  if (typeof exports === "object") {
    for (const [key, value] of Object.entries(exports)) {
      // Check condition keys
      if (key === "import") {
        result.hasImport = true;
      } else if (key === "require") {
        result.hasRequire = true;
      } else if (key === "module") {
        result.hasModule = true;
      } else if (key === "types") {
        result.hasTypes = true;
      }

      // Recurse into nested exports
      const subResult = analyzeExports(value, isTypeModule, depth + 1);
      mergeExportsAnalysis(result, subResult);
    }
  }

  return result;
}

function mergeExportsAnalysis(
  target: ExportsAnalysis,
  source: ExportsAnalysis,
): void {
  target.hasImport ||= source.hasImport;
  target.hasRequire ||= source.hasRequire;
  target.hasModule ||= source.hasModule;
  target.hasTypes ||= source.hasTypes;
}

type ModuleFormat =
  | "esm"
  | "cjs"
  | "dual"
  | "wasm"
  | "binary"
  | "empty"
  | "unknown";

/**
 * Extended package.json fields
 */
interface ExtendedPackageJson {
  name?: string;
  version?: string;
  type?: "module" | "commonjs";
  main?: string;
  module?: string;
  types?: string;
  typings?: string;
  exports?: PackageExports;
  bin?: string | Record<string, string>;
  engines?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

type PackageExports =
  | string
  | null
  | { [key: string]: PackageExports }
  | PackageExports[];

/**
 * Detect the module format of a package based on package.json fields
 */
function detectModuleFormat(pkg: ExtendedPackageJson): ModuleFormat {
  const hasExports = pkg.exports != null;
  const hasModule = !!pkg.module;
  const hasMain = !!pkg.main;

  if (!hasExports && !hasModule && !hasMain) {
    if (hasBin(pkg)) {
      return "binary";
    }

    return "empty";
  }

  const isTypeModule = pkg.type === "module";
  const isTypeCommonjs = pkg.type === "commonjs" || !pkg.type;

  // Check exports field for dual format indicators
  if (hasExports && pkg.exports) {
    const exportInfo = analyzeExports(pkg.exports, isTypeModule);

    if (exportInfo.hasImport && exportInfo.hasRequire) {
      return "dual";
    }

    if (exportInfo.hasImport || exportInfo.hasModule) {
      // Has ESM exports, check if also has CJS
      if (hasMain && !isTypeModule) {
        return "dual";
      }
      return "esm";
    }

    if (exportInfo.hasRequire) {
      // Has CJS exports, check if also has ESM
      if (hasModule) {
        return "dual";
      }
      return "cjs";
    }

    // exports field exists but doesn't use import/require conditions
    // Fall through to other detection methods
  }

  // Legacy detection without exports field
  if (hasModule && hasMain) {
    // Check for dual packages (has module field and main points to cjs)
    const mainIsCJS =
      pkg.main?.endsWith(".cjs") ||
      (pkg.main?.endsWith(".js") && !isTypeModule);

    return mainIsCJS ? "dual" : "esm";
  }

  const mainIsWASM = pkg.main?.endsWith(".wasm");
  if (mainIsWASM) {
    return "wasm";
  }

  if (hasModule || isTypeModule) {
    return "esm";
  }

  if (hasMain || isTypeCommonjs) {
    return "cjs";
  }

  return "unknown";
}

function hasBuiltInTypes(pkg: ExtendedPackageJson): boolean {
  // Check types/typings field
  if (pkg.types || pkg.typings) {
    return true;
  }

  // Check exports field for types
  if (pkg.exports) {
    const exportInfo = analyzeExports(pkg.exports, pkg.type === "module");
    if (exportInfo.hasTypes) {
      return true;
    }
  }

  return false;
}

export { detectModuleFormat, hasBuiltInTypes };

export type { ModuleFormat };
