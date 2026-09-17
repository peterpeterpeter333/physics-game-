import {useEffect,useRef} from 'react';
import {claimNarration} from '../game/narration';
import './em-video-pilot.css';

/** Pre-rendered narration: the diagram and voice share one media timeline. */
export function EMVideoPilot(){
 const base=import.meta.env.BASE_URL;
 const player=useRef<HTMLVideoElement>(null),release=useRef<()=>void>();
 useEffect(()=>()=>{release.current?.();},[]);
 return <section className="em-video-pilot" aria-label="線積分の60秒解説動画">
  <h2>まず映像で：曲がった道の仕事を求める</h2>
  <p>中級「有限和から線積分へ」／ 力と移動の内積 → 小区間の和 → 線積分</p>
  <video ref={player} onPlay={()=>{release.current?.();release.current=claimNarration(()=>player.current?.pause());}} controls playsInline preload="metadata" poster={`${base}media/em-line-integral-nemo.jpg`} aria-label="Nemo音声付き・線積分の解説動画">
   <source src={`${base}media/em-line-integral-nemo.mp4`} type="video/mp4"/>
   動画を再生できない場合は、下の解説スライドで学習できます。
  </video>
  <a href={`${base}media/em-line-integral-nemo.mp4`} target="_blank" rel="noreferrer">動画だけを開く（MP4）</a>
  <p className="video-credit">音声：VOICEVOX Nemo 男声1。字幕付き・自動再生なし。図と音声を同じ動画に収録しています。</p>
  <details><summary>この動画の前提と補足</summary>
   <p>正の電荷を、外から指定した道に沿って動かします。描いた曲線は、電場だけで自由に動かした場合の軌道ではありません。求めるのは電気力のする仕事です。</p>
   <p>数値例は q = 1 C、Eₓ = kx/q、Eᵧ = 0、k = 1 N/m、x = 0 m から 2 m。xを等分し、各区間の左端の力で近似します。N分割の仕事は Wₙ = 2(1 − 1/N) J となり、極限は2 Jです。</p>
   <p>動画は全導出を代替するものではありません。記号の定義と途中式は、続くスライドで一つずつ確認できます。</p>
  </details>
 </section>;
}
