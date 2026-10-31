import { splitPackageName } from "./package-name";

function isCreatePackage(packageName: string): boolean {
  return splitPackageName(packageName).name.startsWith("create-");
}

function getCreatePackageName(packageName: string): string {
  const { org, name } = splitPackageName(packageName);
  return org ? `${org}/create-${name}` : `create-${name}`;
}

function getCreateShortName(createPackageName: string): string | null {
  const { org, name } = splitPackageName(createPackageName);

  if (!name.startsWith("create-")) {
    return name === "create" ? org : null;
  }

  const sliced = name.slice("create-".length);

  return org ? `${org}/${sliced}` : sliced;
}

export { isCreatePackage, getCreatePackageName, getCreateShortName };
