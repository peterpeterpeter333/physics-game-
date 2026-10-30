/** Do not feed raw TeX commands to a device voice. Complex displayed formulae
 * remain on screen; their explanatory prose is narrated instead. */
export function speechText(text: string): string {
  return text.replace(/\$[^$]+\$/g, '（画面の式）').replace(/\*\*/g, '')
    .replace(/ε₀/g, '真空の誘電率').replace(/θ/g, 'シータ').replace(/φ/g, 'ファイ')
    .replace(/Δ/g, 'デルタ').replace(/∇/g, 'ナブラ').replace(/∂/g, '偏微分')
    .replace(/²/g, 'の二乗').replace(/³/g, 'の三乗').replace(/·|×/g, 'かける')
    .replace(/−/g, 'マイナス').replace(/=/g, 'イコール').replace(/→/g, '、次に、');
}
export function sentences(text: string): string[] {
  return (text.match(/[^。！？\n]+[。！？]?/g) ?? []).map(s=>s.trim()).filter(Boolean);
}

/** A single owner across the page, including embedded supplemental lessons. */
let owner: (()=>void) | undefined;
export function claimNarration(stop: ()=>void) {
  owner?.(); owner=stop;
  return ()=>{if(owner===stop) owner=undefined;};
}

let activeSession: NarrationSession | undefined;
export class NarrationSession {
  private generation=0;
  constructor(private synth: Pick<SpeechSynthesis,'speak'|'cancel'>) {}
  stop() {this.generation++; if(activeSession===this){activeSession=undefined;this.synth.cancel();}}
  speak(utterance: SpeechSynthesisUtterance, done: ()=>void, error: (message:string)=>void) {
    activeSession?.stop(); this.stop(); activeSession=this; const token=this.generation;
    utterance.onend=()=>{if(token===this.generation) done();};
    utterance.onerror=e=>{if(token===this.generation) error(e.error);};
    this.synth.speak(utterance);
  }
}
