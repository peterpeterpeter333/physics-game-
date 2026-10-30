import type { Formula } from "../types";
import { MathBlock } from "./MathText";
import { QuantityGlossary } from './QuantityGlossary';
import './spiral-lesson.css';
import './study-flow.css';

export function FormulaBook({
  formulas,
  onOpenLesson,
}: {
  formulas: Formula[];
  onOpenLesson: (stageId: string) => void;
}) {
  const categories = Array.from(new Set(formulas.map((f) => f.category)));

  return (
    <div className="screen formula-book">
      <header className="screen-header">
        <div>
          <div className="screen-header-tag">📖 公式集</div>
          <h1>全分野の公式</h1>
        </div>
      </header>
      <p className="screen-note">
        公式の途中計算と成立条件をレッスンで確認できます。定義・実験に基づく基本法則と、そこから導ける結果を区別して理解しましょう。
      </p>
      {categories.map((cat) => (
        <section key={cat} className="formula-category">
          <h2 className="formula-category-title">{cat}</h2>
          <div className="formula-list">
            {formulas
              .filter((f) => f.category === cat)
              .map((f) => (
                <div key={f.id} className="formula-item">
                  <div className="formula-item-name">{f.name}</div>
                  <MathBlock tex={f.tex} />
                  <div className="formula-item-meaning">{f.meaning}</div>
                  {f.stageId&&<details className="study-original"><summary>この公式の記号・単位を確認</summary><QuantityGlossary stageId={f.stageId} expressions={[f.tex]}/></details>}
                  {f.stageId && (
                    <button className="btn btn-ghost btn-sm" onClick={() => onOpenLesson(f.stageId!)}>
                      📖 導出をレッスンで見る
                    </button>
                  )}
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
