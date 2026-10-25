const supportedHosts = new Set(['forms.gle', 'docs.google.com']);

export const DEFAULT_REPORT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScbSR4ImPHqnn8yxJIy9gikXiyyDgvpTOzL2l4Cszat0ouMsg/viewform';

/** Only respondent-facing Google Forms links may leave the app. */
export function reportFormUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== 'https:' || !supportedHosts.has(url.hostname) || url.username || url.password || url.port) return null;
    if (url.hostname === 'docs.google.com' && !/^\/forms\/(?:u\/\d+\/)?d\/(?:e\/)?[^/]+\/viewform\/?$/.test(url.pathname)) return null;
    if (url.hostname === 'forms.gle' && url.pathname.length <= 1) return null;
    return url.href;
  } catch { return null; }
}

export type VideoReportContext = {title: string; mediaId: string; youtubeId?: string; start?: number};

/** Prefill only our verified form. Never send account, progress or API-key data. */
export function videoReportUrl(context: VideoReportContext, raw = DEFAULT_REPORT_FORM_URL): string | null {
  const checked = reportFormUrl(raw);
  if (!checked) return null;
  const url = new URL(checked), original = new URL(DEFAULT_REPORT_FORM_URL);
  // A custom form has different question IDs; don't insert our private schema.
  if (url.origin !== original.origin || url.pathname !== original.pathname) return url.href;
  const details = [context.title, `教材ID: ${context.mediaId}`];
  if (context.youtubeId && /^[A-Za-z0-9_-]{11}$/.test(context.youtubeId)) details.push(`https://www.youtube.com/watch?v=${context.youtubeId}`);
  url.searchParams.set('usp', 'pp_url');
  // The form uses a single-line input, so use visible separators, not newlines.
  url.searchParams.set('entry.1419855496', details.join(' / '));
  if (typeof context.start === 'number' && Number.isFinite(context.start) && context.start >= 0) {
    const seconds = Math.floor(context.start);
    const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    url.searchParams.set('entry.1523549809', `この画面の開始位置: ${clock}`);
  }
  return url.href;
}
