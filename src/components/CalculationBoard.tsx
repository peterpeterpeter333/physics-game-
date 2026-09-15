import { useEffect, useState, useRef } from 'react';
import type { Calculation } from '../content/calculations/schema';
import equations from '../content/calculations/equations.generated.json';
import { MathBlock } from './MathText';

const images: Record<string, { src: string; width: number; height: number }> = equations;
export function EquationImage({tex}: {tex:string}) {
  const [failedTex, setFailedTex] = useState<string | null>(null);
  const asset = images[tex];
  if (!asset || failedTex === tex) return <div className="equation-image-scroll" data-equation-fallback><MathBlock tex={tex}/></div>;
  return <div className="equation-image-scroll"><img className="equation-image" src={`${import.meta.env.BASE_URL}${asset.src}`}
    onError={() => setFailedTex(tex)}
    alt={`数式: ${tex}`} width={asset.width} height={asset.height} draggable={false} /></div>;
}

export function CalculationBoard({calculation}: {calculation:Calculation}) {
  const {lines} = calculation;
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    if (playing) list.current?.children[active]?.scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }, [active,playing]);
  useEffect(() => {
    if (!playing) return;
    if (active >= lines.length - 1) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setActive(n => n + 1), 2800);
    return () => window.clearTimeout(timer);
  }, [playing, active, lines.length]);
  return <section className={`calculation-board ${calculation.reference?'is-reference':''}`} aria-label={calculation.title}>
    <header className="calculation-header"><h3>{calculation.title}</h3>
      {lines.length > 1 && <span>{active + 1} / {lines.length}</span>}</header>
    <ol className="calculation-lines" ref={list}>
      {lines.map((line, i) => <li key={i} className={`calculation-line ${i === active ? 'is-active' : ''} ${i > active ? 'is-upcoming' : ''}`}>
        <button className="calculation-line-select" onClick={() => {setPlaying(false);setActive(i);}}
          aria-label={`途中式 ${i+1}: ${line.note}`} aria-current={i === active ? 'step' : undefined}>
          <span className="calculation-number">{i + 1}</span><span>{line.note}</span>
        </button>
        <EquationImage tex={line.tex} />
      </li>)}
    </ol>
    {lines.length > 1 && <div className="calculation-controls">
      <button className="btn btn-ghost" onClick={() => { if (active === lines.length-1) setActive(0); setPlaying(p => !p); }}
        aria-label={playing ? '式変形を一時停止' : '式変形を再生'}>{playing ? '⏸ 停止' : '▶ 式を追う'}</button>
      <button className="btn btn-ghost" disabled={active === 0} onClick={() => {setPlaying(false);setActive(n => n-1);}}>一段戻る</button>
      <button className="btn btn-ghost" disabled={active === lines.length-1} onClick={() => {setPlaying(false);setActive(n => n+1);}}>次の式 ↓</button>
    </div>}
  </section>;
}
