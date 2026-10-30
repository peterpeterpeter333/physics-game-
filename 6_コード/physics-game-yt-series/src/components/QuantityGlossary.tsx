import {quantityGlossary,notationHelp} from '../content/quantity-glossary';

export function expressionSymbols(expressions:string[]){
 const normalized=expressions.join(' ')
  .replace(/\\mathcal\s*\{?E\}?/g,'\\mathcalE')
  .replace(/\\varepsilon/g,'\\epsilon').replace(/\\varphi/g,'\\phi')
  .replace(/_\{\\(?:rm|mathrm|text)\s*\{?([^{}]+)\}?\}/g,'_$1')
  .replace(/\\(?:mathrm|text|rm|operatorname)\{[^}]*\}/g,'');
 return new Set(normalized.match(/\\[A-Za-z]+(?:_\{?[\p{L}\p{N}]+\}?)?|[A-Za-z](?:_\{?[\p{L}\p{N}]+\}?)?/gu)?.map(t=>t.replace(/^\\/,'').replace(/[{}]/g,''))??[]);
}

export function QuantityGlossary({stageId,expressions}:{stageId:string;expressions:string[]}){
 const definitions=quantityGlossary(stageId);
 // Match tokens, not characters inside command names such as sin or frac.
 const tokens=expressionSymbols(expressions);
 const used=definitions.filter(d=>tokens.has(d.key));
 const top=used.slice(0,4),rest=definitions.filter(d=>!top.includes(d));
 const list=(entries:typeof definitions)=><dl className="equation-symbols">{entries.map(d=><div key={d.key}><dt>{d.label}</dt><dd>{d.meaning}</dd></div>)}</dl>;
 return <section className="study-symbols" aria-label="記号と言葉の確認"><h3>この式の記号</h3>
  {top.length?list(top):<p className="meaning-caption">記号の意味は分野によって変わります。この章での意味を下から確認できます。</p>}
  <details><summary>この章のほかの記号・単位</summary>{list(rest)}</details>
  <details><summary>Δ・d・積分などの読み方</summary><dl className="equation-symbols">{notationHelp.map(([label,meaning])=><div key={label}><dt>{label}</dt><dd>{meaning}</dd></div>)}</dl></details>
 </section>;
}
