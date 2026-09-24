import {useEffect,useRef,useState} from 'react';
import type {PaperProblem,Stage} from '../types';
import {MathText} from './MathText';
import catalog from '../content/paper-battle-videos.generated.json';
import {paperBattleAnswer} from '../game/paper-battle';
import {claimNarration} from '../game/narration';
import {VideoPlaybackSpeed} from './VideoPlaybackSpeed';
import {hapticSuccess,hapticError} from '../native';
import './em-paper-battle.css';

export function EMPaperBattle({stage,problems,onExit,onFinish,nextStageTitle}:{stage:Stage;problems:PaperProblem[];onExit:()=>void;onFinish:(continueNext:boolean,bestCombo:number)=>void;nextStageTitle?:string}){
 const [index,setIndex]=useState(0),[selected,setSelected]=useState<number|null>(null);
 const [battle,setBattle]=useState({solved:[] as string[],combo:0,bestCombo:0,hp:stage.enemy.maxHp});
 const [movieKind,setMovieKind]=useState<'question'|'solution'>('question');
 const [victory,setVictory]=useState(false),[damage,setDamage]=useState(0),[hit,setHit]=useState(false);
 const [failed,setFailed]=useState(false),[retryMedia,setRetryMedia]=useState(0);
 const answered=useRef(false),finished=useRef(false),player=useRef<HTMLVideoElement>(null),release=useRef<()=>void>();
 const problem=problems[index],entry=catalog.find(c=>c.id===problem.id)!;
 const correct=selected===entry.answerIndex,movie=entry[movieKind];
 const base=`${import.meta.env.BASE_URL}media/paper-battles/${movie.id}`,revision=`?v=${movie.renderKey.slice(0,16)}`;
 useEffect(()=>{window.scrollTo({top:0,behavior:'auto'});},[]);
 useEffect(()=>{setFailed(false);return()=>release.current?.();},[movie.id]);
 useEffect(()=>{if(!hit)return;const timer=window.setTimeout(()=>setHit(false),650);return()=>window.clearTimeout(timer);},[hit]);
 function answer(choice:number){
  if(answered.current)return;answered.current=true;player.current?.pause();
  window.scrollTo({top:0,behavior:'auto'});
  const isCorrect=choice===entry.answerIndex,next=paperBattleAnswer(battle,problem.id,isCorrect,stage.enemy.maxHp,problems.length);
  setSelected(choice);setBattle(next);setDamage(battle.hp-next.hp);
  if(isCorrect){setHit(true);hapticSuccess();}else hapticError();
  setMovieKind('solution');
 }
 function next(){
  player.current?.pause();
  if(!correct){answered.current=false;setSelected(null);setMovieKind('question');window.scrollTo({top:0,behavior:'auto'});return;}
  if(index===problems.length-1){setVictory(true);return;}
  answered.current=false;setIndex(i=>i+1);setSelected(null);setMovieKind('question');setDamage(0);
  window.scrollTo({top:0,behavior:'smooth'});
 }
 function finish(continueNext:boolean){if(finished.current)return;finished.current=true;onFinish(continueNext,battle.bestCombo);}
 if(victory)return <div className="screen battle result-screen"><div className="result-card pop-in"><div className="result-emoji">🏆</div><h1 className="victory-title">VICTORY!</h1><p>{stage.enemy.name}を倒した！</p><p>3問クリア · 最大 {battle.bestCombo} コンボ</p><button className="btn btn-primary" onClick={()=>finish(false)}>単元一覧へ戻る</button>{nextStageTitle&&<button className="btn btn-ghost" onClick={()=>finish(true)}>次の単元へ</button>}</div></div>;
 return <div className={`screen em-paper-screen ${hit?'paper-impact':''}`}>
  <header className="screen-header"><button className="btn-back" aria-label="単元一覧へ戻る" onClick={onExit}>←</button><h1>{stage.title}</h1></header>
  <section className={`paper-enemy ${hit?'enemy-shake':''}`} aria-label="敵の状態">
   <div className="paper-enemy-avatar"><span className="enemy-emoji">{stage.enemy.emoji}</span>{hit&&<><span className="paper-slash"/><span className="damage-float">−{damage}</span></>}</div>
   <div className="paper-enemy-stats"><strong>{stage.enemy.name}</strong><div className="hp-bar" role="progressbar" aria-label="敵のHP" aria-valuemin={0} aria-valuemax={stage.enemy.maxHp} aria-valuenow={battle.hp}><div className={`hp-bar-fill ${battle.hp<stage.enemy.maxHp/3?'hp-low':''}`} style={{width:`${battle.hp/stage.enemy.maxHp*100}%`}}/></div><span className="hp-label">HP {battle.hp} / {stage.enemy.maxHp} · 問題 {index+1} / {problems.length}</span>{battle.combo>1&&<span className="combo-badge">{battle.combo} COMBO!</span>}</div>
  </section>
  {selected!==null&&<div className={`paper-feedback ${correct?'is-correct':''}`} role="status">{correct?`正解！ ${damage} ダメージ${battle.hp===0?'！ 敵を倒した！':''}`:'惜しい！ 解説動画で確かめて、もう一度挑戦しよう。'}</div>}
  <section className="em-paper-problem" aria-label={`問題 ${index+1}`}>
   <div className="paper-video-heading"><strong>{movieKind==='question'?'問題動画':'解説動画'}</strong>{selected!==null&&<button className="btn btn-ghost btn-sm" onClick={()=>{player.current?.pause();setMovieKind(k=>k==='question'?'solution':'question');}}>{movieKind==='question'?'解説動画へ':'問題を見返す'}</button>}</div>
   <video key={`${movie.id}-${retryMedia}`} ref={player} controls playsInline preload="metadata" poster={`${base}.jpg${revision}`} aria-label={`${movieKind==='question'?'問題':'解説'}の音声付き動画`} onPlay={()=>{release.current?.();release.current=claimNarration(()=>player.current?.pause());}} onError={()=>setFailed(true)}><source src={`${base}.mp4${revision}`} type="video/mp4" onError={()=>setFailed(true)}/></video>
   <VideoPlaybackSpeed player={player} mediaKey={`${movie.id}-${retryMedia}`}/>
   {failed&&<div role="alert"><p>動画を読み込めませんでした。通信状態を確認してください。</p><button className="btn btn-ghost" onClick={()=>{setFailed(false);setRetryMedia(n=>n+1);}}>動画を再読み込み</button></div>}
   <p className="paper-instruction">{selected===null?'紙に図や途中式を書いてから、答えを選ぼう。':'▶ を押すと、音声付きの解説を再生できます。'}</p>
   <details className="paper-written-question"><summary>問題文を文字で確認</summary><MathText text={problem.question}/></details>
   <div className="paper-choices" role="group" aria-label="回答の4択">{entry.choices.map((choice,i)=><button key={i} disabled={selected!==null} aria-pressed={selected===i} className={`paper-choice ${selected!==null&&i===entry.answerIndex?'choice-correct':''} ${selected===i&&!correct?'choice-wrong':''}`} onClick={()=>answer(i)}><span className="paper-choice-letter">{'ABCD'[i]}</span><MathText text={choice}/></button>)}</div>
   {selected!==null&&<button className="btn btn-primary" onClick={next}>{!correct?'もう一度答える':index===problems.length-1?'🏆 勝利画面へ':'次の問題へ →'}</button>}
  </section>
 </div>;
}
