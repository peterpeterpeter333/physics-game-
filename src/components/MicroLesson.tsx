import {useEffect,useMemo,useRef,useState} from 'react';
import type {Stage} from '../types';
import {microSlides} from '../content/micro-slides';
import {emFaq,faqSources} from '../content/em-faq';
import {GuidedScene} from './GuidedScene';
import {EquationImage} from './CalculationBoard';
import {FaqAnimation} from './FaqAnimation';
import './micro-lesson.css';

export function MicroLesson({stage,alreadyFinished,onComplete,onExit}:{stage:Stage;alreadyFinished:boolean;onComplete:(firstTime:boolean)=>void;onExit:()=>void}){
 const [topic,setTopic]=useState(0),[page,setPage]=useState(0),[visual,setVisual]=useState(0),[playing,setPlaying]=useState(false);
 const steps=stage.lesson.steps,step=steps[topic],story=step.story!,faq=emFaq[story.scene];
 const cards=useMemo(()=>microSlides(step),[step]),card=cards[page];
 const anchor=useRef<HTMLDivElement>(null);
 useEffect(()=>{setVisual(card.beat);setPlaying(false);anchor.current?.scrollIntoView({block:'start'});},[card]);
 // Replay the authored diagram sequence only. Text and lesson progress never advance automatically.
 useEffect(()=>{if(!playing)return;const id=window.setInterval(()=>setVisual(v=>(v+1)%story.beats.length),1800);return()=>window.clearInterval(id);},[playing,story]);
 const go=(t:number,p=0)=>{setTopic(t);setPage(p);};
 const next=()=>page<cards.length-1?setPage(p=>p+1):topic<steps.length-1?go(topic+1):onComplete(!alreadyFinished);
 const previous=()=>page>0?setPage(p=>p-1):topic>0?go(topic-1,microSlides(steps[topic-1]).length-1):undefined;
 return <div className="screen lesson guided-lesson micro-lesson" ref={anchor} data-stage-id={stage.id} data-guided-lesson>
  <header className="screen-header"><button className="btn-back" onClick={onExit} aria-label="章一覧へ戻る">←</button><div><div className="screen-header-tag">大学電磁気 · {stage.title}</div><h1>{step.heading}</h1></div></header>
  <section className="micro-card" aria-label="説明スライド">
   <div className="micro-meta">話題 {topic+1}/{steps.length} · スライド {page+1}/{cards.length}</div>
   <h2>{card.title}</h2>
   <p className="micro-lines" data-four-lines>{card.lines.map((line,i)=><span key={i}>{line}</span>)}</p>
   <div className="micro-visuals">
    <div className="micro-diagram"><GuidedScene scene={story.scene} beat={Math.min(visual,story.beats.length-1)} yaw={.55}/>
     {!['r-field','r-sum','r-path','r-calculate','r-compare'].includes(story.scene)&&<div className="micro-controls"><button className="btn btn-ghost" aria-label={playing?'説明図の比較再生を停止':'説明図の比較再生を開始'} onClick={()=>setPlaying(v=>!v)}>{playing?'⏸ 停止':'▶ 図を比較'}</button><input type="range" min="0" max={story.beats.length-1} step="1" value={visual} aria-label="説明図の段階を比較" onChange={e=>{setPlaying(false);setVisual(Number(e.target.value));}}/></div>}
     {visual!==card.beat&&<button className="micro-restore" onClick={()=>{setPlaying(false);setVisual(card.beat);}}>本文の図へ戻す（比較中 {visual+1}/{story.beats.length}）</button>}
    </div>
    {card.tex&&<div className="guided-equation micro-equation"><EquationImage tex={card.tex}/></div>}
   </div>
  </section>
  <section className="micro-card micro-faq" aria-label="よくある疑問">
   <div className="micro-meta">よくある疑問 · この話題のつまずき</div>
   <h2>{faq.question}</h2>
   <p className="micro-lines" data-faq-lines>{faq.lines.map((line,i)=><span key={i}>{line}</span>)}</p>
   <FaqAnimation key={`${story.scene}/${page}`} scene={story.scene}/>
   <details className="micro-sources"><summary>参考にした質問・教材</summary><ul>{faq.sources.map(key=><li key={key}><a href={faqSources[key].url} target="_blank" rel="noreferrer">{faqSources[key].title}</a></li>)}</ul></details>
  </section>
  <nav className="micro-navigation" aria-label="スライドを移動"><button className="btn btn-ghost" onClick={previous} disabled={topic===0&&page===0}>← 前へ</button><span>{page+1}/{cards.length}</span><button className="btn btn-primary" onClick={next}>{page===cards.length-1?(topic===steps.length-1?'バトルへ':'次の話題 →'):'次へ →'}</button></nav>
  <nav className="lesson-dots micro-dots" aria-label="スライドを選ぶ">{cards.map((c,i)=><button key={i} className={`lesson-dot ${page===i?'active':''}`} aria-label={`スライド ${i+1}: ${c.title}`} aria-current={page===i?'step':undefined} onClick={()=>setPage(i)}><span/></button>)}</nav>
  <details className="guided-contents"><summary>話題の一覧（{steps.length}）</summary><ol>{steps.map((s,i)=><li key={s.heading}><button onClick={()=>go(i)} aria-current={topic===i?'step':undefined}>{s.heading}</button></li>)}</ol></details>
 </div>;
}
