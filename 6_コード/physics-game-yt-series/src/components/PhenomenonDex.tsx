import type { Chapter } from '../types';
import type { Progress } from '../game/state';
import { discoveryCounts, discoveryState } from '../game/study-dex';
import './phenomenon-dex.css';

export function PhenomenonDex({ chapters, progress, onOpenLesson }: {
  chapters: Chapter[];
  progress: Progress;
  onOpenLesson: (stageId: string) => void;
}) {
  const counts = discoveryCounts(chapters, progress);
  return <div className="screen phenomenon-dex">
    <header className="screen-header"><div><div className="screen-header-tag">学びの記録</div><h1>現象図鑑</h1></div></header>
    <p className="screen-note">動画を見た単元は「学習済み」、問題をクリアした単元は「理解を確認」に変わります。未学習の単元も自由に開けます。</p>
    <div className="dex-summary" aria-label="学習進捗">
      <span>学習済み <strong>{counts.studied}</strong> / {counts.total}</span>
      <span>理解を確認 <strong>{counts.mastered}</strong> / {counts.total}</span>
    </div>
    {chapters.map((chapter, index) => <details className="dex-chapter" key={chapter.id} open={index === 0}>
      <summary>{chapter.title}{chapter.level ? ` · ${chapter.level === 'intro' ? '初級' : chapter.level === 'middle' ? '中級' : '上級'}` : ''}<small>{chapter.stages.filter(stage => discoveryState(stage, progress) !== 'unseen').length}/{chapter.stages.length}</small></summary>
      <div className="dex-items">{chapter.stages.map(stage => {
        const state = discoveryState(stage, progress);
        return <button className={`dex-item ${state}`} key={stage.id} onClick={() => onOpenLesson(stage.id)}>
          <span className="dex-symbol" aria-hidden="true">{state === 'unseen' ? '○' : state === 'studied' ? '◐' : '●'}</span>
          <span className="dex-info"><strong>{stage.title}</strong><small>{state === 'unseen' ? '未学習' : state === 'studied' ? '学習済み' : '理解を確認'}</small></span>
          <span className="dex-arrow" aria-hidden="true">›</span>
        </button>;
      })}</div>
    </details>)}
  </div>;
}
