# 技術の疑問の鎖（縦長・約3〜5分）を1本作る担当への手順書

2026-10-19。序章（ys-chain-00）と第1話（ys-chain-01）を作ったときの仕組みと手順。第2話からは、これと `AGENT-深掘りショート.md`（全部）を読めば作れるように書く。

- 作業ディレクトリ：`/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series`（コミット・push しない。アプリのコードは触らない。他の回・共通部品は編集しない）。
- 縦長の画面・字幕・読み・kana・確認のやり方は、深掘りショートとまったく同じ（`AGENT-深掘りショート.md` の 3〜7節）。この手順書は、違う所と、Blender の 3D の組み込みだけを書く。

## 1. まず読むもの
1. ナレーション（正本）：`docs/video-revision-20260924/deep/技術の疑問の鎖_序章_第1話_ナレーション.md`（第2話以降は統括が書く正本）。全体の約束・画面欄・検算・ブラックボックスの点検。
2. 構成：`docs/video-revision-20260924/deep/技術の疑問の鎖_暗号解読機からスマホとAIまで_構成.md`。
3. `AGENT-深掘りショート.md` の全部。
4. 見本：台本 `docs/video-revision-20260924/ytseries/chain-00.mjs`・`chain-01.mjs`、図 `scripts/umech/yt1-chain-00-diagrams.mjs`・`yt1-chain-01-diagrams.mjs`、共通部品 `scripts/umech/yt1-chain-common.mjs`、3D `scripts/blender/enigma.py`・`gilbert.py`。

## 2. ファイル・ID（NN は 2けた。序章＝00）
| もの | 場所 |
|---|---|
| ID | `ys-chain-NN` |
| 台本 | `docs/video-revision-20260924/ytseries/chain-NN.mjs`（`visualPilot:'vert-v1'`、`series:'技術の疑問の鎖 第n話 ｜ 年 人物'`） |
| 図 | `scripts/umech/yt1-chain-NN-diagrams.mjs`（キーは `chainNN-<組>:<名前>`。自動で読み込まれる。必ず `*.tmp.mjs` → `node --check` → 移す） |
| 3D | `scripts/blender/<場面>.py`（共通 `scripts/blender/bl_common.py`） |
| キャッシュ | `/private/tmp/ys/ys-chain-NN`（3D のコマは その下の `blender/`） |
| 動画 | `~/Downloads/physics-quest-youtube/技術の疑問の鎖/NN_<題名から「？」を除いたもの>.mp4` |
| ChatGPT 用 | `node scripts/umech/export-script-md.mjs ~/Downloads/physics-quest-特別編_台本/技術の疑問の鎖 <台本>` |

## 3. この鎖だけの決まり
- **年と人物を左上に小さく**：図の関数は全部 `when('1600年 ギルバート', (p,ctx)=>…)` で包む（`yt1-chain-common.mjs`）。舞台の左上 y 0–52 に小さな札が出る。ほかの物は、舞台の x<460・y<60 に置かない。後の時代の話（「後に 分かったこと」）でも、年の札は その話の主人公のまま。
- **画面の札**：`fuda('その時に 分かっていたこと'|'疑問'|'試作'|'実験'|'違和感'|'考えの 飛躍'|'次の 疑問'|'後に 分かったこと'|'事実'|'言い伝え', x, y, {text, anchor})`。
- **論理の筋の帯**：`logic([[文字,濃さ,色],…],{act})`。11・12 と同じ形で、年の札の下（舞台 y 60–316）に置く。帯の下の絵は y 330 から。
- **後の知識**：その時代に分からなかったことは「後に 分かったこと」の札を付け、いつ・誰が分かったかを注記する（例：1729年 グレイ）。
- **3D で描いた量の数値**：3D で描いた形（針の傾きなど）が、言葉や札の数値（測定値）と違うときは、別の図・別の札に分けて、どちらが計算でどちらが測定かを書く（第1話：球の上の針＝双極子の計算 68.3°、ノーマンの測定＝約72度）。
- 字幕の分割：深掘りショートと同じ（4行に収まらない、または 3文以上のときだけ、文の区切りで）。`lines` は語の途中で割らない折り方を自分で書く。機械確認は `scripts/umech/chain-lint.mjs`（deep-lint と同じ中身で、ID と正本の節だけ違う）。

## 4. Blender の 3D の組み込み
### 4.1 しくみ（既存のファイルは変えていない）
```
scripts/blender/<場面>.py  ──Blender -b──▶  <キャッシュ>/blender/<shot>/0000.png …  ＋ meta.json（コマ数・大きさ・アンカー・鍵・秒）
                                                     │
scripts/umech/blender-clip.mjs  bclip(shot,u,{x,y,w}) ┘  → <image href="data:image/png;base64,…">（SVG の中に入る）
scripts/umech/yt1-chain-NN-diagrams.mjs の図の関数が、声の進み（vseg・swin・ctx.tg）から u（0→1）を決めて貼る
```
- 書き出しの仕組み（`render-all-films.mjs`）は、図の関数が返す SVG を sharp でコマにするだけ。PNG を data: URI にして SVG に入れれば、`render-all-films.mjs`・`mxr-review.mjs`・`shots.mjs`・`qx-verify.mjs` は何も変えずに 3D を貼れる。**既存のファイルは1行も変えていない。**
- `file://` の画像は sharp（librsvg）が読まない（黙って空になる）ので使わない。
- data: URI の中の `N`・`I`・`u` は `%4E`・`%49`・`%75` と書く（blender-clip が自動でやる）。mxr-review が SVG の中の「NaN・Infinity・undefined」を壊れた図として止めるので、base64 がたまたまそう読めないようにするため。
- renderKey（書き直しの判定）は SVG の中身のハッシュなので、Blender で書き直してコマが変われば、動画も書き直しになる。
- 3D のコマが無い・下見（`--every`）のコマだけのときは、blender-clip がはっきりエラーで止める。

### 4.2 Blender の場面ファイルの書き方（`scripts/blender/<場面>.py`）
```python
import bpy, math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bl_common import *          # mat・box・cyl・sphere・torus・curve・camera・lights・Shot・run・seg・ease …
def b_x():  S=…build…; camera(loc, target, lens=…); lights(); return S     # 空の場面から作る
def a_x(S, i): u=i/(N-1); …物を動かす…                                     # コマ i の状態（キーフレームは使わない）
def an_x(S, i): return {'needleTip': Vector(…), …}                          # 2D の札を合わせる 3D の点
if __name__ == '__main__':
    run([Shot('shot-name', N, (幅,高さ), b_x, a_x, an_x, info={…})], [os.path.abspath(__file__)])
```
- 見た目：EEVEE、背景は透明、色の変換 Standard（16進の色がそのまま出る）。光る物は `mat(…, emit=色, strength=1〜1.6)`（強くすると白く飛ぶ）。透ける物は `alpha<1`（BLENDED）。
- **文字は 3D に入れない**（小さくなって 36px を割る）。文字・記号は 2D の札で、アンカー（`banchor`）に合わせて置く。
- 大きさ：舞台は 1000×920。置く幅で書き出す（1000×620〜760 など）。縮めて置くとぼやける。
- コマ数：動き1つに 48〜100 コマ。u を声の進みに合わせて丸めるので、30fps の全部を書く必要はない。
- 物理・数を 3D で見せるときは、**手で角や道を入れず、Python で計算して置き、assert で確かめる**（見本：enigma.py の `press()`・`verify_path()`＝描く道の両端が 3D の導線と一致するか、gilbert.py の `needle_at()`＝tan I＝2 tan λ）。

### 4.3 コマンド
```
B=/Applications/Blender.app/Contents/MacOS/Blender
$B -b --factory-startup -P scripts/blender/<場面>.py -- --out /private/tmp/ys/ys-chain-NN/blender --every 16   # 下見（16コマに1枚）
$B -b --factory-startup -P scripts/blender/<場面>.py -- --out /private/tmp/ys/ys-chain-NN/blender               # 本番（鍵が同じ shot は書かない）
$B -b --factory-startup -P scripts/blender/<場面>.py -- --out … --shots a,b --force                             # 一部だけ書き直す
```
- かかった時間は `<out>/render-log.txt` と各 `meta.json` の `seconds`。M5・EEVEE（24サンプル）で、1000×620 の中の図が 1コマ 約0.5秒、外の図・テレラが 約0.3秒（序章 8 shot 574コマで 約270秒、第1話 7 shot 414コマで 約130秒）。
- 下見の一覧：`node`＋sharp で PNG を並べる（暗い背景で合成して見る。透明の PNG をそのまま見ると、透ける物が明るく見える）。

### 4.4 図ファイルからの使い方
```js
import {bclip,bframe,banchor} from './blender-clip.mjs';
const IN={x:0,y:150,w:1000};                         // 舞台の中の置き場所
bclip('in-path', vseg(ctx,p,.1,.95), IN)             // 声の 10〜95% で 0→1 の動き
const a=banchor('in-path','lampG',u,IN);             // そのコマでの 3D の点（舞台の座標）
letter('G',a[0],a[1]-52)                             // 2D の札を重ねる
```
- 同じ組（キーの `:` の前）が続く間は、u を前の cue の終わりから続ける（序章 4a→4b：0→0.32、0.32→1）。

## 5. コマンド一式（深掘りショートの 6節と同じ。違う所だけ）
```
NN=02; ID=ys-chain-$NN; F=docs/video-revision-20260924/ytseries/chain-$NN.mjs; CACHE=/private/tmp/ys/$ID; MD=docs/video-revision-20260924/deep/<正本>.md
node scripts/umech/chain-lint.mjs $F 第2話 $MD            # 序章は「序章」
（Blender の書き出し → build-experiment → check-readings → prosody → 音声 → mix → mxr-review → render-all-films → qx-verify は深掘りショートと同じ）
mkdir -p ~/Downloads/physics-quest-youtube/技術の疑問の鎖
cp $CACHE/out/$ID.mp4 "$HOME/Downloads/physics-quest-youtube/技術の疑問の鎖/${NN}_<題名から？を除く>.mp4"
node scripts/umech/export-script-md.mjs ~/Downloads/physics-quest-特別編_台本/技術の疑問の鎖 $F
```
- kana：kana なしで build → `python3 scripts/umech/prosody.py $CACHE/plan.json > $CACHE/prosody.txt` → `python3 scripts/umech/chain-merge-kana.py $F $CACHE/prosody.txt 直した表.json`（`D("字幕"…, K+'…',{` の `{` の直後に kana を入れる。直した表が優先）→ build → prosody が終了 0。数字・年・「ちょう」（チョウ）などは手で直す（エンジンの綴りに合わせる：〜兆＝チョウ、〜乗＝ジョオ）。

## 6. 既存の動画が変わらないことの確かめ方
新しい部品は新しいファイルだけ（`scripts/blender/*`、`scripts/umech/blender-clip.mjs`・`yt1-chain-common.mjs`・`chain-lint.mjs`・`yt1-chain-NN-diagrams.mjs`）。それでも、縦長と横長を1本ずつ、変更の前後で書き出して `cmp` する：
```
B=/private/tmp/ys/chain-baseline; for id in ys-deep-12 ys-qx-hs-e-magnet-1; do mkdir -p $B/$id/{before,after}; cp /private/tmp/ys/$id/{plan.json,$id.json,$id.wav} $B/$id/; done
# 変更の前：FILM_OUTPUT=$B/$id/before、後：FILM_OUTPUT=$B/$id/after で render-all-films.mjs $id → cmp before/$id.mp4 after/$id.mp4
```
- 序章・第1話のときの結果：ys-deep-12・ys-qx-hs-e-magnet-1 とも、前後の mp4 がバイト単位で同じ（元のキャッシュの mp4 とも同じ md5）。
- 注意：scripts/umech/ に .mjs を足すと、縦長・横長の renderKey（全 .mjs のハッシュ）が変わるので、次の書き出しでは「Cached」にならず書き直しになる（中身は同じ）。

## 7. 見本で決めた値（序章・第1話）
- 序章の電流の道：円板 I・II・III・反射板 B の表、その日の始めの向き J・H・A。A を3回 → G・P・X、同じ設定で G → A（道の点の列が逆順に一致することを assert）。差し込み板は道の図では省く（画面に「箱の中を 図にしたもの（並びは 見やすく 変えた）」）。
- 第1話のテレラ：中心に下向きの双極子。針は B ∝ 3(m·r̂)r̂ − m の向き。緯度 0・25・51.5・70・85° → 傾き 0・43.0・68.3・79.7・87.5°。カメラを針の面に正面から向けたので、画面の角＝計算の角（傾きの弧は アンカーから描く）。
