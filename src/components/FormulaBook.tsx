import type { Formula } from "../types";
import { MathBlock } from "./MathText";

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
        すべての公式に「導出」がある。丸暗記せず、作り方ごと覚えよう。
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
