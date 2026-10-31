import { hasBin } from "./binary-detection";
import type { PackageJson } from "./types";

interface ExportsAnalysis {
  hasImport: boolean;
  hasRequire: boolean;
  hasModule: boolean;
  hasTypes: boolean;
}

function analyzeExports(
  exports: unknown,
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

type ModuleFormat = "esm" | "cjs" | "dual" | "wasm" | "binary" | "empty";

/**
 * Detect the module format of a package based on `package.json` fields
 */
function detectModuleFormat(pkg: PackageJson): ModuleFormat {
  const hasModule = !!pkg.module;
  const hasMain = !!pkg.main;

  if (!pkg.exports && !hasModule && !hasMain) {
    if (hasBin(pkg.bin)) {
      return "binary";
    }

    return "empty";
  }

  const isTypeModule = pkg.type === "module";

  // Check exports field for dual format indicators
  if (pkg.exports) {
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

  return "cjs";
}

function hasBuiltInTypes(pkg: PackageJson): boolean {
  // Check types/typings field
  if (pkg.types || pkg.typings) {
    return true;
  }

  if (!pkg.exports) return false;

  // Check exports field for types

  const exportInfo = analyzeExports(pkg.exports, pkg.type === "module");
  return exportInfo.hasTypes;
}

export { detectModuleFormat, hasBuiltInTypes };

export type { ModuleFormat };
