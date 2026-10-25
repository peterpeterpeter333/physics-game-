import {DEFAULT_REPORT_FORM_URL, videoReportUrl, type VideoReportContext} from '../game/report-link';
import './video-report-button.css';

/** Kept outside the loading/consent branch so a broken player can be reported. */
export function VideoReportButton(context: VideoReportContext) {
  const href = videoReportUrl(context, import.meta.env.VITE_REPORT_FORM_URL?.trim() || DEFAULT_REPORT_FORM_URL);
  return <div className="video-report-actions">
    {href ? <a className="video-report-button" data-video-report={context.mediaId} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${context.title}の不具合・わかりにくい点を報告（Googleフォームを別画面で開く）`}>
      <span aria-hidden="true">⚑</span> 不具合・わかりにくい点を報告
    </a> : <span className="video-report-unavailable" role="status">報告フォームを開けません。設定をご確認ください。</span>}
  </div>;
}
