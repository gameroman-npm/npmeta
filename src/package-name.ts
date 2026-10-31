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
  // Keep the scope's leading "@" readable, but encode everything else so that
  // untrusted input can't inject path segments, a query or a fragment
  if (name.startsWith("@")) {
    return `@${encodeURIComponent(name.slice(1))}`;
  }
  return encodeURIComponent(name);
}

export { splitPackageName, getTypesPackageName, encodePackageName };
