export const STORE_APP_ID = 6811033480;
export const STORE_BUNDLE_ID = 'app.physicsquest.game';
export const STORE_URL = `https://apps.apple.com/jp/app/id${STORE_APP_ID}`;

/** Compare numeric release versions, not lexicographic strings (1.10 > 1.9). */
export function isNewerVersion(candidate: string, installed: string): boolean {
  if (![candidate, installed].every(v => /^\d+(\.\d+){0,3}$/.test(v))) return false;
  const a = candidate.split('.').map(Number), b = installed.split('.').map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) > (b[i] ?? 0);
  }
  return false;
}

export function availableStoreVersion(data: unknown, installed: string): string | null {
  if (!data || typeof data !== 'object' || !('results' in data) || !Array.isArray(data.results)) return null;
  const app = data.results.find((item: unknown) => item && typeof item === 'object'
    && 'bundleId' in item && item.bundleId === STORE_BUNDLE_ID
    && 'trackId' in item && item.trackId === STORE_APP_ID);
  return typeof app?.version === 'string' && isNewerVersion(app.version, installed) ? app.version : null;
}
