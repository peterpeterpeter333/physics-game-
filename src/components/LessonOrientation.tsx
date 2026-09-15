import { lessonOrientations } from '../content/lesson-orientation';
import { MathText } from './MathText';

export function LessonOrientation({ stageId, heading, page, total, review }: {
  stageId: string; heading: string; page: number; total: number; review?: boolean;
}) {
  const orientation = lessonOrientations[stageId];
  if (!orientation) throw new Error(`Missing lesson orientation: ${stageId}`);
  return <section className="lesson-orientation" aria-label="この章と今の話">
    <dl className="lesson-destination">
      <div><dt>この章のテーマ</dt><dd className="lesson-theme">{orientation.theme}</dd></div>
      <div><dt>目標の式・性質</dt><dd><MathText text={orientation.goal} /></dd></div>
    </dl>
    <div className="lesson-current-label">今の話 {review && <span className="lesson-review-tag">高校の復習・大学への準備</span>}<span className="lesson-card-count" aria-live="polite">{page + 1} / {total}</span></div>
    <h2>{heading}</h2>
  </section>;
}
