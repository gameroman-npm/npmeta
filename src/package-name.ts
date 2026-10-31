function splitPackageName(packageName: string): {
  org: string;
  scope: string | null;
  name: string;
} {
  const [org = "", name = ""] = packageName.startsWith("@")
    ? packageName.split("/")
    : ["", packageName];

  const scope = org ? org.slice(1) : null;

  return { org, scope, name };
}

function getTypesPackageName(packageName: string): string {
  const { scope, name } = splitPackageName(packageName);
  return scope ? `@types/${scope}__${name}` : `@types/${name}`;
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
