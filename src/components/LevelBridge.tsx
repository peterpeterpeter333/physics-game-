import { advancedToolkit, levelLabels, levelPreviews, preparationFor } from '../content/university-levels';
import { EquationImage } from './CalculationBoard';

/** 上級ステージの入口。初級・中級で身につけた読み方と、対応するステージへのリンクを置く。
 * 初級・中級を終えていなくても上級は開ける。ここは案内であって条件ではない。 */
export function AdvancedEntry({ stageId, onOpenStage }: { stageId: string; onOpenStage?: (id: string) => void }) {
  const preparation = preparationFor[stageId] ?? [];
  if (!preparation.length) return null;
  return (
    <details className="study-overview level-bridge">
      <summary>この章で使う初級・中級の部品（3分の復習）</summary>
      <ul className="level-bridge-toolkit">
        {advancedToolkit.map(item => <li key={item}>{item}</li>)}
      </ul>
      <p className="level-bridge-note">先に見ておくと読みやすい段です。飛ばしてこのまま進んでも構いません。</p>
      <ul className="level-bridge-links">
        {preparation.map(entry => (
          <li key={entry.id}>
            <button onClick={() => onOpenStage?.(entry.id)}>
              {levelLabels[entry.level]}・{entry.title}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** 初級・中級の到達点と、上級編の式の対応表。「分からなくてよい」で終わらせないための札。 */
export function AdvancedPreviewCard({ stageId }: { stageId: string }) {
  const preview = levelPreviews[stageId];
  if (!preview) return null;
  return (
    <section className="advanced-preview" aria-label="上級編での到達点">
      <h3>上級編での到達点</h3>
      <EquationImage tex={preview.goal} />
      <dl>
        <div><dt>今できればよいこと</dt><dd>{preview.now}</dd></div>
        <div><dt>後で増えるもの</dt><dd>{preview.later}</dd></div>
      </dl>
    </section>
  );
}
