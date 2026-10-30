// 実験 v2：高校の静電気からマクスウェル方程式まで（レビュー70項目を反映した版）
// 各章は maxwell-v2/ の部品ファイルにある。共通の約束は maxwell-v2/common.mjs と README-v2.md。
import {finish} from './maxwell-v2/common.mjs';
import {scenes as p01} from './maxwell-v2/p01.mjs';
import {scenes as p2} from './maxwell-v2/p2.mjs';
import {scenes as p34} from './maxwell-v2/p34.mjs';
import {scenes as p5} from './maxwell-v2/p5.mjs';
import {scenes as p6} from './maxwell-v2/p6.mjs';
import {scenes as p78} from './maxwell-v2/p78.mjs';
export const clips=[{
 id:'exp-maxwell-v2',
 title:'電気と磁石から、光の速さが出てくるのはなぜ？',
 condition:'真空中。高校の静電気・電流と磁場・電磁誘導から、マクスウェル方程式（積分形）と電磁波の速さまで。',
 scenes:finish([...p01,...p2,...p34,...p5,...p6,...p78].map(s=>structuredClone(s))),
}];
