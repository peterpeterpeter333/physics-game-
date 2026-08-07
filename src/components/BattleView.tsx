import { useEffect, useMemo, useRef, useState } from "react";
import type { Problem, Stage } from "../types";
import { MathText } from "./MathText";
import { hapticSuccess, hapticError } from "../native";

const QUESTION_TIME = 30; // 秒
const MAX_HEARTS = 3;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "question" | "feedback" | "victory" | "defeat";

export function BattleView({
  stage,
  starred,
  firstClear,
  onToggleStar,
  onAnswer,
  onFinish,
  onExit,
}: {
  stage: Stage;
  starred: string[];
  firstClear: boolean;
  onToggleStar: (problemId: string) => void;
  onAnswer: (correct: boolean) => void;
  onFinish: (xp: number, cleared: boolean, bestCombo: number) => void;
  onExit: () => void;
}) {
  const [queue, setQueue] = useState<Problem[]>(() => shuffle(stage.problems));
  const [qIndex, setQIndex] = useState(0);
  const [enemyHp, setEnemyHp] = useState(stage.enemy.maxHp);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [selected, setSelected] = useState<number | null>(null);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [showHint, setShowHint] = useState(false);
  const [damageFloat, setDamageFloat] = useState<{ value: number; key: number } | null>(null);
  const [enemyHit, setEnemyHit] = useState(false);
  const [playerHit, setPlayerHit] = useState(false);
  const answeredRef = useRef(false);

  const problem = queue[qIndex % queue.length];
  const isStarred = starred.includes(problem.id);

  // タイマー
  useEffect(() => {
    if (phase !== "question") return;
    answeredRef.current = false;
    setTimeLeft(QUESTION_TIME);
    const started = Date.now();
    const iv = setInterval(() => {
      const remain = QUESTION_TIME - (Date.now() - started) / 1000;
      if (remain <= 0) {
        clearInterval(iv);
        if (!answeredRef.current) handleAnswer(-1);
      } else {
        setTimeLeft(remain);
      }
    }, 100);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, qIndex]);

  function handleAnswer(choiceIdx: number) {
    if (answeredRef.current || phase !== "question") return;
    answeredRef.current = true;
    const correct = choiceIdx === problem.answerIndex;
    setSelected(choiceIdx);
    setWasCorrect(correct);
    onAnswer(correct);

    if (correct) {
      const newCombo = combo + 1;
      const timeBonus = timeLeft > 20 ? 6 : timeLeft > 10 ? 3 : 0;
      const damage =
        16 + 8 * problem.difficulty + Math.min(newCombo - 1, 5) * 4 + timeBonus;
      setCombo(newCombo);
      setBestCombo((b) => Math.max(b, newCombo));
      setCorrectCount((c) => c + 1);
      setEnemyHp((hp) => Math.max(0, hp - damage));
      setDamageFloat({ value: damage, key: Date.now() });
      setEnemyHit(true);
      hapticSuccess();
      setTimeout(() => setEnemyHit(false), 500);
    } else {
      setCombo(0);
      setHearts((h) => h - 1);
      setPlayerHit(true);
      hapticError();
      setTimeout(() => setPlayerHit(false), 500);
    }
    setPhase("feedback");
  }

  function next() {
    setSelected(null);
    setShowHint(false);
    if (enemyHp <= 0) {
      setPhase("victory");
      return;
    }
    if (hearts <= 0) {
      setPhase("defeat");
      return;
    }
    if ((qIndex + 1) % queue.length === 0) {
      setQueue(shuffle(stage.problems));
    }
    setQIndex((i) => i + 1);
    setPhase("question");
  }

  const victoryXp = useMemo(
    () => 40 + correctCount * 8 + hearts * 10 + bestCombo * 4 + (firstClear ? 30 : 0),
    [correctCount, hearts, bestCombo, firstClear]
  );
  const defeatXp = correctCount * 4;

  const hpRatio = enemyHp / stage.enemy.maxHp;
  const timeRatio = timeLeft / QUESTION_TIME;

  if (phase === "victory") {
    return (
      <div className="screen battle result-screen">
        <Confetti />
        <div className="result-card pop-in">
          <div className="result-emoji">🏆</div>
          <h1 className="result-title victory-title">VICTORY!</h1>
          <p className="result-sub">
            {stage.enemy.name}を倒した! 「{stage.title}」クリア!
          </p>
          <div className="result-stats">
            <div className="result-stat">
              <span>正解数</span>
              <b>{correctCount}</b>
            </div>
            <div className="result-stat">
              <span>最大コンボ</span>
              <b>{bestCombo}</b>
            </div>
            <div className="result-stat">
              <span>残りHP</span>
              <b>{"❤️".repeat(hearts) || "0"}</b>
            </div>
          </div>
          <div className="result-xp glow-pulse">+{victoryXp} XP</div>
          {firstClear && <div className="first-clear-tag">✨ 初クリアボーナス +30XP を含む</div>}
          <button className="btn btn-primary btn-big" onClick={() => onFinish(victoryXp, true, bestCombo)}>
            マップへ戻る
          </button>
        </div>
      </div>
    );
  }

  if (phase === "defeat") {
    return (
      <div className="screen battle result-screen">
        <div className="result-card pop-in">
          <div className="result-emoji">💫</div>
          <h1 className="result-title defeat-title">力尽きた…</h1>
          <p className="result-sub">
            大丈夫、間違えた問題こそ伸びしろ。解説を読んだ今のきみはさっきより強い。
            レッスンを見返してもう一度挑もう。
          </p>
          <div className="result-stats">
            <div className="result-stat">
              <span>正解数</span>
              <b>{correctCount}</b>
            </div>
            <div className="result-stat">
              <span>与ダメージ</span>
              <b>{stage.enemy.maxHp - enemyHp}</b>
            </div>
          </div>
          {defeatXp > 0 && <div className="result-xp">+{defeatXp} XP</div>}
          <button className="btn btn-primary btn-big" onClick={() => onFinish(defeatXp, false, bestCombo)}>
            マップへ戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`screen battle ${playerHit ? "player-hit" : ""}`}>
      <header className="battle-header">
        <button
          className="btn-back"
          onClick={() => {
            if (confirm("バトルを中断してマップに戻りますか?")) onExit();
          }}
        >
          ←
        </button>
        <div className="battle-stage-name">{stage.title}</div>
        <div className="hearts">
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <span key={i} className={i < hearts ? "" : "heart-empty"}>
              {i < hearts ? "❤️" : "🖤"}
            </span>
          ))}
        </div>
      </header>

      <div className="enemy-area">
        <div className={`enemy ${enemyHit ? "enemy-shake" : ""}`}>
          <span className="enemy-emoji">{stage.enemy.emoji}</span>
          {damageFloat && (
            <span key={damageFloat.key} className="damage-float">
              -{damageFloat.value}
            </span>
          )}
        </div>
        <div className="enemy-name">{stage.enemy.name}</div>
        <div className="hp-bar">
          <div
            className={`hp-bar-fill ${hpRatio < 0.3 ? "hp-low" : ""}`}
            style={{ width: `${hpRatio * 100}%` }}
          />
        </div>
        <div className="hp-label">
          HP {enemyHp} / {stage.enemy.maxHp}
        </div>
        {combo > 1 && <div className="combo-badge pop-in">🔥 {combo} COMBO!</div>}
      </div>

      {phase === "question" && (
        <div className="timer-bar">
          <div
            className={`timer-bar-fill ${timeRatio < 0.3 ? "timer-low" : ""}`}
            style={{ width: `${timeRatio * 100}%` }}
          />
        </div>
      )}

      <div className="question-card">
        <div className="question-meta">
          <span className="difficulty">{"★".repeat(problem.difficulty)}</span>
          <button
            className={`star-btn ${isStarred ? "starred" : ""}`}
            onClick={() => onToggleStar(problem.id)}
            title="あとで復習する"
          >
            {isStarred ? "⭐" : "☆"}
          </button>
        </div>
        <div className="question-text">
          <MathText text={problem.question} />
        </div>

        <div className="choices">
          {problem.choices.map((choice, i) => {
            let cls = "choice";
            if (phase === "feedback") {
              if (i === problem.answerIndex) cls += " choice-correct";
              else if (i === selected) cls += " choice-wrong";
              else cls += " choice-dim";
            }
            return (
              <button key={i} className={cls} disabled={phase !== "question"} onClick={() => handleAnswer(i)}>
                <span className="choice-label">{"ABCD"[i]}</span>
                <MathText text={choice} />
              </button>
            );
          })}
        </div>

        {phase === "question" && (
          <div className="hint-row">
            {!showHint ? (
              <button className="btn btn-ghost btn-sm" onClick={() => setShowHint(true)}>
                💡 ヒントを見る
              </button>
            ) : (
              <div className="hint-box pop-in">
                💡 <MathText text={problem.hint} />
              </div>
            )}
          </div>
        )}

        {phase === "feedback" && (
          <div className="feedback pop-in">
            <div className={`feedback-head ${wasCorrect ? "ok" : "ng"}`}>
              {selected === -1 ? "⏰ 時間切れ…" : wasCorrect ? "🎯 正解! ナイス理解!" : "💥 おしい!"}
            </div>
            <div className="explanation">
              <div className="explanation-tag">なぜそうなるか</div>
              <MathText text={problem.explanation} />
            </div>
            <button className="btn btn-primary btn-big" onClick={next}>
              {enemyHp <= 0 ? "🏆 とどめ!" : hearts <= 0 ? "結果へ" : "次の問題へ →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2 + Math.random() * 2,
        color: ["#4ee1ff", "#c86bff", "#ffd166", "#7bffb2", "#ff6b9d"][i % 5],
        size: 6 + Math.random() * 8,
      })),
    []
  );
  return (
    <div className="confetti">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background: p.color,
            width: p.size,
            height: p.size * 0.6,
          }}
        />
      ))}
    </div>
  );
}
