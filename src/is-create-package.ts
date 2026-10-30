function isCreatePackage(packageName: string): boolean {
  const baseName = packageName.startsWith("@")
    ? packageName.split("/")[1]
    : packageName;

  return (
    baseName?.startsWith("create-") || packageName.includes("/create-") || false
  );
}

export { isCreatePackage };
