import { useEffect, useState } from 'react';
import { MotionContext, useT } from '../anim';
import type { Shot } from './primitives';
import { highSchoolReviews } from '../../../content/high-school-review';
import { mechanicsReviewScenes } from './review-mechanics';
import { emReviewScenes } from './review-electromagnetism';
export const uniqueShots: Record<string,Shot[]> = {};
const reviewScenes = { ...mechanicsReviewScenes, ...emReviewScenes };
export const reviewShots: Record<string, Shot> = Object.fromEntries(Object.values(highSchoolReviews).flat().map(({step}) => {
  const scene = reviewScenes[step.figure!];
  if (!scene) throw new Error(`Missing review animation: ${step.figure}`);
  return [step.figure!, {...scene, heading:step.heading}];
}));
/** Match by heading: inserting prerequisites must not shift existing scenes. */
export function getUniqueShot(stageId: string, step: { heading: string; figure?: string }) {
  return (step.figure ? reviewShots[step.figure] : undefined) ?? uniqueShots[stageId]?.find(shot => shot.heading === step.heading);
}

function ShotCanvas({shot,manual,yaw}: {shot:Shot;manual:number|null;yaw:number}) {
  const time = useT();
  const p = manual ?? Math.min(1,(time%10)/8);
  return <svg viewBox="0 0 320 220" role="img" aria-label={shot.observe} className="unique-shot-svg">
    <title>{shot.heading}</title>{shot.draw(p,yaw)}
  </svg>;
}
export function UniqueFigure({shot,id}: {shot:Shot;id:string}) {
  const [paused,setPaused]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [manual,setManual]=useState<number|null>(null);
  const [yaw,setYaw]=useState(.55);
  const [replay,setReplay]=useState(0);
  useEffect(()=>{setManual(null);setReplay(0);},[id]);
  return <div className="fig-wrap" data-original-animation={id}>
    <MotionContext.Provider value={{paused,speed:1}}><ShotCanvas key={`${id}-${replay}`} shot={shot} manual={manual} yaw={yaw}/></MotionContext.Provider>
    <p className="figure-note">{shot.observe}</p>
    <div className="figure-controls">
      <button className="btn btn-ghost" onClick={()=>{if(manual!==null){setManual(null);setReplay(n=>n+1);}setPaused(v=>!v);}} aria-label={paused?'アニメーションを再生':'アニメーションを一時停止'}>{paused?'▶ 再生':'Ⅱ 一時停止'}</button>
      <button className="btn btn-ghost" onClick={()=>{setManual(null);setReplay(n=>n+1);setPaused(false);}}>↻ 最初から</button>
    </div>
    <label className="figure-range">変化を手で追う<input aria-label="現象の進行" type="range" min="0" max="1" step="0.01" value={manual??0} onChange={e=>{setManual(+e.target.value);setPaused(true);}}/></label>
    {shot.spatial&&<label className="figure-range">視点<input aria-label="3D視点の横回転" type="range" min="-3.14" max="3.14" step="0.01" value={yaw} onChange={e=>setYaw(+e.target.value)}/></label>}
  </div>;
}
