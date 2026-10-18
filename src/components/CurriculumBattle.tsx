import {useMemo, useState} from 'react';
import type {Stage} from '../types';
import {MathText} from './MathText';
import {YouTubeVideo} from './YouTubeVideo';
import {hapticSuccess, hapticError} from '../native';
import type {CurriculumProblem} from '../content/problem-curriculum';
import './em-paper-battle.css';
import './curriculum-battle.css';

type Phase = 'question' | 'choices' | 'answered' | 'solution' | 'finished';

export function CurriculumBattle({stage, exercises, onExit, onFinish, onAnswer, nextStageTitle}: {
  stage: Stage;
  exercises: CurriculumProblem[];
  onExit: () => void;
  onFinish: (continueNext: boolean, bestCombo: number) => void;
  onAnswer: (correct: boolean) => void;
  nextStageTitle?: string;
}) {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('question');
  const [enemyHp, setEnemyHp] = useState(stage.enemy.maxHp);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const exercise = exercises[exerciseIndex];
  const subquestion = exercise.subquestions[subIndex];
  const totalSubquestions = useMemo(() => exercises.reduce((sum, item) => sum + item.subquestions.length, 0), [exercises]);
  const questionNumber = exercises.slice(0, exerciseIndex).reduce((sum, item) => sum + item.subquestions.length, 0) + subIndex + 1;
  const correct = selected === subquestion.answerIndex;

  function choose(choice: number) {
    if (phase !== 'choices') return;
    const isCorrect = choice === subquestion.answerIndex;
    setSelected(choice);
    setPhase('answered');
    onAnswer(isCorrect);
    if (isCorrect) {
      setEnemyHp(hp => Math.max(0, hp - Math.ceil(stage.enemy.maxHp / totalSubquestions)));
      setCombo(current => current + 1);
      setBestCombo(best => Math.max(best, combo + 1));
      hapticSuccess();
    } else {
      setCombo(0);
      hapticError();
    }
  }

  function advance() {
    if (subIndex < exercise.subquestions.length - 1) {
      setSubIndex(index => index + 1);
      setSelected(null);
      setPhase('question');
      return;
    }
    setPhase('solution');
  }

  function nextExercise() {
    if (exerciseIndex === exercises.length - 1) {
      setPhase('finished');
      return;
    }
    setExerciseIndex(index => index + 1);
    setSubIndex(0);
    setSelected(null);
    setVideoError(false);
    setPhase('question');
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  if (phase === 'finished') return <main className="screen battle result-screen">
    <div className="result-card pop-in"><div className="result-emoji">🏆</div>
      <h1 className="victory-title">挑戦完了！</h1>
      <p>{exercises.length}問に取り組みました。最大 {bestCombo} コンボ。</p>
      <button className="btn btn-primary" onClick={() => onFinish(false, bestCombo)}>単元一覧へ戻る</button>
      {nextStageTitle && <button className="btn btn-ghost" onClick={() => onFinish(true, bestCombo)}>次の単元へ</button>}
    </div>
  </main>;

  return <main className="screen curriculum-battle">
    <header className="screen-header"><button className="btn-back" aria-label="単元一覧へ戻る" onClick={onExit}>←</button><h1>{stage.title}</h1></header>
    <div className="curriculum-battle-status" aria-label="バトルの進み具合">
      <span className="curriculum-enemy">{stage.enemy.emoji} {stage.enemy.name}</span>
      <div className="hp-bar" role="progressbar" aria-label="敵のHP" aria-valuemin={0} aria-valuemax={stage.enemy.maxHp} aria-valuenow={enemyHp}><div className="hp-bar-fill" style={{width: `${enemyHp / stage.enemy.maxHp * 100}%`}}/></div>
      <span>問題 {exerciseIndex + 1}/{exercises.length} · 小問 {questionNumber}/{totalSubquestions}{combo > 1 ? ` · ${combo} COMBO!` : ''}</span>
    </div>
    <article className="curriculum-card">
      <p className="curriculum-stage-label">{phase === 'solution' ? '解説動画' : phase === 'question' ? '問題と図' : '4択の選択肢'}</p>
      <h2>{exercise.title}</h2>
      {phase === 'solution' ? <>
        {exercise.solutionYoutubeId ? <YouTubeVideo key={exercise.id} youtubeId={exercise.solutionYoutubeId} mediaId={exercise.id} title={`${exercise.title}の解説`} start={0} end={999999} onError={() => setVideoError(true)}/> :
          <p className="curriculum-video-wait" role="status">この問題の解説動画はYouTubeへの公開準備中です。</p>}
        {videoError && <p className="curriculum-video-wait" role="alert">動画を再生できませんでした。通信状態を確認し、もう一度開いてください。</p>}
        <button className="btn btn-primary" onClick={nextExercise}>{exerciseIndex === exercises.length - 1 ? '学習を終える' : '次の問題へ →'}</button>
      </> : <>
        <figure className="curriculum-figure"><img src={`${import.meta.env.BASE_URL}${subquestion.figure}`} alt={`${exercise.title}・小問${subquestion.number}の出題図`} loading="lazy"/></figure>
        <p className="curriculum-context"><MathText text={exercise.context}/></p>
        <h3>小問{subquestion.number}　<MathText text={subquestion.prompt}/></h3>
        {phase === 'question' && <button className="btn btn-primary" onClick={() => setPhase('choices')}>4択へ進む →</button>}
        {phase !== 'question' && <>
        <div className="curriculum-choices" role="group" aria-label="4択の選択肢">
          {subquestion.choices.map((choice, index) => <button key={index} className={`paper-choice ${phase === 'answered' && index === subquestion.answerIndex ? 'choice-correct' : ''} ${selected === index && !correct ? 'choice-wrong' : ''}`} disabled={phase !== 'choices'} aria-pressed={selected === index} onClick={() => choose(index)}>
            <span className="paper-choice-letter">{'ABCD'[index]}</span><MathText text={choice}/>
          </button>)}
        </div>
        {phase === 'choices' && <button className="btn btn-ghost" onClick={() => setPhase('question')}>問題と図を見直す</button>}
        {phase === 'answered' && <div className={`curriculum-feedback ${correct ? 'correct' : 'incorrect'}`} role="status">{correct ? '正解！ 敵にダメージ！' : `惜しい！ 正解は${'ABCD'[subquestion.answerIndex]}です。解説動画で理由を確かめましょう。`}</div>}
        {phase === 'answered' && <button className="btn btn-primary" onClick={advance}>{subIndex === exercise.subquestions.length - 1 ? '解説動画を見る →' : '次の小問へ →'}</button>}
        </>}
      </>}
    </article>
  </main>;
}
