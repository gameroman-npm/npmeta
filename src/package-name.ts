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
  return name.replace("/", "%2F");
}

export { splitPackageName, getTypesPackageName, encodePackageName };
