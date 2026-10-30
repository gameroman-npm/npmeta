function parsePackageSpec(input: string): {
  name: string;
  version?: string;
} {
  const trimmedInput = input.trim();
  const atPos = trimmedInput.lastIndexOf("@");
  if (atPos <= 0) return { name: trimmedInput };
  const name = trimmedInput.slice(0, atPos).trim();
  const version = trimmedInput.slice(atPos + 1).trim();
  return { name, version };
}

export { parsePackageSpec };
