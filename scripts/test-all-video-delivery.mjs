/**
 * Full reachable-route regression, not just a catalog-size check.
 *
 * Runs the actual React lesson selectors with isolated in-memory storage, then
 * renders every selected page and optional review through the actual media
 * component. Only the network-facing YouTube leaf is replaced by a recorder.
 * Paper-battle question/solution states and the text-view pilot are rendered too.
 * No account, network request, real browser storage or app source is modified.
 */
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(app, 'package.json'));
const {build} = require('esbuild');
const json = relative => JSON.parse(readFileSync(path.join(app, relative), 'utf8'));
const legacyPath = 'src/content/legacy-youtube.generated.json';
assert(existsSync(path.join(app, legacyPath)), `${legacyPath}: upload/mapping is not complete`);

// Independently recorded reachable MP4 set from the 2026-10-25 audit. Dormant
// paper-ue-integrals movies are deliberately absent: CurriculumBattle wins.
const originalLegacyLessons = `
lessons/prep-area-distance
lessons/ui-curve-tiles-bridges-1
lessons/ui-through-a-surface-bridges-2
lessons/prep-vector-length
lessons/um-path-pieces-bridges-3
lessons/um-area-vector-bridges-4
lessons/prep-position
revisions/ui-motion-record-bridges-5
revisions/prep-force
revisions/ui-force-map-bridges-6
revisions/ui-work-changing-bridges-7
revisions/prep-work-energy
revisions/ui-energy-change-bridges-8
revisions/prep-circular
revisions/ui-turning-motion-bridges-9
revisions/prep-trig
revisions/um-newton-components-bridges-10
inserts/hp-why-01
lessons/prep-sum
revisions/um-work-sum-bridges-11
lessons/prep-dot-work
revisions/um-work-vector-bridges-12
em/ui-field-map-01
em/ui-field-map-02
em/ui-field-map-03
em/ui-work-direction-01
em/ui-work-direction-02
em/ui-work-direction-03
em/ui-work-bent-path-01
em/ui-work-bent-path-02
em/ui-work-bent-path-03
em/ui-flux-one-tile-01
em/ui-flux-one-tile-02
em/ui-flux-one-tile-03
em/ui-flux-many-tiles-01
em/ui-flux-many-tiles-02
em/ui-flux-many-tiles-03
em/ui-charge-and-flux-preview-01
em/ui-charge-and-flux-preview-02
em/ui-charge-and-flux-preview-03
em/um-line-element-01
em/um-line-element-02
em/um-line-element-03
em/um-line-element-04
em/um-em-area-vector-01
em/um-em-area-vector-02
em/um-em-area-vector-03
em/um-surface-integral-entry-01
em/um-surface-integral-entry-02
em/um-surface-integral-entry-03
em/um-closed-electric-flux-01
em/um-closed-electric-flux-02
em/um-closed-electric-flux-03
`.trim().split('\n');
const paperKeys = ['ui-field', 'um-line'].flatMap(unit => [1, 2, 3].flatMap(n =>
  ['question', 'solution'].map(kind => `paper-battles/paper-${unit}-${n}-${kind}`)));
const expectedLegacyKeys = [...originalLegacyLessons, ...paperKeys, 'em-line-integral-nemo'];
assert.equal(new Set(expectedLegacyKeys).size, 66);
const legacy = json(legacyPath);
const validId = /^[A-Za-z0-9_-]{11}$/;
const pilotDuration = json('public/media/em-line-integral-nemo.json').duration;
assert.equal(pilotDuration, 49.91666666666667, 'Recheck the pilot end against original metadata if its source movie changes');

const appSource = readFileSync(path.join(app, 'src/App.tsx'), 'utf8');
const curriculumBranch = appSource.indexOf('problemsByStage[view.stageId] ? <CurriculumBattle');
const paperBranch = appSource.indexOf('emPaperProblems[view.stageId] ? <EMPaperBattle');
assert(curriculumBranch >= 0 && paperBranch > curriculumBranch, 'Revisit route enumeration if App battle priority changes');
const lessonSource = readFileSync(path.join(app, 'src/components/LessonView.tsx'), 'utf8');
assert.match(lessonSource, /stage\.id==='um-line-integral-entry'\s*&&\s*<EMVideoPilot/,
  'Revisit conditional-pilot coverage if the actual text-view route changes');

const instrumentOnce = (source, anchor, replacement, label) => {
  assert.equal(source.split(anchor).length, 2, `${label}: actual component structure changed; update the test instead of silently skipping`);
  return source.replace(anchor, replacement);
};
let lessonCaptures = 0, paperCaptures = 0, curriculumCaptures = 0;
const entry = String.raw`
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {chapters} from './src/content/index';
import {EMVideoLesson, hasEMMovies} from './src/components/EMVideoLesson';
import {SegmentedLessonVideo} from './src/components/SegmentedLessonVideo';
import {EMPaperBattle} from './src/components/EMPaperBattle';
import {EMVideoPilot} from './src/components/EMVideoPilot';
import {CurriculumBattle} from './src/components/CurriculumBattle';
import {problemsByStage} from './src/content/problem-curriculum';
import {emPaperProblems} from './src/content/em-paper-problems';
import paperCatalog from './src/content/paper-battle-videos.generated.json';
import {youtubeIdFor,b2SeriesEnabled} from './src/game/video-delivery';
const memory = new Map();
globalThis.localStorage = {getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)};
globalThis.__videoCalls=[];
const render = (component, props={}) => renderToStaticMarkup(React.createElement(component, props));
const mediaKey = m => (m.mediaDirectory??'em')+'/'+m.id;
const checkRender = (component, props, context) => {
 globalThis.__videoCalls=[];
 const markup=render(component,props);
 return {...context, calls:globalThis.__videoCalls.map(c=>({...c})), localTag:/<video(?:\s|>)/.test(markup)};
};
const stages=chapters.flatMap(chapter=>chapter.stages.map(stage=>({chapter,stage})));
const states=[], pages=[], optionalReviews=[], paper=[], curriculum=[], noMovies=[];
for(const {chapter,stage}of stages){
 if(!hasEMMovies(stage)){noMovies.push(stage.id);continue;}
 const props={stage,alreadyFinished:false,onComplete:()=>{},onExit:()=>{},onReadSlides:()=>{}};
 memory.clear(); render(EMVideoLesson,props);
 const levels=[...globalThis.__routeLevels];
 for(const level of levels)for(const mode of ['quick','thorough']){
  memory.clear();
  memory.set('physics-quest:video-level:'+stage.id,level);
  memory.set('physics-quest:video-mode:'+stage.id,mode);
  globalThis.__routeOutcome=null;render(EMVideoLesson,props);
  const outcome=globalThis.__routeOutcome;
  if(!outcome)throw new Error('Actual playlist capture failed: '+stage.id);
  const context={chapterId:chapter.id,stageId:stage.id,level,mode};
  states.push({...context,pages:outcome.list.length,reviews:outcome.review.length});
  for(const page of outcome.list)pages.push(checkRender(SegmentedLessonVideo,
   {main:page.media,start:page.start,end:page.end,onError:()=>{}},
   {...context,route:'playlist',pageId:page.id,mediaKey:mediaKey(page.media),start:page.start,end:page.end}));
  for(const movie of outcome.review)optionalReviews.push(checkRender(SegmentedLessonVideo,
   {main:movie,start:0,end:movie.duration,onError:()=>{}},
   {...context,route:'optional-review',mediaKey:mediaKey(movie),start:0,end:movie.duration}));
 }
}
let standardBattleStages=0,curriculumBattleStages=0,paperBattleStages=0;
for(const {stage}of stages){
 const exercises=problemsByStage[stage.id];
 if(exercises){
  curriculumBattleStages++;
  for(const exercise of exercises){
   globalThis.__curriculumPhase='solution';
   curriculum.push(checkRender(CurriculumBattle,
    {stage,exercises:[exercise],onExit:()=>{},onFinish:()=>{},onAnswer:()=>{}},
    {stageId:stage.id,exerciseId:exercise.id,expectedMediaId:exercise.id,youtubeId:exercise.solutionYoutubeId,start:0,end:999999}));
  }
 }else if(emPaperProblems[stage.id]){
  paperBattleStages++;
  const problems=emPaperProblems[stage.id];
  for(let index=0;index<problems.length;index++)for(const kind of ['question','solution']){
   globalThis.__paperIndex=index;globalThis.__paperKind=kind;
   const movie=paperCatalog.find(p=>p.id===problems[index].id)[kind];
   paper.push(checkRender(EMPaperBattle,{stage,problems,onExit:()=>{},onFinish:()=>{}},
    {stageId:stage.id,problemId:problems[index].id,kind,mediaKey:'paper-battles/'+movie.id,start:0,end:movie.duration}));
  }
 }else standardBattleStages++;
}
const pilot=checkRender(EMVideoPilot,{}, {stageId:'um-line-integral-entry',route:'conditional-text-view',mediaKey:'em-line-integral-nemo',start:0,end:${JSON.stringify(pilotDuration)}});
module.exports={stageIds:stages.map(s=>s.stage.id),states,pages,optionalReviews,paper,curriculum,pilot,noMovies,
 b2Enabled:b2SeriesEnabled(),battleStages:{curriculum:curriculumBattleStages,paper:paperBattleStages,standard:standardBattleStages},
 resolvedIds:Object.fromEntries(${JSON.stringify(expectedLegacyKeys)}.map(key=>[key,youtubeIdFor(key)]))};
`;
const compiled = await build({
  stdin:{contents:entry,resolveDir:app,sourcefile:'all-delivery-regression-entry.tsx',loader:'tsx'},
  bundle:true,platform:'node',format:'cjs',write:false,jsx:'automatic',loader:{'.css':'empty'},
  define:{'import.meta.env.BASE_URL':JSON.stringify('/physics-game-/'),'import.meta.env.DEV':'false','import.meta.env.VITE_REPORT_FORM_URL':'undefined'},
  plugins:[{name:'read-only-route-instrumentation',setup(builder){
    builder.onLoad({filter:/[/\\]EMVideoLesson\.tsx$/}, ({path:sourcePath}) => {
      let source=readFileSync(sourcePath,'utf8');
      const levels=' const [level,setLevel]=useState';
      source=instrumentOnce(source,levels,' globalThis.__routeLevels=levels;\n'+levels,'Lesson levels');
      const player=' return <div ref={top} className="screen lesson em-movie-lesson"';
      source=instrumentOnce(source,player,' globalThis.__routeOutcome={list,review};\n'+player,'Lesson page/review lists');
      lessonCaptures++;return {contents:source,loader:'tsx'};
    });
    builder.onLoad({filter:/[/\\]EMPaperBattle\.tsx$/}, ({path:sourcePath}) => {
      let source=readFileSync(sourcePath,'utf8');
      source=instrumentOnce(source,'const [index,setIndex]=useState(0)',
        'const [index,setIndex]=useState(globalThis.__paperIndex??0)','Paper question index');
      source=instrumentOnce(source,"useState<'question'|'solution'>('question')",
        "useState<'question'|'solution'>(globalThis.__paperKind??'question')",'Paper question/solution phase');
      paperCaptures++;return {contents:source,loader:'tsx'};
    });
    builder.onLoad({filter:/[/\\]CurriculumBattle\.tsx$/}, ({path:sourcePath}) => {
      const source=instrumentOnce(readFileSync(sourcePath,'utf8'),"useState<Phase>('question')",
        "useState<Phase>(globalThis.__curriculumPhase??'question')",'Curriculum solution phase');
      curriculumCaptures++;return {contents:source,loader:'tsx'};
    });
    builder.onResolve({filter:/^\.\/YouTubeVideo$/},()=>({path:'youtube-leaf-recorder',namespace:'delivery-test'}));
    builder.onResolve({filter:/^\.\.\/native$/},()=>({path:'native-noop',namespace:'delivery-test'}));
    builder.onLoad({filter:/.*/,namespace:'delivery-test'},({path:name})=>name==='native-noop'
      ?{contents:'export const hapticSuccess=()=>{},hapticError=()=>{};',loader:'js'}
      :{contents:`import React from 'react';
        export const YouTubeVideo=React.forwardRef(function Recorder(props,ref){
          globalThis.__videoCalls.push({youtubeId:props.youtubeId,mediaId:props.mediaId,title:props.title,start:props.start,end:props.end});
          return React.createElement('span',{'data-youtube-recorder':props.mediaId});
        });`,loader:'js',resolveDir:app});
  }}],
});
assert.equal(lessonCaptures,1);assert.equal(paperCaptures,1);assert.equal(curriculumCaptures,1);
const context={module:{exports:{}},exports:{},require,console,process,Buffer,URL,URLSearchParams,setTimeout,clearTimeout,setImmediate,TextEncoder,TextDecoder};
vm.runInNewContext(compiled.outputFiles[0].text,context,{filename:'all-video-delivery-regression.cjs',timeout:120000});
const result=JSON.parse(JSON.stringify(context.module.exports));
assert.deepEqual(Object.keys(legacy).sort(), [...expectedLegacyKeys].sort(), 'All 66 audited slots must have an exact mapping, without unrelated/dormant slots');
for (const [key, id] of Object.entries(legacy)) assert.match(id, validId, `${key}: invalid/unpublished placeholder ID`);
const publishedLedger=json('docs/legacy-youtube-published-20261025.json');
assert.equal(publishedLedger.schema,1);
assert.equal(publishedLedger.channelId,'UCd6G6SRqpj1jDbyMy98b5Bg','Use only the user-approved publication channel');
assert.equal(publishedLedger.videos.length,66);
assert.deepEqual(publishedLedger.videos.map(row=>row.mediaKey).sort(),[...expectedLegacyKeys].sort(),
  'Every audited slot must match the independently observed publication ledger');
let sourceBytesChecked=0;
for(const published of publishedLedger.videos){
  assert.equal(legacy[published.mediaKey],published.youtubeId,`${published.mediaKey}: a valid-looking ID must not point at another upload`);
  assert.match(published.sourceSha256,/^[a-f0-9]{64}$/,`${published.mediaKey}: invalid original-file fingerprint`);
  assert(Number.isSafeInteger(published.sourceBytes)&&published.sourceBytes>0,`${published.mediaKey}: invalid original byte count`);
  assert.equal(published.relativeSource,`public/media/${published.mediaKey}.mp4`,'The source fingerprint must identify this exact media file');
  const original=readFileSync(path.join(app,published.relativeSource));
  assert.equal(original.length,published.sourceBytes,`${published.mediaKey}: original-file size changed after upload`);
  assert.equal(createHash('sha256').update(original).digest('hex'),published.sourceSha256,
    `${published.mediaKey}: original-file content changed after upload`);
  sourceBytesChecked+=original.length;
}
assert.equal(result.stageIds.length,136,'The full production stage set must be enumerated');
assert.equal(new Set(result.stageIds).size,result.stageIds.length);
assert.deepEqual(result.noMovies,[],'A real stage unexpectedly stopped selecting its lesson videos');
assert.equal(result.states.length,272,'Every real stage must be rendered in both learning modes');
assert.equal(result.b2Enabled,false,'This release is YouTube-only; B2 priority must not mask a missing mapping');
assert.deepEqual(result.resolvedIds,legacy,'All 66 IDs must be exposed through the actual delivery resolver');
const allLessonPages=[...result.pages,...result.optionalReviews];
const lessonKeys=new Set(allLessonPages.map(page=>page.mediaKey));
assert.equal(lessonKeys.size,332,'All 279 replacement/HS movies and 53 legacy lesson/supplement movies remain reachable');
for(const key of originalLegacyLessons)assert(lessonKeys.has(key),`${key}: migrated lesson was silently removed from the UI`);
const actualRegistry={...json('src/content/video-delivery.json').videos,...json('src/content/high-school-youtube.generated.json'),...legacy};
const verifyYouTube=(page,expectedId=actualRegistry[page.mediaKey])=>{
  assert.equal(page.localTag,false,`${page.mediaKey??page.exerciseId}: actual component still renders a local <video>`);
  assert.equal(page.calls.length,1,`${page.mediaKey??page.exerciseId}: actual component must select exactly one YouTube leaf`);
  assert.match(expectedId??'',validId,`${page.mediaKey??page.exerciseId}: missing valid expected ID`);
  assert.equal(page.calls[0].youtubeId,expectedId,`${page.mediaKey??page.exerciseId}: wrong upload selected`);
  const expectedMediaId=page.mediaKey??page.expectedMediaId;
  if(expectedMediaId)assert.equal(page.calls[0].mediaId,expectedMediaId,'Resume/consent identity must keep the exact media key or exercise ID');
  if(typeof page.start==='number')assert.equal(page.calls[0].start,page.start,'Page start must not be lost during migration');
  if(typeof page.end==='number')assert.equal(page.calls[0].end,page.end,'Page end must not be lost during migration');
};
allLessonPages.forEach(page=>verifyYouTube(page));
assert.deepEqual(result.battleStages,{curriculum:114,paper:2,standard:20});
assert.equal(result.paper.length,12);
assert.deepEqual(result.paper.map(p=>p.mediaKey).sort(),[...paperKeys].sort());
result.paper.forEach(page=>verifyYouTube(page));
assert.equal(result.curriculum.length,160);
assert.equal(new Set(result.curriculum.map(p=>p.exerciseId)).size,160);
result.curriculum.forEach(page=>verifyYouTube(page,page.youtubeId));
verifyYouTube(result.pilot);
const reachedKeys=new Set([...allLessonPages,...result.paper,result.pilot].map(p=>p.mediaKey));
for(const key of expectedLegacyKeys)assert(reachedKeys.has(key),`${key}: mapping exists but no real component path reaches it`);
for(const key of reachedKeys)assert(!/^paper-battles\/paper-ue-integrals-/.test(key),'Shadowed trial questions must not be reintroduced');

// Distinct upload IDs remain distinct unless the release's reuse ledger
// independently verifies that two exact files are the same material. A shared
// filename/title alone is not proof that an unrelated old lesson is equivalent.
const registered=[...Object.entries(actualRegistry),...Object.entries(json('src/content/problem-youtube-ids.json')).map(([filename,id])=>['problem/'+filename,id])];
assert.equal(registered.length,505);
for(const [key,id]of registered)assert.match(id,validId,`${key}: invalid registered YouTube ID`);
const byId=new Map();for(const [key,id]of registered){const keys=byId.get(id)??[];keys.push(key);byId.set(id,keys);}
const shared=[...byId].filter(([,keys])=>keys.length>1);
if(shared.length){
  const reusePath=path.join(app,'docs/legacy-youtube-reuse-20261025.json');
  assert(existsSync(reusePath),'Shared YouTube IDs require an independent, exact-content reuse ledger');
  const reuse=JSON.parse(readFileSync(reusePath,'utf8'));
  for(const [youtubeId,mediaKeys]of shared){
    const proof=reuse.videos?.find(row=>row.youtubeId===youtubeId);
    assert(proof,`${youtubeId}: unverified reuse for ${mediaKeys.join(', ')}`);
    assert.deepEqual([...proof.mediaKeys].sort(),[...mediaKeys].sort());
    assert.match(proof.contentSha256??'',/^[a-f0-9]{64}$/,'Reuse requires exact source-file content identity');
  }
}
console.log(`PASS: ${result.stageIds.length} real stages, ${result.states.length} level/mode states, ${result.pages.length} selected pages and ${result.optionalReviews.length} optional reviews use the actual YouTube renderer.`);
console.log(`PASS: all 66 migrated slots remain reachable; 12 trial battle movies, 160 curriculum solutions and the conditional pilot select the correct IDs; no local <video> remains on these routes.`);
console.log(`PASS: 505 registered media slots, ${byId.size} distinct uploads, ${shared.length} independently verified shared IDs; no shadowed advanced trial movie was reintroduced.`);
console.log(`PASS: all 66 mapping IDs match the independent publication ledger; ${sourceBytesChecked} original source bytes match their SHA-256 fingerprints.`);
