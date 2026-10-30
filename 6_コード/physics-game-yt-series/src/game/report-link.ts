const supportedHosts = new Set(['forms.gle', 'docs.google.com']);

export const DEFAULT_REPORT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScbSR4ImPHqnn8yxJIy9gikXiyyDgvpTOzL2l4Cszat0ouMsg/viewform?usp=publish-editor';

export function reportFormUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || !supportedHosts.has(url.hostname)) return null;
    if (url.hostname === 'docs.google.com' && !url.pathname.startsWith('/forms/')) return null;
    return url.href;
  } catch { return null; }
}
