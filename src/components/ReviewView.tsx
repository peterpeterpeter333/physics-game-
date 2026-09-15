import { useState } from "react";
import type { Chapter, Problem } from "../types";
import { MathText } from "./MathText";
import { ProblemMeaning } from './ProblemMeaning';

export function ReviewView({
  chapters,
  starred,
  onToggleStar,
}: {
  chapters: Chapter[];
  starred: string[];
  onToggleStar: (problemId: string) => void;
}) {
  const problems: { problem: Problem; stageTitle: string; stageId:string }[] = [];
  for (const chapter of chapters) {
    for (const stage of chapter.stages) {
      for (const p of stage.problems) {
        if (starred.includes(p.id)) problems.push({ problem: p, stageTitle: stage.title,stageId:stage.id });
      }
    }
  }

  return (
    <div className="screen review">
      <header className="screen-header">
        <div>
          <div className="screen-header-tag">⭐ 復習リスト</div>
          <h1>スターを付けた問題</h1>
        </div>
      </header>
      {problems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-emoji">🌙</div>
          <p>
            まだスターを付けた問題がありません。
            <br />
            バトル中に「☆」を押すと、ここに集まって復習できます。
          </p>
        </div>
      ) : (
        <div className="review-list">
          {problems.map(({ problem, stageTitle,stageId }) => (
            <ReviewItem
              key={problem.id}
              problem={problem}
              stageTitle={stageTitle}
              stageId={stageId}
              onUnstar={() => onToggleStar(problem.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewItem({
  problem,
  stageTitle,
  stageId,
  onUnstar,
}: {
  problem: Problem;
  stageTitle: string;
  stageId:string;
  onUnstar: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="review-item">
      <div className="review-item-head">
        <span className="review-stage-tag">{stageTitle}</span>
        <span className="difficulty">{"★".repeat(problem.difficulty)}</span>
        <button className="star-btn starred" onClick={onUnstar} title="復習リストから外す">
          ⭐
        </button>
      </div>
      <div className="question-text">
        <MathText text={problem.question} />
      </div>
      {!open ? (
        <button className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}>
          答えと解説を見る
        </button>
      ) : (
        <div className="pop-in">
          <div className="review-answer">
            答え: <MathText text={problem.choices[problem.answerIndex]} />
          </div>
          <div className="explanation">
            <div className="explanation-tag">なぜそうなるか</div>
            <MathText text={problem.explanation} />
            <ProblemMeaning problem={problem} stageId={stageId}/>
          </div>
        </div>
      )}
    </div>
  );
}
