import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const KEY='physics-quest:youtube-consent:v1';
const source=readFileSync('src/game/youtube-consent.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
function setup(initial=[],faults={}){
 const values=new Map(initial),events=new Map(),calls={get:0,set:0,remove:0};
 const storage={
  getItem(key){calls.get++;if(faults.get)throw Error('SecurityError');return values.get(key)??null;},
  setItem(key,value){calls.set++;if(faults.set)throw Error('QuotaExceededError');values.set(key,String(value));},
  removeItem(key){calls.remove++;if(faults.remove)throw Error('SecurityError');values.delete(key);},
 };
 const window={
  get localStorage(){if(faults.access)throw Error('SecurityError');return storage;},
  addEventListener(type,listener){if(!events.has(type))events.set(type,new Set());events.get(type).add(listener);},
 };
 const module={exports:{}};
 vm.runInNewContext(js,{module,exports:module.exports,window});
 return {api:module.exports,values,calls,events,storage,faults,
  dispatch(key,newValue,storageArea=storage){for(const listener of events.get('storage')??[])listener({key,newValue,storageArea});}};
}

// First visit is blocked. Reads and StrictMode-like subscribe/unsubscribe cycles
// cannot themselves grant permission, write storage, or accumulate DOM listeners.
const first=setup();
for(let i=0;i<5;i++)assert.equal(first.api.hasYouTubeConsent(),false);
assert.equal(first.calls.get,1);assert.equal(first.calls.set,0);assert.equal(first.calls.remove,0);
let notices=0;
for(let i=0;i<2;i++){const off=first.api.subscribeYouTubeConsent(()=>notices++);off();}
assert.equal(first.events.get('storage').size,1);
const off=first.api.subscribeYouTubeConsent(()=>notices++);
first.api.setYouTubeConsent(true);
assert.equal(first.api.hasYouTubeConsent(),true);assert.equal(first.values.get(KEY),'granted');assert.equal(notices,1);
first.api.setYouTubeConsent(true);assert.equal(notices,1,'No duplicate state-change notifications');
off();first.api.setYouTubeConsent(false);assert.equal(notices,1,'Unmounted subscriber removed');
assert.equal(first.api.hasYouTubeConsent(),false);assert.equal(first.values.has(KEY),false);

// A prior explicit grant survives a fresh module/app instance and repeated mounts.
const saved=setup([[KEY,'granted']]);
for(let mount=0;mount<4;mount++){
 const cleanup=saved.api.subscribeYouTubeConsent(()=>{});
 assert.equal(saved.api.hasYouTubeConsent(),true);cleanup();
}
assert.equal(saved.calls.set,0,'Reading a saved grant does not manufacture a write');
let mounted=saved.api.hasYouTubeConsent();
const mountedCleanup=saved.api.subscribeYouTubeConsent(()=>mounted=saved.api.hasYouTubeConsent());
saved.api.setYouTubeConsent(false);assert.equal(mounted,false,'Mounted consumer sees immediate revocation');mountedCleanup();
assert.equal(setup([...saved.values]).api.hasYouTubeConsent(),false,'Successful revoke survives restart');

for(const value of ['true','1','false','allowed','GRANTED','v0:granted','',null]){
 const h=setup(value===null?[]:[[KEY,value]]);assert.equal(h.api.hasYouTubeConsent(),false,String(value));
}
assert.equal(setup([['physics-quest:youtube-consent:v0','granted'],['unrelated','granted']]).api.hasYouTubeConsent(),false);

// Blocked access, reads, writes and deletes must not crash or drop the explicit
// current-session choice. A failed deletion cannot promise persistence on restart.
for(const faults of [{access:true},{get:true,set:true,remove:true},{set:true,remove:true}]){
 const h=setup([],faults);assert.equal(h.api.hasYouTubeConsent(),false);
 h.api.setYouTubeConsent(true);for(let i=0;i<3;i++)assert.equal(h.api.hasYouTubeConsent(),true);
 h.api.setYouTubeConsent(false);assert.equal(h.api.hasYouTubeConsent(),false);
}
const blockedRevoke=setup([[KEY,'granted']],{remove:true});
assert.equal(blockedRevoke.api.hasYouTubeConsent(),true);
blockedRevoke.api.setYouTubeConsent(false);assert.equal(blockedRevoke.api.hasYouTubeConsent(),false);
assert.equal(setup([...blockedRevoke.values]).api.hasYouTubeConsent(),true,'Failed deletion is explicitly session-only, not a false persistence claim');

const tabs=setup();let tabNotices=0;
tabs.api.hasYouTubeConsent();const tabCleanup=tabs.api.subscribeYouTubeConsent(()=>tabNotices++);
tabs.dispatch('unrelated','granted');assert.equal(tabs.api.hasYouTubeConsent(),false);
tabs.dispatch(KEY,'granted',{});assert.equal(tabs.api.hasYouTubeConsent(),false,'Ignore session/other storage areas');
tabs.values.set(KEY,'granted');tabs.dispatch(KEY,'granted');assert.equal(tabs.api.hasYouTubeConsent(),true);assert.equal(tabNotices,1);
tabs.values.delete(KEY);tabs.dispatch(KEY,null);assert.equal(tabs.api.hasYouTubeConsent(),false);assert.equal(tabNotices,2);
tabs.dispatch(KEY,'granted');assert.equal(tabs.api.hasYouTubeConsent(),true);
tabs.dispatch(KEY,'unrelated');assert.equal(tabs.api.hasYouTubeConsent(),false,'Malformed cross-tab values fail closed');
tabs.dispatch(KEY,'granted');tabs.dispatch(null,null);assert.equal(tabs.api.hasYouTubeConsent(),false,'Cross-tab clear revokes');
tabCleanup();const before=tabNotices;tabs.dispatch(KEY,'granted');assert.equal(tabNotices,before);assert.equal(tabs.api.hasYouTubeConsent(),true,'Snapshot stays current while unmounted');

const module={exports:{}};vm.runInNewContext(js,{module,exports:module.exports});
assert.equal(module.exports.hasYouTubeConsent(),false,'No-window/server environment fails closed');
assert.deepEqual(Object.keys(module.exports).sort(),['hasYouTubeConsent','setYouTubeConsent','subscribeYouTubeConsent']);
console.log('PASS: default-blocked/versioned grant, repeated reads and subscription cycles, local and cross-tab revocation, malformed values, blocked storage access/read/write/delete and session fallback. Framework-free store checks; not actual React StrictMode/browser/network or device playback tests.');
