function isCreatePackage(packageName: string): boolean {
  const baseName = packageName.startsWith("@")
    ? packageName.split("/")[1]
    : packageName;

  return (
    baseName?.startsWith("create-") || packageName.includes("/create-") || false
  );
}

function getCreatePackageName(packageName: string): string {
  if (packageName.startsWith("@")) {
    // Scoped package: @scope/name -> @scope/create-name
    const slashIndex = packageName.indexOf("/");
    const scope = packageName.slice(0, slashIndex);
    const name = packageName.slice(slashIndex + 1);
    return `${scope}/create-${name}`;
  }
  return `create-${packageName}`;
}

function getCreateShortName(createPackageName: string): string {
  if (createPackageName.startsWith("@")) {
    // @scope/create -> @scope, @scope/create-foo -> @scope/foo
    const slashIndex = createPackageName.indexOf("/");
    const scope = createPackageName.slice(0, slashIndex);
    const name = createPackageName.slice(slashIndex + 1);
    if (name === "create") {
      return scope;
    }
    if (name.startsWith("create-")) {
      return `${scope}/${name.slice("create-".length)}`;
    }
    return createPackageName;
  }
  // create-vite -> vite
  if (createPackageName.startsWith("create-")) {
    return createPackageName.slice("create-".length);
  }
  return createPackageName;
}

export { isCreatePackage, getCreatePackageName, getCreateShortName };
