type PackageBinField = string | Record<string, string> | undefined;

interface PackageJson {
  name?: string;
  version?: string;
  type?: "module" | "commonjs";
  main?: string;
  module?: string;
  exports?: unknown;
  types?: string;
  typings?: string;
  bin?: PackageBinField;
}

export type { PackageJson, PackageBinField };
