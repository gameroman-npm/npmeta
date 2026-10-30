function splitPackageName(packageName: string): { org: string; name: string } {
  const [org = "", name = ""] = packageName.startsWith("@")
    ? packageName.split("/")
    : ["", packageName];

  return { org, name };
}

function getTypesPackageName(packageName: string): string {
  if (packageName.startsWith("@")) {
    return `@types/${packageName.slice(1).replace("/", "__")}`;
  }
  return `@types/${packageName}`;
}

function encodePackageName(name: string): string {
  return name.replace("/", "%2F");
}

export { splitPackageName, getTypesPackageName, encodePackageName };
