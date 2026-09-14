// API origin (scheme + host + port) without the trailing `/api` path segment.
// e.g. "http://192.168.0.32:5000/api" -> "http://192.168.0.32:5000"
const API_ORIGIN = (process.env.EXPO_PUBLIC_API_URL ?? '')
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');

/**
 * Development-only fix: a dev backend serves absolute URLs pointing at `localhost`/
 * `127.0.0.1`, which a device or emulator can't reach — so we swap that host for the
 * configured API origin (the machine's LAN IP). In production media is served from a
 * real server/CDN, so URLs are returned untouched.
 */
/**
 * `version` should be a value that changes whenever the underlying file does (e.g. the
 * media record's `updatedAt`/`id`) - it's appended as a cache-busting query param so
 * `expo-image`'s disk cache (keyed by URL) refetches instead of serving a stale file
 * from a previous upload at the same URL.
 */
export function resolveMediaUrl(url?: string | null, version?: string | null): string | undefined {
  if (!url) return undefined;
  const resolved = __DEV__
    ? url.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, API_ORIGIN)
    : url;
  if (!version) return resolved;
  return `${resolved}${resolved.includes('?') ? '&' : '?'}v=${encodeURIComponent(version)}`;
}
