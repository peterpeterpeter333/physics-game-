import manifest from '../content/video-delivery.json';
import highSchoolYouTube from '../content/high-school-youtube.generated.json';
import legacyCatalog from '../content/b2-legacy.generated.json';

const youtubeIdPattern = /^[A-Za-z0-9_-]{11}$/;

/** Only approved, uploaded video IDs belong here. Unlisted media stays local. */
export function youtubeIdFor(mediaId: string): string | null {
  const id = (highSchoolYouTube as Record<string, unknown>)[mediaId]
    ?? (manifest.videos as Record<string, unknown>)[mediaId];
  return typeof id === 'string' && youtubeIdPattern.test(id) ? id : null;
}

export function videoDeliveryKind(mediaId: string): 'youtube' | 'b2' | 'local' {
  return b2LegacyVideoUrlFor(mediaId) ? 'b2' : youtubeIdFor(mediaId) ? 'youtube' : 'local';
}

/** A public HTTPS origin only. Never put B2 application keys in the client. */
export function b2VideoUrlFor(objectKey: string): string | null {
  const configured = (manifest as {b2BaseUrl?:string}).b2BaseUrl?.trim();
  return publicB2VideoUrl(configured,objectKey);
}

export function publicB2VideoUrl(configured:string|undefined,objectKey:string):string|null {
  if (!configured || !/^(?:series|media)\/[a-zA-Z0-9_/-]+\.mp4$/.test(objectKey)) return null;
  try {
    const base = new URL(configured.endsWith('/') ? configured : `${configured}/`);
    if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash) return null;
    return new URL(objectKey, base).href;
  } catch { return null; }
}

export function b2LegacyVideoUrlFor(mediaId: string): string | null {
  if (!/^(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+$/.test(mediaId) || !(legacyCatalog as string[]).includes(mediaId)) return null;
  return b2VideoUrlFor(`media/2026-10/${mediaId}.mp4`);
}

export function b2SeriesEnabled(): boolean {
  return b2VideoUrlFor('series/2026-10/intro/check/01.mp4') !== null;
}
