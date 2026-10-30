import {useState} from 'react';
import {useT,C} from './anim';

export function heatBudget(work:number){return {input:100,output:work,rejected:100-work,efficiency:work/100};}
export function HeatEngine(){
 const [work,setWork]=useState(30),time=useT();
 const b=heatBudget(work),phase=(time*.3)%1;
 const flow=(x1:number,y1:number,x2:number,y2:number,color:string)=><g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={4}/><circle cx={x1+(x2-x1)*phase} cy={y1+(y2-y1)*phase} r={6} fill={color}/></g>;
 return <div>
  <svg viewBox="0 0 400 275" role="img" aria-label="熱機関の一周期のエネルギー収支。吸収熱100ジュールを仕事と排熱に分ける">
   <rect x="32" y="15" width="180" height="36" rx="9" fill="#512c39"/><text x="122" y="38" textAnchor="middle" fill={C.red} fontSize="15">高温の熱源</text>
   {flow(122,54,122,98,C.red)}<text x="141" y="80" fill={C.red} fontSize="14">Qh = 100 J 入る</text>
   <rect x="52" y="101" width="140" height="48" rx="10" fill="#253553"/><text x="122" y="122" textAnchor="middle" fill="#fff" fontSize="14">熱機関：一周期</text><text x="122" y="139" textAnchor="middle" fill={C.dim} fontSize="12">ΔU = 0</text>
   {flow(196,124,275,124,C.gold)}<text x="230" y="103" fill={C.gold} fontSize="13">仕事 Wout</text><text x="289" y="130" fill={C.gold} fontSize="16">{b.output} J</text>
   {flow(122,153,122,194,C.cyan)}<text x="141" y="179" fill={C.cyan} fontSize="14">Qc = {b.rejected} J 出る</text>
   <rect x="32" y="198" width="180" height="36" rx="9" fill="#1e4352"/><text x="122" y="222" textAnchor="middle" fill={C.cyan} fontSize="15">低温の熱源</text>
   <text x="200" y="258" textAnchor="middle" fill="#fff" fontSize="15">100 J = {b.output} J + {b.rejected} J　η = {work}%</text>
  </svg>
  <label>一周期に外へする仕事 Wout = {work} J<input aria-label="熱機関が外へする仕事" type="range" min="10" max="60" step="5" value={work} onChange={e=>setWork(Number(e.target.value))}/></label>
  <p className="figure-note">吸収熱100 Jを固定。仕事を増やすと排熱が減る、という収支を比較しています。動く点はエネルギー移動の目印です。</p>
  <details><summary>この図で分かる範囲</summary><p>ここでは第一法則の収支を表しています。このスライダーの上限が理論上の最大効率という意味ではありません。実現できる効率には熱源の温度などの条件と第二法則が必要です。</p></details>
 </div>;
}
