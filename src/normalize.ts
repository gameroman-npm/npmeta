function normalizeLicense(
  license?: string | { type: string },
): string | undefined {
  if (!license) return undefined;
  if (typeof license === "string") return license;
  if (typeof license.type === "string") return license.type;
  return undefined;
}

export { normalizeLicense };
