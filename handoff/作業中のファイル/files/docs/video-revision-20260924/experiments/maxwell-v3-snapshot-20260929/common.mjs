// Shared by the parts of the v2 Maxwell film (maxwell-v2.mjs).
// Every cue shows the compact progress bar (four short labels) unless it sets fullBar:true,
// in which case the four full equations are shown at the top (eqs / eqFocus as before).
import {D,S} from '../../umech/schema.mjs';
export {D,S};
export const BAR_LABELS=['電荷と電場','磁石の線','磁場の変化→電場','電流→磁場'];
export function finish(scenes){
 for(const s of scenes)for(const q of s.cues){if(!q.fullBar)q.compactBar=true;q.barLabels=BAR_LABELS;}
 return scenes;
}
// A one-part test clip, so each part can be planned and checked on its own.
export const part=(id,scenes)=>[{id,title:'電気と磁石から、光の速さが出てくるのはなぜ？',condition:'',scenes:finish(scenes)}];
