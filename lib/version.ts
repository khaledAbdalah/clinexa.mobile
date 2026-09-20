/** Compares two dotted version strings (e.g. "1.2.10" vs "1.3.0"). Returns -1, 0, or 1. */
export function compareVersions(a: string, b: string): number {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);
  const length = Math.max(aParts.length, bParts.length);

  for (let i = 0; i < length; i++) {
    const aPart = aParts[i] ?? 0;
    const bPart = bParts[i] ?? 0;
    if (aPart !== bPart) return aPart < bPart ? -1 : 1;
  }

  return 0;
}

/** Whether `currentVersion` is older than `minVersion`. */
export function isVersionBelow(currentVersion: string, minVersion: string): boolean {
  return compareVersions(currentVersion, minVersion) < 0;
}
