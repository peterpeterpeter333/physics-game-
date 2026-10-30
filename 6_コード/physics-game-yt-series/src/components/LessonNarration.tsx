import {useEffect,useMemo,useRef,useState} from 'react';
import {claimNarration,NarrationSession,sentences,speechText} from '../game/narration';
import {MathText} from './MathText';
import './lesson-narration.css';
function saved(key:string,fallback:string){try{return localStorage.getItem(key)??fallback;}catch{return fallback;}}
function save(key:string,value:string){try{localStorage.setItem(key,value);}catch{/* Playback also works without storage. */}}

export function LessonNarration({text}:{text:string}) {
  const lines=useMemo(()=>sentences(text),[text]);
  const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]);
  const [voice,setVoice]=useState(()=>saved('narration-voice',''));
  const [rate,setRate]=useState(()=>{const n=Number(saved('narration-rate','1'));return [.75,1,1.25,1.5].includes(n)?n:1;});
  const [index,setIndex]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [message,setMessage]=useState('再生すると、この説明を一文ずつ読み上げます。');
  const session=useRef<NarrationSession>();
  const release=useRef<()=>void>();
  const supported=typeof window!=='undefined'&&'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
  const stop=()=>{session.current?.stop();setPlaying(false);};
  useEffect(()=>{save('narration-voice',voice);save('narration-rate',String(rate));},[voice,rate]);

  useEffect(()=>{
    if(!supported) return;
    const synth=window.speechSynthesis;
    session.current=new NarrationSession(synth);
    const update=()=>setVoices(synth.getVoices().filter(v=>/^ja(?:-|_|$)/i.test(v.lang)));
    update();synth.addEventListener('voiceschanged',update);
    const hide=()=>{if(document.hidden){stop();setMessage('画面を離れたため停止しました。再開すると今の文を読み直します。');}};
    document.addEventListener('visibilitychange',hide);
    return ()=>{session.current?.stop();release.current?.();synth.removeEventListener('voiceschanged',update);document.removeEventListener('visibilitychange',hide);};
  },[supported]);
  useEffect(()=>{stop();setIndex(0);setMessage('再生すると、この説明を一文ずつ読み上げます。');},[text]);

  useEffect(()=>{
    if(!playing||!session.current||!lines[index]) return;
    const utterance=new SpeechSynthesisUtterance(speechText(lines[index]));
    utterance.lang='ja-JP';utterance.rate=rate;
    const selected=voices.find(v=>v.voiceURI===voice)??voices.find(v=>v.default)??voices[0];
    if(selected) utterance.voice=selected;
    let timer=window.setTimeout(()=>{session.current?.stop();setPlaying(false);setMessage('音声を開始できませんでした。端末の音声設定を確認して再生し直してください。');},15000);
    utterance.onstart=()=>{clearTimeout(timer);setMessage('読み上げ中');};
    session.current.speak(utterance,()=>{
      clearTimeout(timer);
      if(index+1<lines.length) setIndex(n=>n+1);
      else {setPlaying(false);setMessage('読み上げが終わりました。次へは自分のペースで進めます。');}
    },()=>{clearTimeout(timer);setPlaying(false);setMessage('読み上げを開始・継続できませんでした。声を変更するか、端末の音声設定を確認してください。');});
    return ()=>{clearTimeout(timer);session.current?.stop();};
  },[playing,index,rate,voice,lines]);

  function play(){
    release.current?.();
    release.current=claimNarration(()=>{stop();setMessage('別の説明を再生したため停止しました。');});
    setMessage('音声を準備中');setPlaying(true);
  }
  return <section className="lesson-narration" aria-label="端末の音声ガイド">
    <div className="narration-controls">
      <button className="btn btn-ghost" disabled={!supported||!lines.length} onClick={()=>{if(playing){stop();setMessage('停止中。再開すると今の文の先頭から読み直します。');}else play();}}>{playing?'⏸ 読み上げを停止':'▶ 音声で聞く'}</button>
      <button className="btn btn-ghost" disabled={index===0} onClick={()=>{stop();setIndex(n=>n-1);}}>一文戻る</button>
      <button className="btn btn-ghost" disabled={index>=lines.length-1} onClick={()=>{stop();setIndex(n=>n+1);}}>次の文</button>
      <button className="btn btn-ghost" onClick={()=>{stop();setIndex(0);setMessage('先頭に戻しました。');}}>最初へ</button>
    </div>
    {supported?<>
      <div className="narration-settings"><label>声 <select value={voice} onChange={e=>{stop();setVoice(e.target.value);}}><option value="">端末の日本語音声（自動）</option>{voices.map(v=><option key={v.voiceURI} value={v.voiceURI}>{v.name}{v.localService?'（端末内）':''}</option>)}</select></label>
      <label>速さ <select value={rate} onChange={e=>{stop();setRate(Number(e.target.value));}}>{[.75,1,1.25,1.5].map(n=><option key={n} value={n}>{n}倍</option>)}</select></label></div>
      <p className="narration-status" role="status">{message}</p>
      <p className="narration-caption" aria-label="読み上げる文"><span>{index+1}/{lines.length}</span> <MathText text={lines[index]??''}/></p>
      <details><summary>音声について</summary><p>端末の読み上げを使用します。声質・利用できる声は端末によって異なります。自動再生はせず、画面移動時は停止します。複雑な数式は画面で確認し、その説明を音声で聞く方式です。図の動きと音声の厳密な同期には未対応です。音声によって通信が必要な場合があります。</p></details>
    </>:<p role="status">この環境では端末の読み上げを利用できません。本文と図で学習できます。</p>}
  </section>;
}
