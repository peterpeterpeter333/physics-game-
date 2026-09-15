import {useState} from 'react';
import type {EquationGuide} from '../content/em-equation-guides';
import {EquationImage} from './CalculationBoard';

export function EquationMeaning({guide,tex,openDerivation=false}:{guide:EquationGuide;tex?:string;openDerivation?:boolean}){
 const [step,setStep]=useState(0);
 const current=guide.steps[step];
 return <section className="equation-meaning" aria-label="式の読み方と導出">
  <header><h2>式の読み方</h2><span className="equation-kind">{guide.kind}</span></header>
  {tex&&<EquationImage tex={tex}/>}
  <p className="meaning-caption">{guide.read}</p>
  <dl className="equation-symbols">{guide.symbols.slice(0,4).map(([symbol,meaning])=><div key={symbol}><dt>{symbol}</dt><dd>{meaning}</dd></div>)}</dl>
  {guide.symbols.length>4&&<details className="more-symbols"><summary>ほかの記号・途中式の記号（{guide.symbols.length-4}）</summary><dl className="equation-symbols">{guide.symbols.slice(4).map(([symbol,meaning])=><div key={symbol}><dt>{symbol}</dt><dd>{meaning}</dd></div>)}</dl></details>}
  <details className="equation-derivation" open={openDerivation||undefined}><summary>どこから来た式？ · 途中式を開く</summary>
   <p className="meaning-caption">{step+1} / {guide.steps.length} · {current.note}</p>
   {step>0&&<div className="equation-before"><span>一つ前</span><EquationImage tex={guide.steps[step-1].tex}/><span>↓</span></div>}
   <div className="equation-current"><EquationImage tex={current.tex}/></div>
   <nav aria-label="式変形を移動"><button disabled={step===0} onClick={()=>setStep(n=>n-1)}>← 前の式</button><button disabled={step===guide.steps.length-1} onClick={()=>setStep(n=>n+1)}>次の式 →</button></nav>
  </details>
 </section>;
}
