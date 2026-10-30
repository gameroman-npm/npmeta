function splitPackageName(packageName: string): { org: string; name: string } {
  const [org = "", name = ""] = packageName.startsWith("@")
    ? packageName.split("/")
    : ["", packageName];

  return { org, name };
}

export { splitPackageName };
