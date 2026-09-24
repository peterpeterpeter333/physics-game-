import {useEffect,useRef} from 'react';
import {claimNarration} from '../game/narration';
import './em-video-pilot.css';

/** Pre-rendered narration: the diagram and voice share one media timeline. */
export function EMVideoPilot(){
 const base=import.meta.env.BASE_URL;
 const movie=`${base}media/em-line-integral-nemo.mp4?v=20260924-fluent-v1`;
 const player=useRef<HTMLVideoElement>(null),release=useRef<()=>void>();
 useEffect(()=>()=>{release.current?.();},[]);
 return <section className="em-video-pilot" aria-label="線積分の解説動画">
  <h2>この動画の目標：電気力が曲がった道でする仕事</h2>
  <p>中級「有限和から線積分へ」／ 力と移動の内積 → 小区間の和 → 線積分</p>
  <video ref={player} onPlay={()=>{release.current?.();release.current=claimNarration(()=>player.current?.pause());}} controls playsInline preload="metadata" poster={`${base}media/em-line-integral-nemo.jpg`} aria-label="Nemo音声付き・線積分の解説動画">
   <source src={movie} type="video/mp4"/>
   下の解説スライドも、この動画と同じ題材を説明しています。
  </video>
  <a href={movie} target="_blank" rel="noreferrer">動画だけを開く（MP4）</a>
  <p className="video-credit">音声：VOICEVOX Nemo 男声1。この動画は字幕付きで、自動再生しません。図と音声は、同じ動画に収録されています。</p>
  <details><summary>この動画の前提と補足</summary>
   <p>外からの操作が、正の電荷を指定した道に沿って動かします。描いた曲線は、電場だけで電荷が自由に動く場合の軌道ではありません。この動画が求める量は、電気力のする仕事です。</p>
   <p>数値例の条件は q = 1 C、Eₓ = kx/q、Eᵧ = 0、k = 1 N/mです。電荷のx座標は、0 mから2 mまで増えます。この数値例はxの範囲を等分し、各区間の力を左端の値で近似します。N分割の仕事の近似値は Wₙ = 2(1 − 1/N) Jとなり、その極限は2 Jです。</p>
   <p>この動画は全導出を代替するものではありません。続くスライドは、記号の定義と途中式を一つずつ説明します。</p>
  </details>
 </section>;
}
