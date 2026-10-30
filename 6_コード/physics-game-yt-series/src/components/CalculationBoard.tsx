import { useEffect, useState, useRef } from 'react';
import type { Calculation } from '../content/calculations/schema';
import equations from '../content/calculations/equations.generated.json';
import { MathBlock } from './MathText';

const images: Record<string, { src: string; width: number; height: number }> = equations;
/** 生成した画像の中で日本語は <text> になり、表示が端末のフォント任せになる。
 * 日本語を含む式だけは、アプリと同じフォントで描ける KaTeX に回す。 */
const hasJapanese = (tex: string) => /[\u3040-\u30ff\u4e00-\u9fff]/.test(tex);
export function EquationImage({tex}: {tex:string}) {
  const [failedTex, setFailedTex] = useState<string | null>(null);
  const asset = images[tex];
  if (!asset || failedTex === tex || hasJapanese(tex)) return <div className="equation-image-scroll" data-equation-fallback><MathBlock tex={tex}/></div>;
  return <div className="equation-image-scroll"><img className="equation-image" src={`${import.meta.env.BASE_URL}${asset.src}`}
    onError={() => setFailedTex(tex)}
    alt={`数式: ${tex}`} width={asset.width} height={asset.height} draggable={false} /></div>;
}

export function CalculationBoard({calculation,purpose}: {calculation:Calculation;purpose?:string}) {
  const {lines} = calculation;
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    if (playing) list.current?.firstElementChild?.scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
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
    {purpose&&<p className="figure-note">この計算の目的：{purpose}</p>}
    {calculation.reference&&<p className="figure-note">ここは本文の式の確認欄です。途中式を示す導出ではありません。</p>}
    <ol className="calculation-lines" ref={list}>
      {lines.map((line, i) => i===active?<li key={i} className="calculation-line is-active">
        <button className="calculation-line-select" onClick={() => {setPlaying(false);setActive(i);}}
          aria-label={`途中式 ${i+1}: ${line.note}`} aria-current={i === active ? 'step' : undefined}>
          <span className="calculation-number">{i + 1}</span><span>{line.note}</span>
        </button>
        {i>0&&!calculation.reference&&<div className="calculation-history"><p>一つ前の式</p><EquationImage tex={lines[i-1].tex}/><p>↓ {line.note}</p></div>}
        <EquationImage tex={line.tex} />
      </li>:null)}
    </ol>
    {lines.length > 1 && <div className="calculation-controls">
      <button className="btn btn-ghost" onClick={() => { if (active === lines.length-1) setActive(0); setPlaying(p => !p); }}
        aria-label={playing ? '式変形を一時停止' : '式変形を再生'}>{playing ? '⏸ 停止' : '▶ 式を追う'}</button>
      <button className="btn btn-ghost" disabled={active === 0} onClick={() => {setPlaying(false);setActive(n => n-1);}}>一段戻る</button>
      <button className="btn btn-ghost" disabled={active === lines.length-1} onClick={() => {setPlaying(false);setActive(n => n+1);}}>次の式 ↓</button>
    </div>}
    {lines.length>1&&<details className="calculation-all"><summary>{calculation.reference?'このスライドの式を一覧で確認':'導出全体を一覧で確認'}</summary>{lines.map((line,i)=><div key={i}><p>{i+1}. {line.note}</p><EquationImage tex={line.tex}/></div>)}</details>}
  </section>;
}
