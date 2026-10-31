function parsePackageSpec(input: string): {
  name: string;
  version?: string;
} {
  const trimmedInput = input.trim();
  // Skip a scope's leading "@" and split on the first "@" after it, so a
  // version that itself contains "@" (e.g. an `npm:` alias) stays intact
  const atPos = trimmedInput.indexOf("@", 1);
  if (atPos <= 0) return { name: trimmedInput };
  const name = trimmedInput.slice(0, atPos).trim();
  const version = trimmedInput.slice(atPos + 1).trim();
  return { name, version };
}

export { parsePackageSpec };
