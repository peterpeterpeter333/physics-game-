/** Actual-render coverage: report links must not disappear behind consent or fallback branches. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {webcrypto} from 'node:crypto';
import vm from 'node:vm';

const app=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(path.join(app,'package.json'));
const {build}=require('esbuild');
const once=(text,anchor,replacement,label)=>{
 assert.equal(text.split(anchor).length,2,`${label}: actual component changed; do not silently skip its branch`);
 return text.replace(anchor,replacement);
};
const entry=String.raw`
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {chapters} from './src/content/index';
import {EMVideoLesson,hasEMMovies} from './src/components/EMVideoLesson';
import {SegmentedLessonVideo} from './src/components/SegmentedLessonVideo';
import {EMPaperBattle} from './src/components/EMPaperBattle';
import {EMVideoPilot} from './src/components/EMVideoPilot';
import {CurriculumBattle} from './src/components/CurriculumBattle';
import {YouTubeVideo} from './src/components/YouTubeVideo';
import {VideoReportButton} from './src/components/VideoReportButton';
import {SettingsView} from './src/components/SettingsView';
import {DEFAULT_REPORT_FORM_URL,reportFormUrl,videoReportUrl} from './src/game/report-link';
import {problemsByStage} from './src/content/problem-curriculum';
import {emPaperProblems} from './src/content/em-paper-problems';
import paperCatalog from './src/content/paper-battle-videos.generated.json';
import emCatalog from './src/content/em-video-catalog.generated.json';
const memory=new Map();
globalThis.localStorage={getItem:key=>memory.get(key)??null,setItem:(key,value)=>memory.set(key,String(value)),removeItem:key=>memory.delete(key)};
globalThis.__reportCalls=[];globalThis.__reportLoaded=false;globalThis.__reportLocal=false;
const render=(Component,props={})=>renderToStaticMarkup(React.createElement(Component,props));
const decode=text=>text.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#x27;|&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const record=(Component,props,context={})=>{
 globalThis.__reportCalls=[];
 const markup=render(Component,props);
 const anchors=[...markup.matchAll(/<a\b([^>]*\bdata-video-report="[^"]*"[^>]*)>([\s\S]*?)<\/a>/g)].map(match=>({
  mediaId:decode(match[1].match(/\bdata-video-report="([^"]*)"/)[1]),
  href:decode(match[1].match(/\bhref="([^"]*)"/)?.[1]??''),
  target:match[1].match(/\btarget="([^"]*)"/)?.[1],rel:match[1].match(/\brel="([^"]*)"/)?.[1],
  label:decode(match[1].match(/\baria-label="([^"]*)"/)?.[1]??''),index:match.index,
 }));
 return {...context,anchors,calls:globalThis.__reportCalls.map(call=>({...call})),
  local:/<video(?:\s|>)/.test(markup),iframe:/<iframe(?:\s|>)/.test(markup),
  afterVideo:!markup.includes('</video>')||anchors.every(anchor=>anchor.index>markup.lastIndexOf('</video>')),
  afterIframe:!markup.includes('</iframe>')||anchors.every(anchor=>anchor.index>markup.lastIndexOf('</iframe>')),
  consent:markup.includes('同意して動画を読み込む'),
  afterConsent:!markup.includes('同意して動画を読み込む')||anchors.every(anchor=>anchor.index>markup.lastIndexOf('同意して動画を読み込む')),
  error:markup.includes('動画を読み込めませんでした')||markup.includes('動画を再生できませんでした'),
 };
};
const rows=[],stageRows=chapters.flatMap(chapter=>chapter.stages.map(stage=>({chapter,stage})));
let states=0;
for(const {chapter,stage}of stageRows){
 if(!hasEMMovies(stage))throw new Error('Unenumerated lesson: '+stage.id);
 const props={stage,alreadyFinished:false,onComplete:()=>{},onExit:()=>{},onReadSlides:()=>{}};
 memory.clear();render(EMVideoLesson,props);const levels=[...globalThis.__reportLevels];
 for(const level of levels)for(const mode of ['quick','thorough']){
  memory.clear();memory.set('physics-quest:video-level:'+stage.id,level);memory.set('physics-quest:video-mode:'+stage.id,mode);
  globalThis.__reportPlaylist=null;render(EMVideoLesson,props);const list=globalThis.__reportPlaylist;
  if(!list)throw new Error('Actual playlist was not captured');states++;
  for(const page of list.list)rows.push(record(SegmentedLessonVideo,
   {main:page.media,start:page.start,end:page.end,onError:()=>{}},
   {stageId:stage.id,mode,route:'lesson',mediaId:(page.media.mediaDirectory??'em')+'/'+page.media.id,title:page.media.title,start:page.start}));
  for(const movie of list.review)rows.push(record(SegmentedLessonVideo,
   {main:movie,start:0,end:movie.duration,onError:()=>{}},
   {stageId:stage.id,mode,route:'optional-review',mediaId:(movie.mediaDirectory??'em')+'/'+movie.id,title:movie.title,start:0}));
 }
}
for(const {stage}of stageRows){
 if(problemsByStage[stage.id]){
  globalThis.__reportPhase='solution';
  for(const exercise of problemsByStage[stage.id])rows.push(record(CurriculumBattle,
   {stage,exercises:[exercise],onExit:()=>{},onFinish:()=>{},onAnswer:()=>{}},
   {stageId:stage.id,route:'curriculum-solution',mediaId:exercise.id,title:exercise.title+'の解説',start:0}));
 }else if(emPaperProblems[stage.id]){
  const problems=emPaperProblems[stage.id];
  for(let index=0;index<problems.length;index++)for(const kind of ['question','solution']){
   globalThis.__reportPaperIndex=index;globalThis.__reportPaperKind=kind;
   const movie=paperCatalog.find(row=>row.id===problems[index].id)[kind];
   rows.push(record(EMPaperBattle,{stage,problems,onExit:()=>{},onFinish:()=>{}},
    {stageId:stage.id,route:'paper-'+kind,mediaId:'paper-battles/'+movie.id,title:stage.title+'・問題'+(index+1)+'の'+(kind==='question'?'問題':'解説'),start:0}));
  }
 }
}
rows.push(record(EMVideoPilot,{}, {route:'conditional-pilot',mediaId:'em-line-integral-nemo',title:'電気力が曲がった道でする仕事',start:0}));
// Render the actual consent-granted Session too. SSR emits markup only: no URL
// is loaded and no Google request occurs in this offline test.
globalThis.__reportLoaded=true;
const sample=rows.find(row=>row.start>0),sampleCall=sample.calls[0];
const granted=record(YouTubeVideo,{...sampleCall,end:sampleCall.start+5,onError:()=>{}},
 {route:'consent-granted',...sampleCall});
globalThis.__reportLoaded=false;
// Deliberately make the resolver miss in memory. Production JSON is not edited.
globalThis.__reportLocal=true;
const localMovie=emCatalog.find(movie=>movie.stageId==='ui-field-map');
const paperStage=stageRows.find(({stage})=>stage.id==='ui-field-map').stage;
globalThis.__reportPaperIndex=0;globalThis.__reportPaperKind='question';
const localRows=[
 record(SegmentedLessonVideo,{main:localMovie,start:2,end:localMovie.duration,onError:()=>{}},
  {route:'local-segment',mediaId:'em/'+localMovie.id,title:localMovie.title,start:2}),
 record(EMPaperBattle,{stage:paperStage,problems:emPaperProblems[paperStage.id],onExit:()=>{},onFinish:()=>{}},
  {route:'local-paper',mediaId:'paper-battles/paper-ui-field-1-question',title:paperStage.title+'・問題1の問題',start:0}),
 record(EMVideoPilot,{}, {route:'local-pilot',mediaId:'em-line-integral-nemo',title:'電気力が曲がった道でする仕事',start:0}),
];
globalThis.__reportLocal=false;
const settings=render(SettingsView,{onResetProgress:()=>{}});
const hostile={title:'曲がる道 & x < y 「なぜ？」 "字幕"\n次の行',mediaId:'em/test-a&b#c',youtubeId:'qW8fh2y4vXE',start:61.9};
const direct=record(VideoReportButton,hostile,{route:'escaped-context',...hostile});
module.exports={rows,localRows,granted,direct,states,stageCount:stageRows.length,settings,
 DEFAULT_REPORT_FORM_URL,reportFormUrl,videoReportUrl};
`;
const compiled=await build({stdin:{contents:entry,resolveDir:app,sourcefile:'video-reporting-entry.tsx',loader:'tsx'},
 bundle:true,platform:'node',format:'cjs',write:false,jsx:'automatic',loader:{'.css':'empty'},
 define:{'import.meta.env.BASE_URL':'"/physics-game-/"','import.meta.env.DEV':'false','import.meta.env.VITE_REPORT_FORM_URL':'""'},
 plugins:[{name:'read-only-report-state-fixtures',setup(builder){
  builder.onLoad({filter:/[/\\]EMVideoLesson\.tsx$/},args=>{
   let source=readFileSync(args.path,'utf8');
   const levels=' const [level,setLevel]=useState';
   source=once(source,levels,' globalThis.__reportLevels=levels;\n'+levels,'Actual lesson difficulty selector');
   const anchor=' return <div ref={top} className="screen lesson em-movie-lesson"';
   source=once(source,anchor,' globalThis.__reportPlaylist={list,review};\n'+anchor,'Actual lesson/review playlist');
   return {contents:source,loader:'tsx'};
  });
  builder.onLoad({filter:/[/\\]EMPaperBattle\.tsx$/},args=>{
   let source=once(readFileSync(args.path,'utf8'),'const [index,setIndex]=useState(0)',
    'const [index,setIndex]=useState(globalThis.__reportPaperIndex??0)','Actual trial question index');
   source=once(source,"useState<'question'|'solution'>('question')",
    "useState<'question'|'solution'>(globalThis.__reportPaperKind??'question')",'Actual trial question/solution');
   return {contents:source,loader:'tsx'};
  });
  builder.onLoad({filter:/[/\\]CurriculumBattle\.tsx$/},args=>({
   contents:once(readFileSync(args.path,'utf8'),"useState<Phase>('question')",
    "useState<Phase>(globalThis.__reportPhase??'question')",'Actual curriculum solution phase'),loader:'tsx'}));
  builder.onLoad({filter:/[/\\]YouTubeVideo\.tsx$/},args=>{
   let source=once(readFileSync(args.path,'utf8'),
    ' const loaded=useSyncExternalStore(subscribeYouTubeConsent,hasYouTubeConsent,()=>false);',
    ' globalThis.__reportCalls.push({youtubeId,mediaId,title,start,end});\n const loaded=useSyncExternalStore(subscribeYouTubeConsent,hasYouTubeConsent,()=>Boolean(globalThis.__reportLoaded));',
    'Actual YouTube outer: record props, fixture server snapshot only');
   return {contents:source,loader:'tsx'};
  });
  builder.onLoad({filter:/[/\\]game[/\\]video-delivery\.ts$/},args=>({
   contents:once(readFileSync(args.path,'utf8'),'export function youtubeIdFor(mediaId: string): string | null {',
    'export function youtubeIdFor(mediaId: string): string | null {\n if(globalThis.__reportLocal)return null;',
    'Local fallback resolver fixture'),loader:'ts'}));
  builder.onResolve({filter:/^\.\.\/native$/},()=>({path:'report-native-noop',namespace:'report-test'}));
  builder.onLoad({filter:/.*/,namespace:'report-test'},()=>({contents:'export const hapticSuccess=()=>{},hapticError=()=>{};',loader:'js'}));
 }}],
});
const context={module:{exports:{}},exports:{},require,console,process,Buffer,URL,URLSearchParams,crypto:webcrypto,
 setTimeout,clearTimeout,setImmediate,TextEncoder,TextDecoder,window:{location:{href:'https://peterpeterpeter333.github.io/physics-game-/'},addEventListener:()=>{},removeEventListener:()=>{}}};
vm.runInNewContext(compiled.outputFiles[0].text,context,{filename:'video-reporting.cjs',timeout:120000});
const api=context.module.exports;
const result=JSON.parse(JSON.stringify(api));
const validId=/^[A-Za-z0-9_-]{11}$/;
const clock=start=>`${Math.floor(start/60)}:${String(Math.floor(start)%60).padStart(2,'0')}`;
const verify=row=>{
 assert.equal(row.anchors.length,1,`${row.route}/${row.mediaId}: exactly one report link must be visible`);
 const anchor=row.anchors[0],url=new URL(anchor.href);
 assert.equal(anchor.mediaId,row.mediaId,'Report identity must change with the actual video, not its previous page');
 assert.equal(anchor.target,'_blank');
 assert(anchor.rel?.split(/\s+/).includes('noopener'));assert(anchor.rel?.split(/\s+/).includes('noreferrer'));
 assert(anchor.label.includes('Googleフォーム'));
 const youtubeId=row.calls[0]?.youtubeId??row.youtubeId;
 const lines=[row.title,`教材ID: ${row.mediaId}`];
 if(youtubeId&&validId.test(youtubeId))lines.push(`https://www.youtube.com/watch?v=${youtubeId}`);
 assert.equal(url.origin+url.pathname,api.DEFAULT_REPORT_FORM_URL);
 assert.equal(url.searchParams.get('entry.1419855496'),lines.join(' / '),'Correct title, media ID and exact video link must be prefilled');
 assert.equal(url.searchParams.get('entry.1523549809'),`この画面の開始位置: ${clock(row.start)}`);
 assert(!url.href.includes('現在の再生位置'),'A segment boundary must not be mislabeled as current playback time');
 assert(row.afterVideo&&row.afterIframe&&row.afterConsent,'Report link must appear beneath the player or consent panel');
};
assert.equal(result.stageCount,136);assert.equal(result.states,272);
assert.equal(result.rows.length,726);
assert.equal(new Set(result.rows.map(row=>row.mediaId)).size,505,'All 505 reachable physical videos must be covered');
for(const row of result.rows){
 assert.equal(row.calls.length,1);assert.equal(row.iframe,false);assert.equal(row.local,false);
 assert.equal(row.consent,true,'Unapproved video loading must retain its existing consent gate');verify(row);
}
assert.equal(result.granted.iframe,true,'The actual consent-granted YouTube session must also render the link');
assert.equal(result.granted.consent,false);verify(result.granted);
assert.equal(result.localRows.length,3);
for(const row of result.localRows){assert.equal(row.calls.length,0);assert.equal(row.local,true);verify(row);}
verify(result.direct);
assert(result.settings.includes('報告フォームを開く'));
assert(result.settings.includes(api.DEFAULT_REPORT_FORM_URL),'Settings must restore the same respondent-facing form');

// URL policy and default-schema isolation: custom forms must never receive
// entry IDs belonging to our own form, even when they use the same host.
for(const raw of [undefined,null,'',' ','http://forms.gle/example','javascript:alert(1)','data:text/html,x',
 'https://evil.example/forms/d/e/x/viewform','https://docs.google.com.evil.example/forms/d/e/x/viewform',
 'https://user:pass@docs.google.com/forms/d/e/x/viewform','https://docs.google.com:444/forms/d/e/x/viewform',
 'https://docs.google.com/forms/d/e/x/edit','https://docs.google.com/forms/d/e/x/viewform/extra','https://docs.google.com/document/d/x/edit','https://forms.gle/']){
 assert.equal(api.reportFormUrl(raw),null,`Reject unsafe/non-respondent URL: ${String(raw)}`);
}
const customUrls=['https://forms.gle/verifiedCustomLink','https://docs.google.com/forms/d/e/otherForm/viewform',
 'https://docs.google.com/forms/u/1/d/customId/viewform?usp=sharing'];
for(const raw of customUrls){
 assert.equal(api.reportFormUrl(raw),new URL(raw).href);
 assert.equal(api.videoReportUrl({title:'private context',mediaId:'test',youtubeId:'qW8fh2y4vXE',start:65},raw),new URL(raw).href,
  'Do not send our form-specific prefill schema to a custom form');
}
const details={title:'タイトル & < > # 日本語\n2行目',mediaId:'em/a&b?c=d#e',youtubeId:'qW8fh2y4vXE',start:61.9};
const prefilled=new URL(api.videoReportUrl(details));
assert.equal(prefilled.searchParams.get('entry.1419855496'),`${details.title} / 教材ID: ${details.mediaId} / https://www.youtube.com/watch?v=qW8fh2y4vXE`);
assert.equal(prefilled.searchParams.get('entry.1523549809'),'この画面の開始位置: 1:01');
for(const start of [undefined,NaN,Infinity,-Infinity,-1]){
 const url=new URL(api.videoReportUrl({title:'test',mediaId:'test',start}));
 assert.equal(url.searchParams.has('entry.1523549809'),false,'Invalid/unknown starts must not be reported as a real time');
}
for(const youtubeId of ['bad','qW8fh2y4vXE&secret=1','https://evil.example']){
 const url=new URL(api.videoReportUrl({title:'test',mediaId:'test',youtubeId}));
 assert.equal(url.searchParams.get('entry.1419855496'),'test / 教材ID: test','Invalid video IDs must not become links or query injections');
}
assert.equal(api.videoReportUrl(details,'https://evil.example'),null);
const reportSource=readFileSync(path.join(app,'src/game/report-link.ts'),'utf8');
assert(!/localStorage|sessionStorage|navigator\.|fetch\(|XMLHttpRequest/.test(reportSource),'Building a report link must not collect device/account data or transmit anything');
console.log('PASS: all 505 real videos / 726 playback contexts have exactly one correct report link below the actual player/consent panel; consent-granted Session and all 3 local fallbacks also pass.');
console.log('PASS: default Settings link restored; exact title/video/segment-start prefill; Japanese/HTML/query escaping; unsafe URLs and invalid IDs rejected; custom forms receive no default-form schema; no automatic collection or submission.');
