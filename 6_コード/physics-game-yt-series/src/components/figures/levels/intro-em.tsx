import { Arw, Cap, FigSlider, L, Lbl, LevelFig, fmt, pingPong, step, useManual, useT } from './base';

// 電磁気学・初級（矢印の地図と、道・面の小片）の図解。
// 色の約束: 経路=L.path（黄）/ 場の矢印=L.field（水色）/ 選択中の小片=L.focus（金）
//           正の寄与=L.plus（黄緑）/ 負の寄与=L.minus（紫）/ 法線=L.normal（白）
// 画布は 320×190。ラベルは y <= 164 に置く。

// ===== 共通の小部品 =====

function Dash({ x1, y1, x2, y2, color = L.dim, w = 1.2 }: {
  x1: number; y1: number; x2: number; y2: number; color?: string; w?: number;
}) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeDasharray="4 3" />;
}

/** 電荷の玉。sign は +1 / −1。 */
function Charge({ x, y, sign, r = 12, label }: { x: number; y: number; sign: number; r?: number; label?: string }) {
  const color = sign >= 0 ? L.plus : L.minus;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={color} opacity={0.9} />
      <text x={x} y={y + 4.5} fontSize={13} fill="#0b1020" textAnchor="middle" fontWeight={700}>
        {sign >= 0 ? '+' : '−'}
      </text>
      {label ? <Lbl x={x} y={y + r + 13} text={label} color={color} size={10.5} anchor="middle" /> : null}
    </g>
  );
}

/** 丸みのある札。表や対応図に使う。 */
function Card({ x, y, w, h, color, on = true, children }: {
  x: number; y: number; w: number; h: number; color: string; on?: boolean; children?: React.ReactNode;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={color} opacity={on ? 0.2 : 0.08}
        stroke={color} strokeWidth={on ? 1.4 : 0.8} strokeOpacity={on ? 0.8 : 0.3} />
      {children}
    </g>
  );
}

// ==================================================================
// 1. ui-field-map — 矢印の地図
// ==================================================================

const MAP_PTS: [number, number][] = [];
for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) MAP_PTS.push([52 + i * 52, 56 + j * 36]);

/** 場所ごとに向きと長さが決まる、作り物の電場。 */
function mapVec(x: number, y: number): [number, number] {
  const a = ((x - 156) / 210) * 0.9 + ((y - 92) / 130) * 0.5;
  const len = 15 + 6 * Math.cos((x - 156) / 150);
  return [len * Math.cos(a), -len * Math.sin(a)];
}

function MapArrow({ x, y, color = L.field, w = 2 }: { x: number; y: number; color?: string; w?: number }) {
  const [dx, dy] = mapVec(x, y);
  return <Arw x={x - dx / 2} y={y - dy / 2} dx={dx} dy={dy} color={color} w={w} head={6.5} />;
}

export function MapGrid() {
  const t = useT();
  const k = step(t, MAP_PTS.length, 0.55);
  const [px, py] = MAP_PTS[k];
  return (
    <LevelFig label="空間の各点に矢印が1本ずつ決まっている">
      <circle cx={px} cy={py} r={15} fill={L.focus} opacity={0.14} stroke={L.focus} strokeWidth={1.4} />
      {MAP_PTS.map(([x, y], i) => <MapArrow key={i} x={x} y={y} w={i === k ? 3.2 : 2} color={i === k ? L.focus : L.field} />)}
      <Lbl x={14} y={24} text="場 = 場所ごとに矢印が1本決まる地図" color={L.text} size={11.5} />
      <Lbl x={14} y={158} text="点を指させば、向きと大きさが読める" color={L.dim} size={10.5} />
      <Cap text="描いた矢印は代表点の値。点と点の間にも値はある" />
    </LevelFig>
  );
}

export function MapStrength() {
  const t = useT();
  const k = step(t, 3, 1.3);
  const spots = [{ x: 62, e: 6 }, { x: 156, e: 4 }, { x: 250, e: 2 }];
  return (
    <LevelFig label="矢印の長さが電場の強さを表す">
      {spots.map((s, i) => (
        <g key={s.x}>
          <Arw x={s.x - s.e * 3.5} y={86} dx={s.e * 7} dy={0} color={i === k ? L.focus : L.field} w={i === k ? 3.4 : 2.6} />
          <circle cx={s.x} cy={110} r={2.5} fill={L.dim} />
          <Lbl x={s.x} y={132} text={`E = ${s.e} N/C`} color={i === k ? L.focus : L.dim} size={11} anchor="middle" />
        </g>
      ))}
      <Lbl x={14} y={26} text="長さで強さ、向きで力の向きを読む" color={L.text} size={11.5} />
      <Lbl x={14} y={46} text="N/C は「1 C あたり何 N か」" color={L.dim} size={10.5} />
      <Lbl x={160} y={156} text="左ほど矢印が長い = 左ほど電場が強い" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="矢印の長さは、その点で 1 C が受ける力の大きさ" />
    </LevelFig>
  );
}

export function MapTestCharge() {
  const t = useT();
  const k = step(t, 2, 1.8);
  const q = k === 0 ? 1 : 2;
  const blink = 0.45 + 0.35 * Math.sin(4 * t);
  return (
    <LevelFig label="置く電荷を変えると力は変わるが、地図はどうか">
      <Lbl x={14} y={26} text="同じ点に、違う電荷を置いてみる" color={L.text} size={11.5} />
      <Lbl x={14} y={58} text="地図の矢印" color={L.field} size={11} />
      <Arw x={110} y={54} dx={45} dy={0} color={L.field} w={3} />
      <Lbl x={162} y={58} text="E = 3 N/C" color={L.field} size={11} />
      <Charge x={30} y={104} sign={1} r={13} />
      <Lbl x={48} y={108} text={`q = +${q} C`} color={L.plus} size={11.5} />
      <Arw x={110} y={104} dx={q * 22} dy={0} color={L.plus} w={3.2} />
      <Lbl x={118 + q * 22} y={108} text={`F = ${3 * q} N`} color={L.plus} size={11.5} />
      <g opacity={blink}>
        <Lbl x={160} y={150} text="力は変わった。地図も描き直すのだろうか？" color={L.minus} size={11} anchor="middle" />
      </g>
      <Cap text="受ける力は電荷で変わる。では地図の矢印はどうか" />
    </LevelFig>
  );
}

export function MapForce() {
  const t = useT();
  const grow = 0.6 + 0.4 * pingPong(t, 4);
  return (
    <LevelFig label="電場に電荷を掛けると力になる">
      <Lbl x={14} y={26} text="地図の矢印 × 電荷 = 力の矢印" color={L.text} size={11.5} />
      <Lbl x={14} y={62} text="電場 E = 3 N/C" color={L.field} size={11} />
      <Arw x={134} y={58} dx={45} dy={0} color={L.field} w={3} />
      <Charge x={30} y={100} sign={1} r={13} />
      <Lbl x={50} y={104} text="q = +2 C" color={L.plus} size={11.5} />
      <Lbl x={14} y={140} text="力 F = qE = 6 N" color={L.plus} size={11.5} />
      <Arw x={134} y={136} dx={90 * grow} dy={0} color={L.plus} w={3.4} />
      <Lbl x={230} y={116} text="2 C × 3 N/C = 6 N" color={L.focus} size={11} anchor="middle" />
      <Cap text="地図は変わらない。変わるのは電荷が受ける力のほう" />
    </LevelFig>
  );
}

export function MapNegative() {
  const t = useT();
  const grow = 0.6 + 0.4 * pingPong(t, 4);
  return (
    <LevelFig label="負の電荷では力が逆を向く">
      <Lbl x={14} y={26} text="電荷の符号を負にすると" color={L.text} size={11.5} />
      <Lbl x={14} y={62} text="電場 E = 3 N/C" color={L.field} size={11} />
      <Arw x={134} y={58} dx={45} dy={0} color={L.field} w={3} />
      <Charge x={30} y={100} sign={-1} r={13} />
      <Lbl x={50} y={104} text="q = −2 C" color={L.minus} size={11.5} />
      <Lbl x={14} y={140} text="力 F = 6 N（逆向き）" color={L.minus} size={11.5} />
      <Arw x={224} y={136} dx={-90 * grow} dy={0} color={L.minus} w={3.4} />
      <Lbl x={232} y={116} text="大きさは同じ 6 N" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="裏返るのは力の向きだけ。地図は何ひとつ変わらない" />
    </LevelFig>
  );
}

export function MapPointCharge() {
  const t = useT();
  const sign = step(t, 2, 2.6) === 0 ? 1 : -1;
  const cx = 160, cy = 86;
  const rings = [{ r: 30, len: 18 }, { r: 56, len: 9 }];
  return (
    <LevelFig label="点電荷のまわりの放射状の地図">
      {rings.map(ring => (
        <g key={ring.r}>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            const ux = Math.cos(a), uy = Math.sin(a);
            const sx = cx + ux * ring.r, sy = cy + uy * ring.r;
            const d = sign > 0 ? ring.len : -ring.len;
            return <Arw key={i} x={sx} y={sy} dx={ux * d} dy={uy * d} color={L.field} w={2} head={6} />;
          })}
        </g>
      ))}
      <Charge x={cx} y={cy} sign={sign} r={12} />
      <Lbl x={14} y={24} text={sign > 0 ? '正の点電荷: 矢印は外向き' : '負の点電荷: 矢印は内向き'} color={L.text} size={11.5} />
      <Lbl x={160} y={162} text="離れるほど矢印は短い = 電場が弱い" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="地図の形を見れば、中心にどんな電荷があるか読める" />
    </LevelFig>
  );
}

export function MapMagnet() {
  const t = useT();
  const blink = 0.5 + 0.3 * Math.sin(3 * t);
  const loops = [1, 2];
  return (
    <LevelFig label="磁石のまわりの磁場の地図">
      {loops.map(k => (
        <g key={k}>
          <path d={`M 190 92 C 230 ${92 - 30 * k}, 90 ${92 - 30 * k}, 130 92`} fill="none" stroke={L.field} strokeWidth={1.8} opacity={0.75} />
          <Arw x={172} y={92 - 22.5 * k} dx={-24} dy={0} color={L.field} w={2.2} head={7} />
          <path d={`M 190 92 C 230 ${92 + 30 * k}, 90 ${92 + 30 * k}, 130 92`} fill="none" stroke={L.field} strokeWidth={1.8} opacity={0.75} />
          <Arw x={172} y={92 + 22.5 * k} dx={-24} dy={0} color={L.field} w={2.2} head={7} />
        </g>
      ))}
      <rect x={130} y={84} width={30} height={16} fill={L.minus} opacity={0.7} />
      <rect x={160} y={84} width={30} height={16} fill={L.plus} opacity={0.7} />
      <text x={145} y={96} fontSize={10.5} fill="#0b1020" textAnchor="middle" fontWeight={700}>S</text>
      <text x={175} y={96} fontSize={10.5} fill="#0b1020" textAnchor="middle" fontWeight={700}>N</text>
      <Lbl x={14} y={24} text="磁場も、場所ごとに矢印が決まる地図（単位 T）" color={L.text} size={11} />
      <g opacity={blink}>
        <Lbl x={160} y={160} text="線は矢印をつないだ目印。実在のひもではない" color={L.minus} size={10.5} anchor="middle" />
      </g>
      <Cap text="読み方は電場と同じ。向きと大きさが場所ごとに決まる" />
    </LevelFig>
  );
}

const PREVIEW_PATH = 'M 40 132 C 80 132, 92 84, 130 78 C 160 73, 172 96, 196 92';

export function MapPathPreview() {
  const t = useT();
  const which = step(t, 2, 2.2);
  return (
    <LevelFig label="地図の上に道と面を置く">
      {MAP_PTS.filter((_, i) => i % 2 === 0).map(([x, y], i) => <MapArrow key={i} x={x} y={y} w={1.6} />)}
      <g opacity={which === 0 ? 1 : 0.25}>
        <path d={PREVIEW_PATH} fill="none" stroke={L.path} strokeWidth={3} />
        <Arw x={180} y={92.5} dx={18} dy={-1} color={L.path} w={2.6} head={7} />
      </g>
      <g opacity={which === 1 ? 1 : 0.25}>
        <TilePoly cx={254} cy={80} th={0} la={56} ld={64} nLen={34} />
      </g>
      <Lbl x={14} y={24} text="地図に道を引く / 面を置く" color={L.text} size={11.5} />
      <Lbl x={14} y={148} text="道に沿って足す → 仕事" color={which === 0 ? L.path : L.dim} size={11} />
      <Lbl x={14} y={163} text="面を貫いた量を足す → 束" color={which === 1 ? L.focus : L.dim} size={11} />
      <Cap text="この章で取り出すのは、この2つの足し算だけ" />
    </LevelFig>
  );
}

export function MapSummary() {
  const t = useT();
  const k = step(t, 3, 1.2);
  return (
    <LevelFig label="地図から二つの足し算を取り出す">
      <Card x={90} y={26} w={140} h={32} color={L.field} on={k >= 0}>
        <Lbl x={160} y={47} text="場 = 矢印の地図" color={L.field} size={12} anchor="middle" bold />
      </Card>
      <Arw x={130} y={60} dx={-32} dy={26} color={L.dim} w={1.8} head={6} />
      <Arw x={190} y={60} dx={32} dy={26} color={L.dim} w={1.8} head={6} />
      <Card x={16} y={92} w={136} h={52} color={L.path} on={k >= 1}>
        <Lbl x={84} y={112} text="道の小片を足す" color={L.path} size={11.5} anchor="middle" />
        <Lbl x={84} y={131} text="→ 仕事 [J]" color={L.path} size={11.5} anchor="middle" bold />
      </Card>
      <Card x={168} y={92} w={136} h={52} color={L.focus} on={k >= 2}>
        <Lbl x={236} y={112} text="面の小片を足す" color={L.focus} size={11.5} anchor="middle" />
        <Lbl x={236} y={131} text="→ 束 [Wb]" color={L.focus} size={11.5} anchor="middle" bold />
      </Card>
      <Cap text="どちらも「その場所の成分 × 小片」を足すという同じ形" />
    </LevelFig>
  );
}

// ==================================================================
// 2. ui-work-direction — 斜めの力を道方向へ分ける
// ==================================================================

const DIR_DEG = 60;
const DIR_TH = (DIR_DEG * Math.PI) / 180;
const DIR_PXN = 6;                                   // 1 N = 6 px
const DIR_FX = 10 * DIR_PXN * Math.cos(DIR_TH);      // 右向き成分 5 N = 30 px
const DIR_FY = -10 * DIR_PXN * Math.sin(DIR_TH);     // 上向き成分 8.66 N = 52 px
const DIR_X0 = 74, DIR_X1 = 194, DIR_FLOOR = 142;    // 2 m = 120 px

function DirFloor() {
  return <line x1={16} y1={DIR_FLOOR} x2={304} y2={DIR_FLOOR} stroke={L.dim} strokeWidth={2} />;
}
function DirBox({ x }: { x: number }) {
  return <rect x={x - 18} y={DIR_FLOOR - 26} width={36} height={26} rx={5} fill={L.field} opacity={0.55} />;
}
/** 角度 60° を示す小さな弧。 */
function DirArc({ x, y, r = 22 }: { x: number; y: number; r?: number }) {
  const ex = x + r * Math.cos(DIR_TH), ey = y - r * Math.sin(DIR_TH);
  return (
    <g>
      <path d={`M ${x + r} ${y} A ${r} ${r} 0 0 0 ${ex.toFixed(1)} ${ey.toFixed(1)}`}
        fill="none" stroke={L.dim} strokeWidth={1.2} />
      <Lbl x={x + r + 6} y={y - r * 0.42} text="60°" color={L.dim} size={10} />
    </g>
  );
}
function DirRuler() {
  return (
    <g>
      <line x1={DIR_X0} y1={154} x2={DIR_X1} y2={154} stroke={L.path} strokeWidth={2.4} />
      <line x1={DIR_X0} y1={148} x2={DIR_X0} y2={160} stroke={L.path} strokeWidth={2.4} />
      <line x1={DIR_X1} y1={148} x2={DIR_X1} y2={160} stroke={L.path} strokeWidth={2.4} />
      <Lbl x={DIR_X1 + 8} y={158} text="2 m" color={L.path} size={11} />
    </g>
  );
}

export function DirScene() {
  const t = useT();
  const x = DIR_X0 + (DIR_X1 - DIR_X0) * pingPong(t, 6);
  return (
    <LevelFig label="斜めに引かれた箱">
      <DirFloor />
      <DirRuler />
      <DirBox x={x} />
      <Arw x={x} y={DIR_FLOOR - 13} dx={DIR_FX} dy={DIR_FY} color={L.field} w={3} />
      <DirArc x={x} y={DIR_FLOOR - 13} />
      <Lbl x={14} y={26} text="箱を右へ 2 m 動かす" color={L.text} size={11.5} />
      <Lbl x={14} y={46} text="引く力は 10 N、右向きから 60°" color={L.field} size={11} />
      <Cap text="力は斜め、移動は右。向きがそろっていない" />
    </LevelFig>
  );
}

export function DirQuestion() {
  const t = useT();
  const blink = 0.4 + 0.4 * Math.sin(4 * t);
  const x = 128;
  return (
    <LevelFig label="10ニュートンをそのまま掛けてよいか">
      <DirFloor />
      <DirRuler />
      <DirBox x={x} />
      <Arw x={x} y={DIR_FLOOR - 13} dx={DIR_FX} dy={DIR_FY} color={L.field} w={3} />
      <Lbl x={x + DIR_FX + 6} y={DIR_FLOOR + DIR_FY - 4} text="10 N" color={L.field} size={11} />
      <Arw x={x} y={DIR_FLOOR + 10} dx={60} dy={0} color={L.path} w={2.4} head={7} />
      <Lbl x={14} y={26} text="進んだのは右だけ" color={L.text} size={11.5} />
      <g opacity={blink}>
        <Lbl x={176} y={62} text="10 × 2 = 20 J ?" color={L.minus} size={13} bold />
        <Lbl x={176} y={82} text="向きがそろっていない" color={L.minus} size={10.5} />
      </g>
      <Cap text="力10 N × 距離2 m でよい？" />
    </LevelFig>
  );
}

/** 分解の図の共通の原点（箱の右上の角）。 */
const DIR_OX = 110, DIR_OY = DIR_FLOOR - 26;

export function DirSplit() {
  const t = useT();
  const u = pingPong(t, 5);
  const x = DIR_OX, y = DIR_OY;
  return (
    <LevelFig label="斜めの力を2本に分ける">
      <DirFloor />
      <DirBox x={x - 18} />
      <Dash x1={x + DIR_FX} y1={y + DIR_FY} x2={x + DIR_FX} y2={y} />
      <Dash x1={x + DIR_FX} y1={y + DIR_FY} x2={x} y2={y + DIR_FY} />
      <Arw x={x} y={y} dx={DIR_FX} dy={DIR_FY} color={L.field} w={3} />
      <Arw x={x} y={y} dx={DIR_FX * u} dy={0} color={L.plus} w={4.5} />
      <Arw x={x} y={y} dx={0} dy={DIR_FY * u} color={L.dim} w={3} />
      <Lbl x={x + DIR_FX + 8} y={y + DIR_FY - 2} text="10 N" color={L.field} size={11} />
      <Lbl x={x - 8} y={y + DIR_FY - 4} text="上向き成分 8.7 N" color={L.dim} size={10.5} anchor="end" />
      <Lbl x={x + DIR_FX + 8} y={y + 4} text="右向き成分 5 N" color={L.plus} size={10.5} />
      <Lbl x={14} y={26} text="斜めの矢印を、右向きと上向きの合成とみなす" color={L.text} size={11} />
      <Cap text="2本に分けてから、進む向きのほうだけを使う" />
    </LevelFig>
  );
}

export function DirComponent() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(3 * t);
  const x = DIR_OX, y = DIR_OY;
  return (
    <LevelFig label="右向きの成分は5ニュートン">
      <DirFloor />
      <DirBox x={x - 18} />
      <Dash x1={x + DIR_FX} y1={y + DIR_FY} x2={x + DIR_FX} y2={y} />
      <Arw x={x} y={y} dx={DIR_FX} dy={DIR_FY} color={L.field} w={2.2} />
      <g opacity={glow}>
        <Arw x={x} y={y} dx={DIR_FX} dy={0} color={L.plus} w={5} />
      </g>
      <DirArc x={x} y={y} r={20} />
      <Lbl x={x + DIR_FX + 8} y={y + 4} text="5 N" color={L.plus} size={12} bold />
      <Lbl x={14} y={26} text="右向きの成分を取り出す" color={L.text} size={11.5} />
      <Lbl x={186} y={60} text="10 × cos 60°" color={L.text} size={11.5} />
      <Lbl x={186} y={80} text="= 10 × 0.5" color={L.dim} size={11} />
      <Lbl x={186} y={100} text="= 5 N" color={L.plus} size={12.5} bold />
      <Cap text="矢印の長さ 10 N のちょうど半分が、右向きの成分" />
    </LevelFig>
  );
}

export function DirPerp() {
  const t = useT();
  const blink = 0.45 + 0.35 * Math.sin(3.4 * t);
  const x = DIR_OX, y = DIR_OY;
  return (
    <LevelFig label="上向きの成分は右へ進めない">
      <DirFloor />
      <DirBox x={x - 18} />
      <Arw x={x} y={y} dx={DIR_FX} dy={DIR_FY} color={L.field} w={2.2} />
      <Arw x={x} y={y} dx={0} dy={DIR_FY} color={L.focus} w={4.5} />
      <Lbl x={x - 8} y={y + DIR_FY - 4} text="上向き成分 8.7 N" color={L.focus} size={10.5} anchor="end" />
      <Lbl x={14} y={26} text="上向きの成分は、右へは 1 mm も進めない" color={L.text} size={11} />
      <g opacity={blink}>
        <Lbl x={186} y={92} text="この図では床が支え、" color={L.dim} size={10.5} />
        <Lbl x={186} y={108} text="移動を作らない" color={L.dim} size={10.5} />
      </g>
      <Lbl x={186} y={132} text="右への寄与は 0" color={L.minus} size={11.5} bold />
      <Cap text="進んでいない向きの成分は、仕事に足されない" />
    </LevelFig>
  );
}

export function DirWork() {
  const t = useT();
  const u = pingPong(t, 6);
  const x = DIR_X0 + (DIR_X1 - DIR_X0) * u;
  return (
    <LevelFig label="右向き成分と距離を掛ける">
      <DirFloor />
      <DirRuler />
      <DirBox x={x} />
      <Arw x={x + 18} y={DIR_FLOOR - 13} dx={DIR_FX} dy={0} color={L.plus} w={4.5} />
      <Lbl x={x + 18 + DIR_FX + 6} y={DIR_FLOOR - 9} text="5 N" color={L.plus} size={11} />
      <Lbl x={14} y={26} text="掛けるのは右向きの 5 N と、進んだ 2 m" color={L.text} size={11} />
      <Lbl x={14} y={50} text={`W = 5 × ${fmt(2 * u, 1)} = ${fmt(10 * u, 1)} J`} color={L.focus} size={13} bold />
      <Cap text="道方向の成分だけを使えば、掛け算1回で仕事が出る" />
    </LevelFig>
  );
}

export function DirUnits() {
  const t = useT();
  const k = step(t, 3, 1.4);
  const rows = [
    { left: '道方向の成分', right: '5 N', color: L.plus },
    { left: '× 進んだ距離', right: '× 2 m', color: L.path },
    { left: '仕事 W', right: '10 N·m = 10 J', color: L.focus },
  ];
  return (
    <LevelFig label="単位を掛けるとジュールになる">
      {rows.map((row, i) => (
        <Card key={row.left} x={26} y={34 + i * 36} w={268} h={28} color={row.color} on={i <= k}>
          <Lbl x={38} y={53 + i * 36} text={row.left} color={L.text} size={11.5} />
          <Lbl x={282} y={53 + i * 36} text={row.right} color={row.color} size={11.5} anchor="end" bold={i === 2} />
        </Card>
      ))}
      <Lbl x={160} y={156} text="N × m = J（ニュートン・メートルがジュール）" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="数だけでなく単位も掛ける。答えの単位が J なら仕事" />
    </LevelFig>
  );
}

export function DirSummary() {
  const t = useT();
  const k = step(t, 2, 1.7);
  return (
    <LevelFig label="掛けるのは道方向の成分だけ">
      <Card x={16} y={38} w={288} h={44} color={L.minus} on={k === 0}>
        <Lbl x={30} y={58} text="矢印の長さをそのまま掛ける" color={L.minus} size={11} />
        <Lbl x={286} y={72} text="10 × 2 = 20 J（誤り）" color={L.minus} size={11.5} anchor="end" />
      </Card>
      <Card x={16} y={92} w={288} h={44} color={L.plus} on={k === 1}>
        <Lbl x={30} y={112} text="道方向の成分を取り出してから掛ける" color={L.plus} size={11} />
        <Lbl x={286} y={126} text="5 × 2 = 10 J（正しい）" color={L.plus} size={11.5} anchor="end" bold />
      </Card>
      <Lbl x={160} y={26} text="同じ力・同じ距離でも、答えは変わる" color={L.text} size={11.5} anchor="middle" />
      <Lbl x={160} y={158} text="中級では成分×移動距離を内積で表す" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="矢印の長さではなく、道方向の成分を掛ける" />
    </LevelFig>
  );
}

// ==================================================================
// 3. ui-work-bent-path — 曲がる道の仕事
// ==================================================================

/** L字の道。1 m = 44 px。 */
const BP: [number, number][] = [[84, 142], [128, 142], [128, 54], [84, 54]];
/** 区間ラベルを道の外側へ置くためのずらし量。 */
const B_LBL: { dx: number; dy: number; anchor: 'start' | 'middle' }[] = [
  { dx: 0, dy: 20, anchor: 'middle' },
  { dx: 18, dy: 4, anchor: 'start' },
  { dx: 0, dy: -10, anchor: 'middle' },
];
type BSeg = { dir: [number, number]; m: number; fx: number; fy: number; comp: number; tag: string };
const BSEGS: BSeg[] = [
  { dir: [1, 0], m: 1, fx: 3, fy: 4, comp: 3, tag: '右へ 1 m' },
  { dir: [0, -1], m: 2, fx: 2, fy: 1, comp: 1, tag: '上へ 2 m' },
  { dir: [-1, 0], m: 1, fx: -2, fy: 2, comp: 2, tag: '左へ 1 m' },
];
const B_PXN = 10; // 1 N = 10 px

function bMid(i: number): [number, number] {
  return [(BP[i][0] + BP[i + 1][0]) / 2, (BP[i][1] + BP[i + 1][1]) / 2];
}
function BentPath({ opacity = 1 }: { opacity?: number }) {
  return <polyline points={BP.map(p => `${p[0]},${p[1]}`).join(' ')} fill="none" stroke={L.path}
    strokeWidth={2.6} opacity={opacity} strokeLinejoin="round" />;
}
function BentSegArrows({ active = -1, reverse = false }: { active?: number; reverse?: boolean }) {
  return (
    <g>
      {BSEGS.map((_, i) => {
        const a = reverse ? BP[i + 1] : BP[i];
        const b = reverse ? BP[i] : BP[i + 1];
        return <Arw key={i} x={a[0]} y={a[1]} dx={b[0] - a[0]} dy={b[1] - a[1]}
          color={i === active ? L.focus : L.path} w={i === active ? 3.6 : 2.4} head={9} />;
      })}
    </g>
  );
}

export function BentScene() {
  const t = useT();
  const u = (t % 5) / 5;
  const total = 4; // 1 m + 2 m + 1 m
  const s = u * total;
  let px = BP[0][0], py = BP[0][1], acc = 0;
  for (let i = 0; i < 3; i++) {
    const len = BSEGS[i].m;
    if (s >= acc + len) { acc += len; px = BP[i + 1][0]; py = BP[i + 1][1]; continue; }
    const f = (s - acc) / len;
    px = BP[i][0] + (BP[i + 1][0] - BP[i][0]) * f;
    py = BP[i][1] + (BP[i + 1][1] - BP[i][1]) * f;
    break;
  }
  return (
    <LevelFig label="L字に曲がる道">
      <BentPath />
      <BentSegArrows />
      <circle cx={px} cy={py} r={5.5} fill={L.focus} />
      <Lbl x={14} y={26} text="道が L 字に曲がっている" color={L.text} size={11.5} />
      <Lbl x={172} y={60} text="区間1: 右へ 1 m" color={L.path} size={11} />
      <Lbl x={172} y={82} text="区間2: 上へ 2 m" color={L.path} size={11} />
      <Lbl x={172} y={104} text="区間3: 左へ 1 m" color={L.path} size={11} />
      <Lbl x={172} y={132} text="進む向きが 2 回変わる" color={L.dim} size={10.5} />
      <Cap text="まっすぐな区間が3本つながった道だと見る" />
    </LevelFig>
  );
}

export function BentQuestion() {
  const t = useT();
  const blink = 0.4 + 0.4 * Math.sin(4 * t);
  const [mx, my] = bMid(1);
  return (
    <LevelFig label="どの向きを前とするか">
      <BentPath />
      <Arw x={mx} y={my} dx={20} dy={-10} color={L.field} w={2.6} />
      <Lbl x={mx + 24} y={my - 14} text="力" color={L.field} size={11} />
      <g opacity={blink}>
        <Lbl x={168} y={54} text="前向き成分を取りたい" color={L.minus} size={11} />
        <Lbl x={168} y={76} text="でも「前」は" color={L.minus} size={11} />
        <Lbl x={168} y={96} text="1つに決まらない" color={L.minus} size={11} />
      </g>
      <Lbl x={14} y={26} text="どの向きを「前」とすればよいのだろう" color={L.text} size={11} />
      <Cap text="道全体で1つの前を選ぶことはできない" />
    </LevelFig>
  );
}

export function BentDirections() {
  const t = useT();
  const k = step(t, 3, 1.1);
  return (
    <LevelFig label="前は区間ごとに決める">
      <BentPath opacity={0.4} />
      <BentSegArrows active={k} />
      {BSEGS.map((s, i) => {
        const [mx, my] = bMid(i);
        return <Lbl key={i} x={mx + B_LBL[i].dx} y={my + B_LBL[i].dy}
          text={`前${i + 1}`} color={i === k ? L.focus : L.dim} size={11} anchor={B_LBL[i].anchor} />;
      })}
      <Lbl x={14} y={26} text="区間の中では、道はまっすぐ" color={L.text} size={11.5} />
      <Lbl x={172} y={66} text="区間1：右向き" color={L.path} size={11} />
      <Lbl x={172} y={88} text="区間2：上向き" color={L.path} size={11} />
      <Lbl x={172} y={110} text="区間3：左向き" color={L.path} size={11} />
      <Cap text="区間ごとに前を決めれば、成分を取り出せる" />
    </LevelFig>
  );
}

function BentSegFig({ i, label, note }: { i: number; label: string; note: string }) {
  const s = BSEGS[i];
  const [mx, my] = bMid(i);
  const fx = s.fx * B_PXN, fy = -s.fy * B_PXN;
  const px = s.dir[0] * s.comp * B_PXN, py = s.dir[1] * s.comp * B_PXN;
  return (
    <LevelFig label={label}>
      <BentPath opacity={0.3} />
      <BentSegArrows active={i} />
      <Arw x={mx} y={my} dx={fx} dy={fy} color={L.field} w={2.6} />
      <Dash x1={mx + fx} y1={my + fy} x2={mx + px} y2={my + py} />
      <Arw x={mx} y={my} dx={px} dy={py} color={L.plus} w={4.5} />
      <circle cx={mx} cy={my} r={3} fill={L.focus} />
      <Lbl x={14} y={26} text={`区間${i + 1}: ${s.tag}`} color={L.text} size={11.5} />
      <Lbl x={172} y={62} text={`前向き成分 ${s.comp} N`} color={L.plus} size={11} />
      <Lbl x={172} y={84} text={`長さ ${s.m} m`} color={L.path} size={11} />
      <Lbl x={172} y={112} text={`ΔW${'₁₂₃'[i]} = ${s.comp} × ${s.m}`} color={L.text} size={11} />
      <Lbl x={172} y={134} text={`= ${s.comp * s.m} J`} color={L.focus} size={13} bold />
      <Cap text={note} />
    </LevelFig>
  );
}

export function BentSeg1() {
  return <BentSegFig i={0} label="区間1の寄与" note="区間の中はまっすぐ。前向き成分に長さを掛けるだけ" />;
}
export function BentSeg2() {
  return <BentSegFig i={1} label="区間2の寄与" note="前が上に変わったので、上向きの成分を取る" />;
}
export function BentSeg3() {
  return <BentSegFig i={2} label="区間3の寄与" note="前が左に変わったので、左向きの成分を取る" />;
}

export function BentTotal() {
  const t = useT();
  const shown = Math.min(step(t, 4, 1), 3);
  const vals = BSEGS.map(s => s.comp * s.m);
  const partial = vals.slice(0, shown).reduce((a, b) => a + b, 0);
  return (
    <LevelFig label="3区間の寄与を足す">
      <BentPath opacity={0.3} />
      {BSEGS.map((s, i) => {
        const a = BP[i], b = BP[i + 1];
        const [mx, my] = bMid(i);
        const on = i < shown;
        return (
          <g key={i}>
            <Arw x={a[0]} y={a[1]} dx={b[0] - a[0]} dy={b[1] - a[1]} color={on ? L.plus : L.dim} w={on ? 3.4 : 1.8} head={8} />
            <Lbl x={mx + B_LBL[i].dx} y={my + B_LBL[i].dy}
              text={`${s.comp * s.m} J`} color={on ? L.plus : L.dim} size={10.5} anchor={B_LBL[i].anchor} />
          </g>
        );
      })}
      <Lbl x={14} y={26} text="区間ごとの寄与を順に足す" color={L.text} size={11.5} />
      <Lbl x={172} y={66} text="3 + 2 + 2" color={L.text} size={12} />
      <Lbl x={172} y={92} text={`ここまで ${partial} J`} color={L.focus} size={12} bold />
      <Lbl x={172} y={114} text={`${shown} / 3 区間`} color={L.dim} size={10.5} />
      <Lbl x={172} y={140} text={shown === 3 ? '合計 W = 7 J' : ''} color={L.focus} size={13} bold />
      <Cap text="新しい規則は使わない。掛け算を順に足しただけ" />
    </LevelFig>
  );
}

export function BentReverse() {
  const t = useT();
  const rev = step(t, 2, 2.2) === 1;
  const vals = BSEGS.map(s => (rev ? -1 : 1) * s.comp * s.m);
  const total = vals.reduce((a, b) => a + b, 0);
  return (
    <LevelFig label="道を逆向きにたどると符号が変わる">
      <BentPath opacity={0.3} />
      <BentSegArrows reverse={rev} />
      {BSEGS.map((s, i) => {
        const [mx, my] = bMid(i);
        return <Lbl key={i} x={mx + B_LBL[i].dx} y={my + B_LBL[i].dy}
          text={`${fmt(vals[i], 0)} J`} color={rev ? L.minus : L.plus} size={10.5} anchor={B_LBL[i].anchor} />;
      })}
      <Lbl x={14} y={26} text={rev ? '逆向きにたどる' : 'もとの向きにたどる'} color={L.text} size={11.5} />
      <Lbl x={172} y={74} text="各区間の移動の" color={L.dim} size={10.5} />
      <Lbl x={172} y={90} text={rev ? '向きがすべて逆' : '向きはそのまま'} color={L.dim} size={10.5} />
      <Lbl x={172} y={122} text={`合計 ${fmt(total, 0)} J`} color={rev ? L.minus : L.plus} size={13} bold />
      <Cap text="道には向きが付いている。逆にたどれば符号が変わる" />
    </LevelFig>
  );
}

function bentCurve(u: number): [number, number] {
  const p0 = [84, 142], c1 = [196, 142], c2 = [196, 54], p3 = [84, 54];
  const v = 1 - u;
  const f = (a: number, b: number, c: number, d: number) =>
    v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c + u * u * u * d;
  return [f(p0[0], c1[0], c2[0], p3[0]), f(p0[1], c1[1], c2[1], p3[1])];
}
const BENT_CURVE = Array.from({ length: 65 }, (_, i) => {
  const [x, y] = bentCurve(i / 64);
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}).join(' ');

export function BentRefine() {
  const t = useT();
  const counts = [3, 6, 12];
  const n = counts[step(t, counts.length, 1.5)];
  const nodes = Array.from({ length: n + 1 }, (_, i) => bentCurve(i / n));
  return (
    <LevelFig label="辺を増やすと曲線に近づく">
      <polyline points={BENT_CURVE} fill="none" stroke={L.path} strokeWidth={2.4} opacity={0.4} />
      {nodes.slice(0, -1).map((p, i) => {
        const q = nodes[i + 1];
        return <Arw key={i} x={p[0]} y={p[1]} dx={q[0] - p[0]} dy={q[1] - p[1]} color={L.focus} w={2.4} head={7} />;
      })}
      <Lbl x={14} y={26} text={`折れ線 ${n} 辺`} color={L.text} size={11.5} />
      <Lbl x={214} y={100} text="足し方は同じ" color={L.dim} size={10.5} />
      <Lbl x={214} y={118} text="前向き成分 × 長さ" color={L.dim} size={10.5} />
      <Lbl x={214} y={136} text="を足すだけ" color={L.focus} size={10.5} />
      <Cap text="辺を増やすほど、折れ線がなめらかな道に近づく" />
    </LevelFig>
  );
}

export function BentSummary() {
  const t = useT();
  const k = step(t, 3, 1.2);
  const steps = ['短い区間を直線で近似する', '区間ごとに「前」を決める', '前向き成分 × 長さ を足す'];
  return (
    <LevelFig label="曲がる道の仕事の作り方">
      {steps.map((s, i) => (
        <Card key={s} x={20} y={34 + i * 38} w={280} h={30} color={i === 2 ? L.focus : L.path} on={i <= k}>
          <Lbl x={34} y={54 + i * 38} text={`${i + 1}.`} color={L.dim} size={11} />
          <Lbl x={54} y={54 + i * 38} text={s} color={i === 2 ? L.focus : L.text} size={11.5} bold={i === 2} />
        </Card>
      ))}
      <Lbl x={160} y={160} text="道を逆にたどれば、合計の符号も変わる" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="この和を、上級編では道 C に沿う積分として書く" />
    </LevelFig>
  );
}

// ==================================================================
// 4. ui-electric-work-path — 電場の中の曲がった道を4区間に分けて足す
// ==================================================================

/** 1 m = 40 px。区間の向きは +x から反時計まわりの角度[度]。 */
const PX_PER_M = 40;
const PATH_PTS: [number, number][] = [[34, 152], [74, 152], [143.3, 112], [157.0, 74.4], [194.6, 60.7]];

type Seg = { deg: number; m: number; Ex: number; Ey: number; mag: number; ang: number; par: number; dW: number };
const SEGS: Seg[] = [
  { deg: 0, m: 1, Ex: 3, Ey: 4, mag: 5, ang: 53, par: 3, dW: 3 },
  { deg: 30, m: 2, Ex: 0, Ey: 2, mag: 2, ang: 60, par: 1, dW: 2 },
  { deg: 70, m: 1, Ex: 1.8794, Ey: -0.684, mag: 2, ang: 90, par: 0, dW: 0 },
  { deg: 20, m: 1, Ex: -1.8794, Ey: -0.684, mag: 2, ang: 180, par: -2, dW: -2 },
];
const E_PX = 8; // 1 N/C = 8 px

function segUnit(i: number): [number, number] {
  const a = (SEGS[i].deg * Math.PI) / 180;
  return [Math.cos(a), -Math.sin(a)];
}
function segMid(i: number): [number, number] {
  const a = PATH_PTS[i], b = PATH_PTS[i + 1];
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

function curvePoint(u: number): [number, number] {
  const n = PATH_PTS.length - 1;
  const tt = Math.min(Math.max(u, 0), 1) * n;
  const i = Math.min(Math.floor(tt), n - 1);
  const f = tt - i;
  const p0 = PATH_PTS[Math.max(i - 1, 0)], p1 = PATH_PTS[i], p2 = PATH_PTS[i + 1], p3 = PATH_PTS[Math.min(i + 2, n)];
  const h = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * f + (2 * a - 5 * b + 4 * c - d) * f * f + (-a + 3 * b - 3 * c + d) * f * f * f);
  return [h(p0[0], p1[0], p2[0], p3[0]), h(p0[1], p1[1], p2[1], p3[1])];
}
const CURVE_PTS = Array.from({ length: 81 }, (_, i) => {
  const [x, y] = curvePoint(i / 80);
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}).join(' ');

function PathCurveLine({ opacity = 1 }: { opacity?: number }) {
  return <polyline points={CURVE_PTS} fill="none" stroke={L.path} strokeWidth={2.6} opacity={opacity} strokeLinejoin="round" />;
}

/** 区間 i の矢印・電場・投影をまとめて描く。 */
function SegDetail({ i }: { i: number }) {
  const s = SEGS[i];
  const [ux, uy] = segUnit(i);
  const a = PATH_PTS[i], b = PATH_PTS[i + 1];
  const [mx, my] = segMid(i);
  const ex = s.Ex * E_PX, ey = -s.Ey * E_PX;
  const projLen = s.par * E_PX;
  const tipX = mx + ex, tipY = my + ey;
  const footX = mx + ux * projLen, footY = my + uy * projLen;
  return (
    <g>
      <Arw x={a[0]} y={a[1]} dx={b[0] - a[0]} dy={b[1] - a[1]} color={L.focus} w={3.4} head={9} />
      <Arw x={mx} y={my} dx={ex} dy={ey} color={L.field} w={2.6} head={8} />
      {s.par !== 0 ? <Dash x1={tipX} y1={tipY} x2={footX} y2={footY} color={L.dim} /> : null}
      {s.par !== 0 ? (
        <Arw x={mx} y={my} dx={ux * projLen} dy={uy * projLen} color={s.par > 0 ? L.plus : L.minus} w={4.5} head={9} />
      ) : null}
      <circle cx={mx} cy={my} r={3} fill={L.focus} />
    </g>
  );
}

export function PathRecall() {
  const t = useT();
  const u = pingPong(t, 5);
  const x0 = 60, x1 = 200;
  return (
    <LevelFig label="まっすぐな道での仕事">
      <line x1={x0} y1={110} x2={x1} y2={110} stroke={L.path} strokeWidth={3} />
      <Arw x={x0} y={110} dx={(x1 - x0) * u + 1} dy={0} color={L.focus} w={3.4} head={9} />
      <Arw x={130} y={82} dx={24} dy={0} color={L.field} w={2.6} />
      <Lbl x={160} y={78} text="道に沿う成分 3 N/C" color={L.field} size={10.5} />
      <Lbl x={130} y={130} text="Δr = 1 m" color={L.path} size={11} anchor="middle" />
      <Lbl x={14} y={26} text="直線で電場成分が一定なら、掛け算で求まる" color={L.text} size={11} />
      <Lbl x={14} y={50} text={`ΔW = 1 C × 3 N/C × ${fmt(u, 2)} m ≈ ${fmt(3 * u, 2)} J`} color={L.focus} size={11} />
      <Lbl x={14} y={158} text="単位は C × N/C × m = J" color={L.dim} size={10.5} />
      <Cap text="この形へ戻せるように、曲がった道を区間へ切る" />
    </LevelFig>
  );
}

export function PathCurveQuestion() {
  const t = useT();
  const u = (t % 5) / 5;
  const [px, py] = curvePoint(u);
  const blink = 0.45 + 0.35 * Math.sin(4 * t);
  return (
    <LevelFig label="曲がった道では向きが場所ごとに変わる">
      <PathCurveLine />
      {SEGS.map((s, i) => {
        const [mx, my] = segMid(i);
        return <Arw key={i} x={mx} y={my} dx={s.Ex * E_PX} dy={-s.Ey * E_PX} color={L.field} w={2.2} head={7} />;
      })}
      <circle cx={px} cy={py} r={5} fill={L.focus} />
      <Lbl x={70} y={24} text="進む向きが、場所ごとに変わる" color={L.text} size={11.5} />
      <g opacity={blink}>
        <Lbl x={208} y={120} text="どの距離に" color={L.minus} size={11} />
        <Lbl x={208} y={136} text="どの成分を掛ける？" color={L.minus} size={11} />
      </g>
      <Cap text="道方向の成分が一つに決まらず、掛け算1回が使えない" />
    </LevelFig>
  );
}

export function PathSplit() {
  const t = useT();
  const k = step(t, 4, 0.9);
  return (
    <LevelFig label="曲線を4本の直線矢印に置き換える">
      <PathCurveLine opacity={0.4} />
      {SEGS.map((s, i) => {
        const a = PATH_PTS[i], b = PATH_PTS[i + 1];
        const [mx, my] = segMid(i);
        const [ux, uy] = segUnit(i);
        return (
          <g key={i}>
            <Arw x={a[0]} y={a[1]} dx={b[0] - a[0]} dy={b[1] - a[1]} color={i === k ? L.focus : L.path} w={i === k ? 3.6 : 2.4} head={9} />
            <Lbl x={mx + uy * 17} y={my - ux * 17 + 4} text={`Δr${'₁₂₃₄'[i]}`} color={i === k ? L.focus : L.dim} size={11} anchor="middle" />
          </g>
        );
      })}
      <Lbl x={70} y={24} text="4 区間に切り、区間ごとに 1 本の矢印" color={L.text} size={11} />
      <Lbl x={206} y={116} text="長さ" color={L.dim} size={10.5} />
      <Lbl x={206} y={132} text="1 m, 2 m, 1 m, 1 m" color={L.path} size={10.5} />
      <Cap text="短い区間の中なら、道は直線・電場は一定とみなせる" />
    </LevelFig>
  );
}

function SegFig({ i, title, value, note, label }: {
  i: number; title: string; value: string; note: string; label: string;
}) {
  const s = SEGS[i];
  return (
    <LevelFig label={label}>
      <PathCurveLine opacity={0.3} />
      {SEGS.map((_, j) => (
        j === i ? null : (
          <Arw key={j} x={PATH_PTS[j][0]} y={PATH_PTS[j][1]} dx={PATH_PTS[j + 1][0] - PATH_PTS[j][0]}
            dy={PATH_PTS[j + 1][1] - PATH_PTS[j][1]} color={L.dim} w={1.8} head={7} />
        )
      ))}
      <SegDetail i={i} />
      <Lbl x={70} y={24} text={title} color={L.text} size={11} />
      <Lbl x={206} y={62} text={`電場 ${s.mag} N/C`} color={L.field} size={10.5} />
      <Lbl x={206} y={78} text={`道との角 ${s.ang}°`} color={L.dim} size={10.5} />
      <Lbl x={206} y={96} text={`道方向成分 ${fmt(s.par, 0)} N/C`} color={s.par > 0 ? L.plus : s.par < 0 ? L.minus : L.dim} size={10.5} />
      <Lbl x={206} y={114} text={`長さ ${s.m} m`} color={L.path} size={10.5} />
      <Lbl x={206} y={136} text={value} color={L.focus} size={12.5} bold />
      <Cap text={note} />
    </LevelFig>
  );
}

export function PathSeg1() {
  return <SegFig i={0} label="区間1の寄与" title="区間1: 電場は道から 53° 傾く"
    value="ΔW₁ = 3 J" note="傾いた矢印をそのまま掛けず、道方向の成分だけを使う" />;
}
export function PathSeg2() {
  return <SegFig i={1} label="区間2の寄与" title="区間2: 成分は小さいが、長さが 2 m"
    value="ΔW₂ = 2 J" note="成分が小さくても、仕事は移動距離にも比例する" />;
}
export function PathSeg3() {
  return <SegFig i={2} label="区間3の寄与はゼロ" title="区間3: 電場は道と 90°、真横を向く"
    value="ΔW₃ = 0 J" note="横から押されているだけ。どれだけ進んでも 0 J" />;
}
export function PathSeg4() {
  return <SegFig i={3} label="区間4の寄与は負" title="区間4: 電場は道のちょうど逆向き"
    value="ΔW₄ = −2 J" note="逆を向いた区間は、合計を減らす向きに効く" />;
}

export function PathTotal() {
  const t = useT();
  const shown = Math.min(step(t, 5, 0.95), 4);
  const partial = SEGS.slice(0, shown).reduce((a, s) => a + s.dW, 0);
  return (
    <LevelFig label="4区間の寄与を符号のまま足す">
      <PathCurveLine opacity={0.3} />
      {SEGS.map((s, i) => {
        const a = PATH_PTS[i], b = PATH_PTS[i + 1];
        const [mx, my] = segMid(i);
        const [ux, uy] = segUnit(i);
        const on = i < shown;
        const color = !on ? L.dim : s.dW > 0 ? L.plus : s.dW < 0 ? L.minus : L.field;
        return (
          <g key={i}>
            <Arw x={a[0]} y={a[1]} dx={b[0] - a[0]} dy={b[1] - a[1]} color={color} w={on ? 3.4 : 1.8} head={8} />
            <Lbl x={mx + uy * 16} y={my - ux * 16 + 4} text={`${fmt(s.dW, 0)} J`} color={color} size={10.5} anchor="middle" />
          </g>
        );
      })}
      <Lbl x={70} y={24} text="符号をそのままにして足していく" color={L.text} size={11.5} />
      <Lbl x={206} y={72} text="3 + 2 + 0 − 2" color={L.text} size={11.5} />
      <Lbl x={206} y={96} text={`ここまで ${fmt(partial, 0)} J`} color={L.focus} size={12} bold />
      <Lbl x={206} y={118} text={`${shown} / 4 区間`} color={L.dim} size={10.5} />
      <Lbl x={206} y={142} text={shown === 4 ? '合計 W = 3 J' : ''} color={L.focus} size={12.5} bold />
      <Cap text="大きさだけを足すと 7 J。符号を落としてはいけない" />
    </LevelFig>
  );
}

export function PathRefine() {
  const t = useT();
  const counts = [4, 8, 16, 32];
  const n = counts[step(t, counts.length, 1.4)];
  const nodes = Array.from({ length: n + 1 }, (_, i) => curvePoint(i / n));
  return (
    <LevelFig label="区間を細かくすると折れ線が曲線に近づく">
      <PathCurveLine opacity={0.35} />
      {nodes.slice(0, -1).map((p, i) => {
        const q = nodes[i + 1];
        return <Arw key={i} x={p[0]} y={p[1]} dx={q[0] - p[0]} dy={q[1] - p[1]} color={L.focus} w={2.2} head={5.5} />;
      })}
      <Lbl x={70} y={24} text={`区間 ${n} 本`} color={L.text} size={11.5} />
      <Lbl x={206} y={104} text="足し方は同じ" color={L.dim} size={10.5} />
      <Lbl x={206} y={122} text="成分 × 長さ を" color={L.dim} size={10.5} />
      <Lbl x={206} y={140} text="符号のまま足す" color={L.focus} size={10.5} />
      <Cap text="細かくするほど折れ線が本当の道に重なっていく" />
    </LevelFig>
  );
}

// ==================================================================
// 5. ui-flux-one-tile — 1枚のタイル
// ==================================================================

/** 斜投影: x軸=(1,0)、奥行き軸=(0.52,−0.36)、上方向=(0,−1)。 */
const DEP: [number, number] = [0.52, -0.36];

function tileGeom(cx: number, cy: number, thDeg: number, la: number, ld: number) {
  const th = (thDeg * Math.PI) / 180;
  const c = Math.cos(th), s = Math.sin(th);
  const ex = s - c * DEP[0], ey = -c * DEP[1];
  const nx = c + s * DEP[0], ny = s * DEP[1];
  const hx = (ex * la) / 2, hy = (ey * la) / 2, vy = ld / 2;
  const pts: [number, number][] = [
    [cx - hx, cy - hy - vy], [cx + hx, cy + hy - vy],
    [cx + hx, cy + hy + vy], [cx - hx, cy - hy + vy],
  ];
  return { pts, n: [nx, ny] as [number, number] };
}

function TilePoly({ cx, cy, th, la = 70, ld = 54, color = L.focus, normal = true, nLen = 54, nColor = L.normal, flip = 1 }: {
  cx: number; cy: number; th: number; la?: number; ld?: number; color?: string;
  normal?: boolean; nLen?: number; nColor?: string; flip?: number;
}) {
  const g = tileGeom(cx, cy, th, la, ld);
  return (
    <g>
      <polygon points={g.pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}
        fill={color} opacity={0.32} stroke={color} strokeWidth={1.6} />
      {normal ? <Arw x={cx} y={cy} dx={g.n[0] * nLen * flip} dy={g.n[1] * nLen * flip} color={nColor} w={2.4} head={8} /> : null}
    </g>
  );
}

function BField({ ys = [58, 92, 126], x0 = 20, x1 = 124, color = L.field, opacity = 1 }: {
  ys?: number[]; x0?: number; x1?: number; color?: string; opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      {ys.map(y => <Arw key={y} x={x0} y={y} dx={x1 - x0} dy={0} color={color} w={2.4} head={8} />)}
    </g>
  );
}

export function TileIntro() {
  const t = useT();
  const glow = 0.55 + 0.25 * Math.sin(3 * t);
  return (
    <LevelFig label="一様な磁場の中に置いたタイル1枚">
      <BField />
      <TilePoly cx={150} cy={92} th={0} normal={false} />
      <g opacity={glow}>
        <TilePoly cx={150} cy={92} th={0} normal={false} color={L.focus} />
      </g>
      <Lbl x={14} y={26} text="一様な磁場 B = 2 T" color={L.field} size={11.5} />
      <Lbl x={196} y={80} text="タイル 1 枚" color={L.focus} size={11} />
      <Lbl x={196} y={98} text="面積 0.5 m²" color={L.focus} size={11} />
      <Lbl x={160} y={160} text="どれだけ通り抜けたか = 磁束" color={L.dim} size={11} anchor="middle" />
      <Cap text="求める量は、この面の磁束" />
    </LevelFig>
  );
}

export function TileNormal() {
  const t = useT();
  const which = step(t, 2, 1.8);
  const g = tileGeom(150, 92, 0, 70, 54);
  return (
    <LevelFig label="面の向きを法線で表す">
      <TilePoly cx={150} cy={92} th={0} normal={false} />
      <Arw x={150} y={92} dx={g.n[0] * 56} dy={g.n[1] * 56} color={which === 0 ? L.normal : L.dim} w={which === 0 ? 3 : 1.8} head={8} />
      <Arw x={150} y={92} dx={-g.n[0] * 56} dy={-g.n[1] * 56} color={which === 1 ? L.normal : L.dim} w={which === 1 ? 3 : 1.8} head={8} />
      <Lbl x={14} y={26} text="面に垂直な矢印を1本立てる = 法線" color={L.text} size={11.5} />
      <Lbl x={212} y={86} text={which === 0 ? '← いまはこちらを正' : ''} color={L.normal} size={10.5} />
      <Lbl x={14} y={96} text={which === 1 ? '← こちらも垂直' : ''} color={L.normal} size={10.5} />
      <Lbl x={160} y={158} text="垂直な向きは表と裏の2つ。どちらを正か決めておく" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="法線の向きが面の向き。符号はこの決め方で変わる" />
    </LevelFig>
  );
}

export function TilePerp() {
  const t = useT();
  const k = step(t, 3, 1.1);
  return (
    <LevelFig label="面に垂直な磁場は最大の磁束を作る">
      <BField ys={[58, 126]} />
      <TilePoly cx={150} cy={92} th={0} nLen={46} />
      <Lbl x={172} y={84} text="法線" color={L.normal} size={10} />
      <Lbl x={14} y={26} text="磁場と法線が同じ向き（0°）" color={L.text} size={11.5} />
      <Lbl x={212} y={64} text="B = 2 T" color={L.field} size={11} />
      <Lbl x={212} y={82} text="A = 0.5 m²" color={L.focus} size={11} />
      <Lbl x={212} y={106} text={k >= 1 ? 'Φ = 2 × 0.5' : ''} color={L.text} size={11} />
      <Lbl x={212} y={126} text={k >= 2 ? '= 1 Wb' : ''} color={L.focus} size={12.5} bold />
      <Lbl x={160} y={160} text="T × m² = Wb（ウェーバ）" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="垂直のときは面積がそのまま正面から見た面積になる" />
    </LevelFig>
  );
}

export function TileParallel() {
  const t = useT();
  const u = (t % 3) / 3;
  const blink = 0.45 + 0.35 * Math.sin(4 * t);
  return (
    <LevelFig label="磁場と平行な面は磁束ゼロ">
      <BField ys={[60, 124]} x1={100} />
      {[74, 110].map(y => <Arw key={y} x={20 + 240 * u} y={y} dx={26} dy={0} color={L.field} w={2.2} head={7} />)}
      <TilePoly cx={150} cy={92} th={90} />
      <Lbl x={14} y={26} text="タイルを寝かせて、磁場と平行にする" color={L.text} size={11.5} />
      <Lbl x={210} y={140} text="面積は 0.5 m² のまま" color={L.dim} size={10.5} anchor="middle" />
      <g opacity={blink}>
        <Lbl x={210} y={158} text="なのに Φ = 0 Wb" color={L.minus} size={12} anchor="middle" bold />
      </g>
      <Cap text="磁場はタイルの横をすり抜ける。面積だけでは決まらない" />
    </LevelFig>
  );
}

export function TileTilt() {
  const t = useT();
  const th = 15 + 55 * pingPong(t, 7);
  const ghost = tileGeom(150, 92, 0, 70, 54);
  return (
    <LevelFig label="傾けると正面から見た面積が減る">
      <BField ys={[58, 126]} />
      <polygon points={ghost.pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}
        fill="none" stroke={L.dim} strokeWidth={1.3} strokeDasharray="4 3" />
      <Arw x={150} y={92} dx={ghost.n[0] * 46} dy={ghost.n[1] * 46} color={L.dim} w={1.4} head={6} />
      <TilePoly cx={150} cy={92} th={th} nLen={46} />
      <Lbl x={14} y={26} text={`法線が磁場から ${Math.round(th)}° 傾く`} color={L.text} size={11.5} />
      <Lbl x={14} y={46} text="点線は、正面を向けた場合のタイル" color={L.dim} size={10.5} />
      <Lbl x={160} y={158} text="減るのは磁場でも面積でもなく、正面から見た面積" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="正面を向けたときと比べると、受け止められる量が減る" />
    </LevelFig>
  );
}

export function TileProjected() {
  const t = useT();
  const k = step(t, 2, 1.6);
  const full = 44, proj = 31, top = 52, h = 56;
  return (
    <LevelFig label="45度に傾けたときの正面から見た面積">
      <BField x0={16} x1={92} />
      <TilePoly cx={132} cy={92} th={45} la={66} ld={50} />
      <Dash x1={216} y1={top} x2={216 + full} y2={top} />
      <rect x={216} y={top} width={full} height={h} fill="none" stroke={L.dim} strokeWidth={1.3} strokeDasharray="4 3" />
      <rect x={216} y={top} width={proj} height={h} fill={L.focus} opacity={k >= 1 ? 0.55 : 0.2} stroke={L.focus} strokeWidth={1.5} />
      <Lbl x={238} y={42} text="磁場の向きから見たタイル" color={L.dim} size={10} anchor="middle" />
      <Lbl x={231} y={124} text="約 0.35 m²" color={L.focus} size={10.5} anchor="middle" />
      <Lbl x={280} y={124} text="0.5 m²" color={L.dim} size={10} anchor="middle" />
      <Lbl x={14} y={26} text="法線が 45° 傾くと、見える面積が縮む" color={L.text} size={11} />
      <Lbl x={14} y={150} text="Φ = 2 × 0.35 ≈ 0.71 Wb" color={L.focus} size={12.5} />
      <Cap text="面積は 0.5 m² のまま。変わったのは見え方だけ" />
    </LevelFig>
  );
}

export function TileSlider() {
  const [deg, setDeg] = useManual(time => 90 * pingPong(time, 9));
  const th = Math.min(Math.max(deg, 0), 90);
  const flux = 1 * Math.cos((th * Math.PI) / 180);
  const barMax = 120;
  return (
    <>
      <LevelFig label="角度と磁束の関係">
        <BField ys={[56, 92, 128]} x0={16} x1={92} />
        <TilePoly cx={140} cy={92} th={th} la={66} ld={50} />
        <rect x={216} y={62} width={barMax} height={16} rx={3} fill={L.dim} opacity={0.25} />
        <rect x={216} y={62} width={Math.max(barMax * flux, 0)} height={16} rx={3} fill={L.focus} opacity={0.85} />
        <Lbl x={216} y={54} text="磁束" color={L.dim} size={10} />
        <Lbl x={216} y={98} text={`Φ = ${fmt(flux, 2)} Wb`} color={L.focus} size={12} bold />
        <Lbl x={216} y={120} text={`角 ${Math.round(th)}°`} color={L.text} size={11} />
        <Lbl x={14} y={26} text="法線と磁場のなす角を動かす" color={L.text} size={11.5} />
        <Cap text="0°で 1 Wb、90°で 0 Wb。なめらかに変わる量" />
      </LevelFig>
      <FigSlider label="法線と磁場のなす角 [度]" value={th} min={0} max={90} step={1} onChange={setDeg} display={`${Math.round(th)}°`} />
    </>
  );
}

export function TileLinesCaution() {
  const t = useT();
  const blink = 0.45 + 0.35 * Math.sin(3 * t);
  const lines = [52, 72, 92, 112, 132];
  return (
    <LevelFig label="本数は数えるための比喩">
      {lines.map(y => (
        <g key={y}>
          <line x1={16} y1={y} x2={300} y2={y} stroke={L.field} strokeWidth={1.5} opacity={0.5} />
          <Arw x={40} y={y} dx={26} dy={0} color={L.field} w={2} head={6.5} />
        </g>
      ))}
      <TilePoly cx={168} cy={92} th={0} la={64} ld={72} normal={false} />
      <Lbl x={14} y={30} text="線を引いて本数を数えるのは、磁場を見やすく描く工夫" color={L.text} size={10.5} />
      <g opacity={blink}>
        <Lbl x={160} y={158} text="空間にひもが張ってあるわけではない" color={L.minus} size={11} anchor="middle" />
      </g>
      <Cap text="磁束は垂直な磁場成分×面積で計算する" />
    </LevelFig>
  );
}

export function TileSummary() {
  const t = useT();
  const k = step(t, 3, 1.3);
  const cases = [{ th: 0, v: '1 Wb', tag: '垂直（0°）' }, { th: 45, v: '約 0.71 Wb', tag: '斜め（45°）' }, { th: 90, v: '0 Wb', tag: '平行（90°）' }];
  return (
    <LevelFig label="角度と磁束のまとめ">
      {cases.map((c, i) => (
        <g key={c.th} opacity={i === k ? 1 : 0.4}>
          <TilePoly cx={62 + i * 98} cy={82} th={c.th} la={44} ld={38} nLen={30} />
          <Lbl x={62 + i * 98} y={132} text={c.tag} color={L.dim} size={10} anchor="middle" />
          <Lbl x={62 + i * 98} y={150} text={c.v} color={i === k ? L.focus : L.dim} size={12} anchor="middle" bold={i === k} />
        </g>
      ))}
      <Lbl x={160} y={26} text="磁束の計算に使うのは法線方向の成分" color={L.text} size={11.5} anchor="middle" />
      <Cap text="仕事で道方向の成分だけが効いたのと、同じ読み方" />
    </LevelFig>
  );
}

// ==================================================================
// 6. ui-flux-many-tiles — タイルを並べて足す
// ==================================================================

/** 縦に4枚積んだタイル。1枚 0.5 m²、法線方向の磁場は場所ごとに違う。 */
const STACK = { x: 150, la: 56, ld: 18, ys: [54, 72, 90, 108] };
const STACK_B = [2, 2, 1, 0];
const STACK_DPHI = [1, 1, 0.5, 0];

function stackPts(j: number): [number, number][] {
  const ex = -DEP[0], ey = -DEP[1];
  const hx = (ex * STACK.la) / 2, hy = (ey * STACK.la) / 2, vy = STACK.ld / 2;
  const cx = STACK.x, cy = STACK.ys[j];
  return [
    [cx - hx, cy - hy - vy], [cx + hx, cy + hy - vy],
    [cx + hx, cy + hy + vy], [cx - hx, cy - hy + vy],
  ];
}

function StackTiles({ active = -1, upto = 4, color = L.focus }: { active?: number; upto?: number; color?: string }) {
  return (
    <g>
      {[0, 1, 2, 3].map(j => (
        <polygon key={j} points={stackPts(j).map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}
          fill={j === active ? L.focus : color} opacity={j < upto ? (j === active ? 0.75 : 0.3) : 0.08}
          stroke={j === active ? L.focus : color} strokeWidth={j === active ? 2 : 1.2}
          strokeOpacity={j < upto ? 0.9 : 0.25} />
      ))}
    </g>
  );
}

function StackNormals({ flip = 1, len = 24 }: { flip?: number; len?: number }) {
  return (
    <g>
      {[0, 1, 2, 3].map(j => (
        <Arw key={j} x={STACK.x} y={STACK.ys[j]} dx={len * flip} dy={0} color={L.normal} w={2} head={6.5} />
      ))}
    </g>
  );
}

/** 各タイルへ届く磁場。法線方向の成分に比例した長さで描く。0 のタイルは面に沿って描く。 */
function StackField({ dim = -1 }: { dim?: number }) {
  return (
    <g>
      {[0, 1, 2, 3].map(j => {
        const b = STACK_B[j];
        const y = STACK.ys[j];
        const op = dim >= 0 && dim !== j ? 0.3 : 1;
        if (b === 0) {
          return (
            <g key={j} opacity={op}>
              <Arw x={STACK.x + 2} y={y + 9} dx={0} dy={-18} color={L.field} w={2.6} head={7} />
              <g opacity={0.45}><Arw x={92} y={y} dx={26} dy={0} color={L.field} w={1.6} head={6} /></g>
            </g>
          );
        }
        const len = b * 14;
        return <g key={j} opacity={op}><Arw x={127 - len} y={y} dx={len} dy={0} color={L.field} w={2.4} head={7.5} /></g>;
      })}
    </g>
  );
}

function StackLabels({ dim = -1 }: { dim?: number }) {
  return (
    <g>
      {[0, 1, 2, 3].map(j => (
        <Lbl key={j} x={16} y={STACK.ys[j] + 4} text={`タイル${j + 1}`}
          color={dim === j ? L.focus : L.dim} size={10} bold={dim === j} />
      ))}
    </g>
  );
}

export function TilesOne() {
  const t = useT();
  const glow = 0.6 + 0.25 * Math.sin(3 * t);
  return (
    <LevelFig label="タイル1枚の寄与">
      <BField ys={[60, 92, 124]} x0={18} x1={120} />
      <TilePoly cx={150} cy={92} th={0} la={52} ld={44} nLen={40} />
      <g opacity={glow}>
        <TilePoly cx={150} cy={92} th={0} la={52} ld={44} normal={false} />
      </g>
      <Lbl x={14} y={26} text="法線方向の磁場 2 T、ΔA = 0.5 m²" color={L.text} size={11.5} />
      <Lbl x={206} y={102} text="ΔΦ = 2 × 0.5" color={L.text} size={11} />
      <Lbl x={206} y={122} text="= 1 Wb" color={L.focus} size={12.5} bold />
      <Lbl x={160} y={160} text="この1枚を部品にして、大きな面を組み立てる" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="単位は T·m² = Wb。1枚ならこれまでと同じ掛け算" />
    </LevelFig>
  );
}

export function TilesGrid4() {
  const t = useT();
  const k = step(t, 4, 0.8);
  return (
    <LevelFig label="面を4枚のタイルに分ける">
      <StackTiles active={k} />
      <StackNormals />
      <StackField />
      <StackLabels dim={k} />
      {[0, 1, 2, 3].map(j => (
        <Lbl key={j} x={188} y={STACK.ys[j] + 4} text={`法線方向 ${STACK_B[j]} T`}
          color={j === k ? L.focus : L.dim} size={10.5} bold={j === k} />
      ))}
      <Lbl x={14} y={30} text="面積はどれも 0.5 m²" color={L.text} size={11} />
      <Lbl x={160} y={140} text="白い矢印が法線。磁場は場所ごとに違ってよい" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={160} y={158} text="タイル4は磁場が面と平行 → 法線方向は 0 T" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="1枚ずつ「法線方向の成分 × 面積」を作っていく" />
    </LevelFig>
  );
}

function TilesCell({ j, label, note }: { j: number; label: string; note: string }) {
  const b = STACK_B[j], d = STACK_DPHI[j];
  return (
    <LevelFig label={label}>
      <StackTiles active={j} />
      <StackNormals />
      <StackField dim={j} />
      <StackLabels dim={j} />
      <Lbl x={14} y={30} text={`タイル${j + 1} を取り出す`} color={L.text} size={11.5} />
      <Lbl x={190} y={STACK.ys[j] - 8} text={`法線方向 ${b} T`} color={L.field} size={10.5} />
      <Lbl x={190} y={STACK.ys[j] + 8} text="面積 0.5 m²" color={L.dim} size={10.5} />
      <Lbl x={160} y={140} text={`ΔΦ${'₁₂₃₄'[j]} = ${b} × 0.5`} color={L.text} size={12} anchor="middle" />
      <Lbl x={160} y={160} text={`= ${fmt(d, 1)} Wb`} color={L.focus} size={13} anchor="middle" bold />
      <Cap text={note} />
    </LevelFig>
  );
}

export function TilesCell1() {
  return <TilesCell j={0} label="タイル1の寄与" note="法線方向の成分に、タイルの面積を掛けるだけ" />;
}
export function TilesCell2() {
  return <TilesCell j={1} label="タイル2の寄与" note="同じ形の掛け算をもう一度。ここまでの合計は 2 Wb" />;
}
export function TilesCell3() {
  return <TilesCell j={2} label="タイル3の寄与" note="磁場が弱くても、掛け算の形はそのまま" />;
}
export function TilesCell4() {
  return <TilesCell j={3} label="タイル4の寄与" note="磁場が面と平行なら、法線方向の成分は 0" />;
}

export function TilesWeak() {
  const t = useT();
  const blink = 0.4 + 0.4 * Math.sin(3.6 * t);
  const which = 2 + step(t, 2, 1.4);
  return (
    <LevelFig label="磁場が弱いタイルはどう数えるか">
      <StackTiles active={which} />
      <StackNormals />
      <StackField />
      <StackLabels dim={which} />
      <Lbl x={14} y={30} text="タイル3と4では、法線方向の磁場が小さい" color={L.text} size={11} />
      <Lbl x={190} y={STACK.ys[2] + 4} text="1 T" color={L.field} size={11} />
      <Lbl x={190} y={STACK.ys[3] + 4} text="0 T（面と平行）" color={L.field} size={10.5} />
      <g opacity={blink}>
        <Lbl x={160} y={152} text="同じ掛け算でよいのだろうか？" color={L.minus} size={12} anchor="middle" />
      </g>
      <Cap text="タイルごとに磁場が違う。数え方は変わるのだろうか" />
    </LevelFig>
  );
}

export function TilesTotal() {
  const t = useT();
  const shown = Math.min(step(t, 5, 0.9), 4);
  const partial = STACK_DPHI.slice(0, shown).reduce((a, b) => a + b, 0);
  return (
    <LevelFig label="4枚の寄与を足す">
      <StackTiles upto={shown} active={shown - 1} />
      <StackNormals />
      <StackLabels />
      {[0, 1, 2, 3].map(j => (
        <Lbl key={j} x={190} y={STACK.ys[j] + 4} text={j < shown ? `${fmt(STACK_DPHI[j], 1)} Wb` : ''}
          color={L.plus} size={11} />
      ))}
      <Lbl x={14} y={30} text="1 + 1 + 0.5 + 0" color={L.text} size={12} />
      <Lbl x={160} y={140} text={`足した枚数 ${shown} / 4`} color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={160} y={160} text={`${shown===4?'全体':'途中まで'}の磁束 ${fmt(partial, 1)} Wb`} color={L.focus} size={13} anchor="middle" bold />
      <Cap text="寄与 0 のタイルも「0 を足した」と数える" />
    </LevelFig>
  );
}

export function TilesAnalogy() {
  const t = useT();
  const k = step(t, 2, 1.7);
  return (
    <LevelFig label="仕事と磁束は同じ骨組み">
      <Card x={14} y={34} w={140} h={92} color={L.path} on={k === 0}>
        <Lbl x={84} y={54} text="道の和（仕事）" color={L.path} size={11.5} anchor="middle" bold />
        <Lbl x={84} y={78} text="道方向の成分" color={L.text} size={10.5} anchor="middle" />
        <Lbl x={84} y={96} text="× 区間の長さ" color={L.text} size={10.5} anchor="middle" />
        <Lbl x={84} y={118} text="を足す [J]" color={L.dim} size={10} anchor="middle" />
      </Card>
      <Card x={166} y={34} w={140} h={92} color={L.focus} on={k === 1}>
        <Lbl x={236} y={54} text="面の和（磁束）" color={L.focus} size={11.5} anchor="middle" bold />
        <Lbl x={236} y={78} text="法線方向の成分" color={L.text} size={10.5} anchor="middle" />
        <Lbl x={236} y={96} text="× タイルの面積" color={L.text} size={10.5} anchor="middle" />
        <Lbl x={236} y={118} text="を足す [Wb]" color={L.dim} size={10} anchor="middle" />
      </Card>
      <Lbl x={160} y={26} text="掛けて足す、という骨組みは同じ" color={L.text} size={11.5} anchor="middle" />
      <Lbl x={160} y={150} text="道では各区間の仕事、面では各区画の磁束を足す" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="道では小区間の仕事を足した。面では小タイルの磁束を足す" />
    </LevelFig>
  );
}

export function TilesFlip() {
  const t = useT();
  const u = pingPong(t, 4);
  const dir = 1 - 2 * u;
  const blink = 0.45 + 0.35 * Math.sin(4 * t);
  return (
    <LevelFig label="法線を逆向きに取り直す">
      <StackTiles />
      <StackNormals flip={dir} />
      <StackField />
      <Lbl x={14} y={30} text="タイルも磁場も動かしていない" color={L.text} size={11.5} />
      <Lbl x={190} y={64} text="法線だけを" color={L.normal} size={10.5} />
      <Lbl x={190} y={80} text="反対向きに取り直す" color={L.normal} size={10.5} />
      <g opacity={blink}>
        <Lbl x={160} y={142} text="磁束の値には何が起きる？" color={L.minus} size={11.5} anchor="middle" />
      </g>
      <Cap text="動かしたのは向きの決め方だけ。値はどうなるか" />
    </LevelFig>
  );
}

export function TilesNegative() {
  const t = useT();
  const shown = Math.min(step(t, 5, 0.9), 4);
  const partial = -STACK_DPHI.slice(0, shown).reduce((a, b) => a + b, 0);
  return (
    <LevelFig label="法線を反転させると磁束の符号が反転する">
      <StackTiles upto={shown} active={shown - 1} color={L.minus} />
      <StackNormals flip={-1} />
      <StackField />
      {[0, 1, 2, 3].map(j => (
        <Lbl key={j} x={190} y={STACK.ys[j] + 4} text={j < shown ? `${fmt(-STACK_DPHI[j], 1)} Wb` : ''}
          color={L.minus} size={11} />
      ))}
      <Lbl x={14} y={30} text="磁場は法線と逆向きになった" color={L.text} size={11.5} />
      <Lbl x={160} y={140} text="大きさは同じ。符号だけが反転する" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={160} y={160} text={`合計 ${fmt(partial, 1)} Wb`} color={L.minus} size={13} anchor="middle" bold />
      <Cap text="符号は、面の向きをどう決めたかに紐づいている" />
    </LevelFig>
  );
}

export function TilesRefine16() {
  const t = useT();
  const fine = step(t, 2, 1.9) === 1;
  const n = fine ? 16 : 4;
  const rows = fine ? 16 : 4;
  const h = 96 / rows;
  return (
    <LevelFig label="タイルを16枚に増やしても同じ手順">
      {Array.from({ length: rows }, (_, j) => {
        const ex = -DEP[0], ey = -DEP[1];
        const cy = 44 + (j + 0.5) * h;
        const hx = (ex * STACK.la) / 2, hy = (ey * STACK.la) / 2, vy = h / 2;
        const cx = STACK.x;
        const pts: [number, number][] = [
          [cx - hx, cy - hy - vy], [cx + hx, cy + hy - vy],
          [cx + hx, cy + hy + vy], [cx - hx, cy - hy + vy],
        ];
        return <polygon key={j} points={pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}
          fill={L.focus} opacity={0.28} stroke={L.focus} strokeWidth={1} strokeOpacity={0.8} />;
      })}
      <Lbl x={14} y={30} text={`タイル ${n} 枚`} color={L.text} size={12} bold />
      <Lbl x={206} y={70} text="1枚ずつ" color={L.dim} size={10.5} />
      <Lbl x={206} y={88} text="成分 × 面積" color={L.dim} size={10.5} />
      <Lbl x={206} y={106} text="を符号のまま足す" color={L.focus} size={10.5} />
      <Lbl x={160} y={158} text="枚数が増えても、やることは変わらない" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="閉じた面では、外向きを正と決めることになる" />
    </LevelFig>
  );
}

// ==================================================================
// 7. ui-closed-bag — 袋の出入り
// ==================================================================

function blobPoint(cx: number, cy: number, rx: number, ry: number, k: number, a: number): [number, number] {
  const rr = 1 + 0.13 * Math.cos(3 * a + k) + 0.07 * Math.sin(2 * a + k);
  return [cx + rx * rr * Math.cos(a), cy + ry * rr * Math.sin(a)];
}
function blobNormal(cx: number, cy: number, rx: number, ry: number, k: number, a: number): [number, number] {
  const h = 0.02;
  const p1 = blobPoint(cx, cy, rx, ry, k, a - h);
  const p2 = blobPoint(cx, cy, rx, ry, k, a + h);
  let nx = p2[1] - p1[1], ny = -(p2[0] - p1[0]);
  const len = Math.hypot(nx, ny) || 1;
  nx /= len; ny /= len;
  const p = blobPoint(cx, cy, rx, ry, k, a);
  if (nx * (p[0] - cx) + ny * (p[1] - cy) < 0) { nx = -nx; ny = -ny; }
  return [nx, ny];
}
function blobPath(cx: number, cy: number, rx: number, ry: number, k: number): string {
  const n = 60;
  return Array.from({ length: n }, (_, i) => {
    const [x, y] = blobPoint(cx, cy, rx, ry, k, (i / n) * Math.PI * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

function Bag({ cx, cy, rx, ry, k, color = L.path }: {
  cx: number; cy: number; rx: number; ry: number; k: number; color?: string;
}) {
  return <polygon points={blobPath(cx, cy, rx, ry, k)} fill={color} opacity={0.12} stroke={color} strokeWidth={2.2} />;
}

export function BagNormal() {
  const t = useT();
  const n = 8;
  const k = step(t, n, 0.5);
  const cx = 158, cy = 90, rx = 70, ry = 34;
  return (
    <LevelFig label="閉じた面では法線を外向きに取る">
      <Bag cx={cx} cy={cy} rx={rx} ry={ry} k={0.6} />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const p = blobPoint(cx, cy, rx, ry, 0.6, a);
        const v = blobNormal(cx, cy, rx, ry, 0.6, a);
        return <Arw key={i} x={p[0]} y={p[1]} dx={v[0] * 20} dy={v[1] * 20} color={i === k ? L.focus : L.normal} w={i === k ? 2.8 : 1.8} head={7} />;
      })}
      <Lbl x={cx} y={cy + 4} text="内側" color={L.dim} size={11} anchor="middle" />
      <Lbl x={14} y={24} text="面を閉じると、内と外がはっきり分かれる" color={L.text} size={11} />
      <Lbl x={160} y={162} text="法線はいつも外向きに取る、と決める" color={L.normal} size={11} anchor="middle" />
      <Cap text="向きを一つに決めれば、符号の付け方が定まる" />
    </LevelFig>
  );
}

export function BagInOut() {
  const t = useT();
  const u = (t % 4) / 4;
  const cx = 160, cy = 92, rx = 68, ry = 46;
  const aIn = Math.PI * 0.95, aOut = Math.PI * 0.05;
  const pIn = blobPoint(cx, cy, rx, ry, 0.6, aIn);
  const pOut = blobPoint(cx, cy, rx, ry, 0.6, aOut);
  const nIn = blobNormal(cx, cy, rx, ry, 0.6, aIn);
  const nOut = blobNormal(cx, cy, rx, ry, 0.6, aOut);
  const travel = 30 + 200 * u;
  return (
    <LevelFig label="入る矢印は負、出る矢印は正">
      <Bag cx={cx} cy={cy} rx={rx} ry={ry} k={0.6} />
      <Arw x={travel} y={cy} dx={26} dy={0} color={L.field} w={2.4} head={7} />
      <Arw x={pIn[0] - nIn[0] * 26} y={pIn[1] - nIn[1] * 26} dx={nIn[0] * 26} dy={nIn[1] * 26} color={L.minus} w={2.6} head={7} />
      <Arw x={pOut[0]} y={pOut[1]} dx={nOut[0] * 24} dy={nOut[1] * 24} color={L.plus} w={2.6} head={7} />
      <Lbl x={14} y={24} text="外向き法線と比べて数え分ける" color={L.text} size={11.5} />
      <Lbl x={pIn[0] - 28} y={cy - 26} text="入る = 負" color={L.minus} size={11} anchor="middle" />
      <Lbl x={pOut[0] + 28} y={cy - 26} text="出る = 正" color={L.plus} size={11} anchor="middle" />
      <Lbl x={160} y={160} text="打ち消し合った残りが、閉じた面全体の電気束" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="外へ抜ければ正、外から入れば負として数える" />
    </LevelFig>
  );
}

/** 一様な電場を貫く直方体。外向き法線つき。中級・上級でも同じ絵を使う。 */
const BOXG = { ox: 88, oy: 128, w: 110, h: 70, d: 40 };
function bp3(a: number, b: number, c: number): [number, number] {
  return [BOXG.ox + a + DEP[0] * b, BOXG.oy + DEP[1] * b - c];
}
const BOX_CENTER: Record<string, [number, number]> = {
  left: bp3(0, BOXG.d / 2, BOXG.h / 2),
  right: bp3(BOXG.w, BOXG.d / 2, BOXG.h / 2),
  top: bp3(BOXG.w / 2, BOXG.d / 2, BOXG.h),
  bottom: bp3(BOXG.w / 2, BOXG.d / 2, 0),
  front: bp3(BOXG.w / 2, 0, BOXG.h / 2),
  back: bp3(BOXG.w / 2, BOXG.d, BOXG.h / 2),
};

function quad(pts: [number, number][]) {
  return pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
}

/** E は右向き一様。左面から入り（負）、右面から出る（正）。残り4面は平行で0。 */
function UniformBox({ inside = false }: { inside?: boolean }) {
  const { w, h, d } = BOXG;
  const front = quad([bp3(0, 0, 0), bp3(w, 0, 0), bp3(w, 0, h), bp3(0, 0, h)]);
  const top = quad([bp3(0, 0, h), bp3(w, 0, h), bp3(w, d, h), bp3(0, d, h)]);
  const side = quad([bp3(w, 0, 0), bp3(w, d, 0), bp3(w, d, h), bp3(w, 0, h)]);
  const rows = [62, 86, 110];
  return (
    <g>
      {rows.map(y => <Arw key={`l${y}`} x={14} y={y} dx={62} dy={0} color={L.field} w={2.2} head={7} />)}
      {rows.map(y => <Arw key={`r${y}`} x={226} y={y} dx={62} dy={0} color={L.field} w={2.2} head={7} />)}
      <polygon points={top} fill={L.path} opacity={0.12} stroke={L.path} strokeWidth={1.6} />
      <polygon points={side} fill={L.plus} opacity={inside ? 0.16 : 0.12} stroke={L.path} strokeWidth={1.6} />
      <polygon points={front} fill={inside ? L.field : L.path} opacity={inside ? 0.22 : 0.1} stroke={L.path} strokeWidth={2} />
      <Arw x={BOX_CENTER.left[0]} y={BOX_CENTER.left[1]} dx={-28} dy={0} color={L.minus} w={2.8} head={8} />
      <Arw x={BOX_CENTER.right[0]} y={BOX_CENTER.right[1]} dx={28} dy={0} color={L.plus} w={2.8} head={8} />
      <Arw x={BOX_CENTER.top[0]} y={BOX_CENTER.top[1]} dx={0} dy={-15} color={L.normal} w={1.8} head={6} />
      <Arw x={BOX_CENTER.bottom[0]} y={BOX_CENTER.bottom[1]} dx={0} dy={15} color={L.normal} w={1.8} head={6} />
      <Arw x={BOX_CENTER.front[0]} y={BOX_CENTER.front[1]} dx={-DEP[0] * 26} dy={-DEP[1] * 26} color={L.normal} w={1.8} head={6} />
      <Arw x={BOX_CENTER.back[0]} y={BOX_CENTER.back[1]} dx={DEP[0] * 26} dy={DEP[1] * 26} color={L.normal} w={1.8} head={6} />
    </g>
  );
}

export function BagUniformBox() {
  const t = useT();
  const k = step(t, 3, 1.2);
  return (
    <LevelFig label="一様な電場を貫く直方体">
      <UniformBox />
      <Lbl x={14} y={24} text="E = 3 N/C、面の面積 2 m²" color={L.text} size={11} />
      <Lbl x={14} y={146} text="入る面 −6" color={L.minus} size={10.5} />
      <Lbl x={160} y={146} text="残り4面は平行で 0" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={306} y={146} text="出る面 +6" color={L.plus} size={10.5} anchor="end" />
      <Lbl x={160} y={163} text={k >= 1 ? (k >= 2 ? '(−6) + 6 + 0 + 0 + 0 + 0 = 0' : '(−6) + 6 + 0 + 0 + 0 + 0') : ''}
        color={k >= 2 ? L.focus : L.text} size={12} anchor="middle" bold={k >= 2} />
      <Cap text="入る面は負、出る面は正。合計はちょうど 0 になる" />
    </LevelFig>
  );
}

export function BagZeroQuestion() {
  const t = useT();
  const blink = 0.4 + 0.4 * Math.sin(3.4 * t);
  return (
    <LevelFig label="合計がゼロなら中に電場はないのか">
      <UniformBox />
      <Lbl x={14} y={24} text="出入りを足したら 0 になった" color={L.text} size={11.5} />
      <Lbl x={14} y={146} text="−6" color={L.minus} size={11} />
      <Lbl x={306} y={146} text="+6" color={L.plus} size={11} anchor="end" />
      <g opacity={blink}>
        <Lbl x={160} y={146} text="では、箱の中に電場はないのか？" color={L.minus} size={11} anchor="middle" />
        <Lbl x={160} y={163} text="合計 0 は、何について語っているのか" color={L.minus} size={11} anchor="middle" />
      </g>
      <Cap text="合計が 0 という事実だけから、何が言えるのだろうか" />
    </LevelFig>
  );
}

export function BagZeroAnswer() {
  const t = useT();
  const u = (t % 3) / 3;
  return (
    <LevelFig label="合計ゼロでも場はゼロではない">
      <UniformBox inside />
      <Arw x={100 + 70 * u} y={86} dx={26} dy={0} color={L.focus} w={3} head={8} />
      <Lbl x={14} y={24} text="箱の中でも、電場は 3 N/C のままある" color={L.text} size={11} />
      <Lbl x={160} y={146} text="合計 0 = 入った分だけ出ていった" color={L.focus} size={11} anchor="middle" />
      <Lbl x={160} y={163} text="語っているのは出入りの差で、場の有無ではない" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="閉じた面の合計が 0 でも、中の場が 0 とは限らない" />
    </LevelFig>
  );
}

function RadialBag({ sign, cx = 160, cy = 90, rx = 68, ry = 38, k = 0.6, n = 10, active = -1 }: {
  sign: number; cx?: number; cy?: number; rx?: number; ry?: number; k?: number; n?: number; active?: number;
}) {
  return (
    <g>
      <Bag cx={cx} cy={cy} rx={rx} ry={ry} k={k} />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const p = blobPoint(cx, cy, rx, ry, k, a);
        const v = blobNormal(cx, cy, rx, ry, k, a);
        const color = sign > 0 ? L.plus : L.minus;
        const on = i === active;
        return sign > 0
          ? <Arw key={i} x={p[0] - v[0] * 14} y={p[1] - v[1] * 14} dx={v[0] * 30} dy={v[1] * 30} color={color} w={on ? 3.2 : 2.2} head={7} />
          : <Arw key={i} x={p[0] + v[0] * 18} y={p[1] + v[1] * 18} dx={-v[0] * 30} dy={-v[1] * 30} color={color} w={on ? 3.2 : 2.2} head={7} />;
      })}
      <Charge x={cx} y={cy} sign={sign} r={12} />
    </g>
  );
}

export function BagWithCharge() {
  const t = useT();
  const k = step(t, 10, 0.4);
  return (
    <LevelFig label="袋の中に正の電荷を入れる">
      <RadialBag sign={1} active={k} />
      <Lbl x={14} y={24} text="中に正の電荷を1個入れる" color={L.text} size={11.5} />
      <Lbl x={160} y={158} text="出ていく分が増える → 正味の量は正" color={L.plus} size={11} anchor="middle" />
      <Cap text="電荷から出た矢印が、袋をすべて外向きに突き抜ける" />
    </LevelFig>
  );
}

export function BagNegativeCharge() {
  const t = useT();
  const k = step(t, 10, 0.4);
  return (
    <LevelFig label="袋の中に負の電荷を入れる">
      <RadialBag sign={-1} active={k} k={1.4} />
      <Lbl x={14} y={24} text="中に負の電荷を1個入れる" color={L.text} size={11.5} />
      <Lbl x={160} y={158} text="入ってくる分が増える → 正味の量は負" color={L.minus} size={11} anchor="middle" />
      <Cap text="符号が、中の電荷の符号をそのまま映している" />
    </LevelFig>
  );
}

export function BagShape() {
  const t = useT();
  const which = step(t, 2, 1.9);
  const cx = 160, cy = 88;
  const boxPts = '96,48 224,44 228,128 92,132';
  return (
    <LevelFig label="袋の形を変えても正味の量は同じ">
      {which === 0
        ? <Bag cx={cx} cy={cy} rx={64} ry={44} k={0} color={L.focus} />
        : <polygon points={boxPts} fill={L.focus} opacity={0.12} stroke={L.focus} strokeWidth={2.2} />}
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const ux = Math.cos(a), uy = Math.sin(a);
        return <Arw key={i} x={cx + ux * 26} y={cy + uy * 20} dx={ux * 34} dy={uy * 26} color={L.plus} w={2.2} head={7} />;
      })}
      <Charge x={cx} y={cy} sign={1} r={12} />
      <Lbl x={14} y={24} text={which === 0 ? '丸い袋で囲む' : '角ばった袋で囲む'} color={L.text} size={11.5} />
      <Lbl x={160} y={158} text="どちらでも、正味の量は同じ" color={L.focus} size={11.5} anchor="middle" bold />
      <Cap text="袋を取り替えても、中に入っている電荷は変わらない" />
    </LevelFig>
  );
}

export function BagSummary() {
  const t = useT();
  const k = step(t, 2, 1.7);
  return (
    <LevelFig label="閉じた面の合計が教えること">
      <Card x={16} y={32} w={288} h={46} color={L.plus} on={k === 0}>
        <Lbl x={30} y={52} text="面全体の電気束から分かること" color={L.plus} size={11.5} />
        <Lbl x={30} y={70} text="中にある電荷の、正味の符号と量" color={L.text} size={11} />
      </Card>
      <Card x={16} y={88} w={288} h={60} color={L.minus} on={k === 1}>
        <Lbl x={30} y={108} text="教えてくれないこと" color={L.minus} size={11.5} />
        <Lbl x={30} y={126} text="場の強さ、中のどこに電荷があるか" color={L.text} size={11} />
        <Lbl x={30} y={143} text="合計 0 でも、中の場は 0 とは限らない" color={L.dim} size={10} />
      </Card>
      <Cap text="正味の量から読めるのは、中の電荷の合計だけ" />
    </LevelFig>
  );
}

// ==================================================================
// 8. ui-charge-and-flux-preview — 中心の電荷と球面
// ==================================================================

function SphereShell({ cx, cy, r, color = L.path }: { cx: number; cy: number; r: number; color?: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.1} stroke={color} strokeWidth={2.2} />
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.32} fill="none" stroke={color} strokeWidth={1} opacity={0.4} strokeDasharray="4 3" />
    </g>
  );
}

function RadialCross({ cx, cy, r, n, sign, len, active = -1, width = 2.2 }: {
  cx: number; cy: number; r: number; n: number; sign: number; len: number; active?: number; width?: number;
}) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const ux = Math.cos(a), uy = Math.sin(a);
        const color = sign > 0 ? L.plus : L.minus;
        const on = i === active;
        const start = sign > 0 ? r - len / 2 : r + len / 2;
        const d = sign > 0 ? len : -len;
        return <Arw key={i} x={cx + ux * start} y={cy + uy * start} dx={ux * d} dy={uy * d}
          color={color} w={on ? width + 1.2 : width} head={7} />;
      })}
    </g>
  );
}

export function SphereIntro() {
  const t = useT();
  const k = step(t, 8, 0.5);
  const cx = 160, cy = 90, r = 58;
  return (
    <LevelFig label="球面で囲み、外向きを正と決める">
      <SphereShell cx={cx} cy={cy} r={r} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const ux = Math.cos(a), uy = Math.sin(a);
        return <Arw key={i} x={cx + ux * r} y={cy + uy * r} dx={ux * 20} dy={uy * 20}
          color={i === k ? L.focus : L.normal} w={i === k ? 2.8 : 1.8} head={7} />;
      })}
      <Charge x={cx} y={cy} sign={1} r={12} />
      <Lbl x={14} y={24} text="中心に電荷、まわりを球面で囲む" color={L.text} size={11.5} />
      <Lbl x={160} y={162} text="閉じた面なので、法線は外向きに取る" color={L.normal} size={11} anchor="middle" />
      <Cap text="数えるのは、この球面を出入りする正味の量" />
    </LevelFig>
  );
}

export function SphereOne() {
  const t = useT();
  const k = step(t, 8, 0.45);
  const cx = 160, cy = 90, r = 56;
  return (
    <LevelFig label="中心の正電荷から矢印が出ていく">
      <SphereShell cx={cx} cy={cy} r={r} />
      <RadialCross cx={cx} cy={cy} r={r} n={8} sign={1} len={30} active={k} />
      <Charge x={cx} y={cy} sign={1} r={12} />
      <Lbl x={14} y={24} text="どこでも外へ抜ける。入る寄与は 0" color={L.text} size={11.5} />
      <Lbl x={22} y={154} text={`図で示した矢印の本数 ${k + 1} / 8`} color={L.dim} size={10.5} />
      <Lbl x={298} y={154} text="正味 +8" color={L.plus} size={12.5} anchor="end" bold />
      <Cap text="出る寄与を正と数えるので、正味の量は正になる" />
    </LevelFig>
  );
}

export function SphereDouble() {
  const t = useT();
  const which = step(t, 2, 1.8);
  const cx = 160, cy = 90, r = 56;
  const n = which === 0 ? 8 : 16;
  return (
    <LevelFig label="電荷を2倍にすると出ていく量も2倍">
      <SphereShell cx={cx} cy={cy} r={r} />
      <RadialCross cx={cx} cy={cy} r={r} n={n} sign={1} len={28} width={which === 0 ? 2.2 : 2.6} />
      <Charge x={cx} y={cy} sign={1} r={which === 0 ? 12 : 15} />
      <Lbl x={14} y={24} text={which === 0 ? '電荷 Q: 各点の電場はもとのまま' : '電荷 2Q: 各点の電場が 2 倍'} color={L.text} size={11} />
      <Lbl x={22} y={154} text={which === 0 ? '正味 +8' : '正味 +16'} color={L.plus} size={12.5} bold />
      <Lbl x={298} y={154} text="面は変えていない" color={L.dim} size={10.5} anchor="end" />
      <Cap text="中の電荷に比例して、正味の量が増えている" />
    </LevelFig>
  );
}

export function SphereNegative() {
  const t = useT();
  const k = step(t, 8, 0.45);
  const cx = 160, cy = 90, r = 56;
  return (
    <LevelFig label="負の電荷では矢印が内向きになる">
      <SphereShell cx={cx} cy={cy} r={r} />
      <RadialCross cx={cx} cy={cy} r={r} n={8} sign={-1} len={30} active={k} />
      <Charge x={cx} y={cy} sign={-1} r={12} />
      <Lbl x={14} y={24} text="すべて外から内へ通り抜ける" color={L.text} size={11.5} />
      <Lbl x={22} y={154} text={`図で示した矢印の本数 ${k + 1} / 8`} color={L.dim} size={10.5} />
      <Lbl x={298} y={154} text="正味 −8" color={L.minus} size={12.5} anchor="end" bold />
      <Cap text="入る寄与は負。符号が中の電荷の符号を映している" />
    </LevelFig>
  );
}

export function SphereBigger() {
  const t = useT();
  const which = step(t, 2, 1.9);
  const cx = 154, cy = 88;
  const r = which === 0 ? 34 : 68;
  const len = which === 0 ? 26 : 13;
  const blink = 0.45 + 0.35 * Math.sin(4 * t);
  return (
    <LevelFig label="球の半径を2倍にすると矢印は短くなる">
      <SphereShell cx={cx} cy={cy} r={68} color={L.dim} />
      <SphereShell cx={cx} cy={cy} r={r} />
      <RadialCross cx={cx} cy={cy} r={r} n={8} sign={1} len={len} width={2.2} />
      <Charge x={cx} y={cy} sign={1} r={11} />
      <Lbl x={14} y={24} text={which === 0 ? '半径 r' : '半径 2r: 矢印が短い'} color={L.text} size={11.5} />
      <g opacity={blink}>
        <Lbl x={160} y={162} text="遠いほど電場は弱い。合計も減ってしまう？" color={L.minus} size={11} anchor="middle" />
      </g>
      <Cap text="矢印は短くなった。では正味の量はどうなるのだろう" />
    </LevelFig>
  );
}

export function SphereBalance() {
  const t = useT();
  const k = step(t, 3, 1.3);
  const rows = [
    { left: '電場 E', right: '4 分の 1 に弱まる', color: L.field },
    { left: '球の面積 A', right: '4 倍に広がる', color: L.focus },
    { left: '積 E × A', right: '変わらない', color: L.plus },
  ];
  return (
    <LevelFig label="弱くなる電場と広がる面積が釣り合う">
      <Lbl x={14} y={26} text="半径を 2 倍にしたとき" color={L.text} size={11.5} />
      {rows.map((row, i) => (
        <Card key={row.left} x={22} y={40 + i * 36} w={276} h={28} color={row.color} on={i <= k}>
          <Lbl x={36} y={59 + i * 36} text={row.left} color={L.text} size={11.5} />
          <Lbl x={286} y={59 + i * 36} text={row.right} color={row.color} size={11.5} anchor="end" bold={i === 2} />
        </Card>
      ))}
      <Lbl x={160} y={160} text="4 分の 1 と 4 倍が打ち消し合う" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="同心球の半径を変えても電気束は同じ" />
    </LevelFig>
  );
}

function rayCircle(q: [number, number], u: [number, number], o: [number, number], R: number): [number, number] | null {
  const dx = q[0] - o[0], dy = q[1] - o[1];
  const b = 2 * (u[0] * dx + u[1] * dy);
  const c = dx * dx + dy * dy - R * R;
  const disc = b * b - 4 * c;
  if (!(disc > 0)) return null;
  const s = Math.sqrt(disc);
  const t1 = (-b - s) / 2, t2 = (-b + s) / 2;
  if (!(t1 > 0)) return null;
  return [t1, t2];
}

export function SphereOutside() {
  const t = useT();
  const u = (t % 3) / 3;
  const Q: [number, number] = [34, 92];
  const O: [number, number] = [196, 90];
  const R = 52;
  const angles = [-14, -5, 4, 13];
  return (
    <LevelFig label="外の電荷が作る矢印は入って出ていく">
      <SphereShell cx={O[0]} cy={O[1]} r={R} />
      {angles.map(deg => {
        const a = (deg * Math.PI) / 180;
        const dir: [number, number] = [Math.cos(a), Math.sin(a)];
        const hit = rayCircle(Q, dir, O, R);
        if (!hit) return null;
        const [t1, t2] = hit;
        const pIn: [number, number] = [Q[0] + dir[0] * t1, Q[1] + dir[1] * t1];
        const pOut: [number, number] = [Q[0] + dir[0] * t2, Q[1] + dir[1] * t2];
        const head = t1 + (t2 - t1 + 60) * u;
        return (
          <g key={deg}>
            <line x1={Q[0] + dir[0] * 14} y1={Q[1] + dir[1] * 14} x2={Q[0] + dir[0] * (t2 + 52)} y2={Q[1] + dir[1] * (t2 + 52)}
              stroke={L.field} strokeWidth={1.4} opacity={0.45} />
            <Arw x={Q[0] + dir[0] * head} y={Q[1] + dir[1] * head} dx={dir[0] * 16} dy={dir[1] * 16} color={L.field} w={2} head={6.5} />
            <circle cx={pIn[0]} cy={pIn[1]} r={4} fill={L.minus} />
            <circle cx={pOut[0]} cy={pOut[1]} r={4} fill={L.plus} />
          </g>
        );
      })}
      <Charge x={Q[0]} y={Q[1]} sign={1} r={11} />
      <Lbl x={14} y={24} text="電荷は球の外。矢印は入って、また出る" color={L.text} size={11} />
      <Lbl x={70} y={158} text="● 入る = 負" color={L.minus} size={10.5} />
      <Lbl x={170} y={158} text="● 出る = 正" color={L.plus} size={10.5} />
      <Lbl x={306} y={158} text="正味 0" color={L.focus} size={11.5} anchor="end" bold />
      <Cap text="入った分がそのまま出ていく。外部電荷による電気束の合計は0" />
    </LevelFig>
  );
}

export function SphereLinesCaution() {
  const t = useT();
  const which = step(t, 2, 1.9);
  const cx = 96, cy = 88;
  const n = which === 0 ? 8 : 16;
  return (
    <LevelFig label="本数は数えるための比喩">
      <circle cx={cx} cy={cy} r={48} fill={L.path} opacity={0.08} stroke={L.path} strokeWidth={1.8} />
      <RadialCross cx={cx} cy={cy} r={48} n={n} sign={1} len={22} width={1.8} />
      <Charge x={cx} y={cy} sign={1} r={11} />
      <Lbl x={cx} y={152} text={`線を ${n} 本引いた絵`} color={L.dim} size={10.5} anchor="middle" />
      <Card x={186} y={44} w={122} h={80} color={L.minus}>
        <Lbl x={247} y={66} text="線の数は" color={L.text} size={11} anchor="middle" />
        <Lbl x={247} y={84} text="人が決めた目印" color={L.minus} size={11} anchor="middle" />
        <Lbl x={247} y={106} text="値は変わらない" color={L.dim} size={10} anchor="middle" />
      </Card>
      <Lbl x={14} y={24} text="何本で描いても、磁束や電気束の値は同じ" color={L.text} size={11} />
      <Cap text="電気束は電場と面から計算する量。ひもを数えてはいない" />
    </LevelFig>
  );
}

export function SphereGaussPreview() {
  const t = useT();
  const k = step(t, 3, 1.3);
  const rows = [
    { tag: 'いまできればよいこと', body: '出入りを符号つきで数える', color: L.plus },
    { tag: '後で増えるもの', body: '細かく分ける・任意の閉曲面', color: L.path },
    { tag: '上級編で扱う法則', body: 'ガウスの法則（閉曲面の積分）', color: L.focus },
  ];
  return (
    <LevelFig label="上級編への対応表">
      {rows.map((row, i) => (
        <Card key={row.tag} x={18} y={30 + i * 40} w={284} h={32} color={row.color} on={i <= k}>
          <Lbl x={32} y={44 + i * 40} text={row.tag} color={L.dim} size={9.5} />
          <Lbl x={32} y={58 + i * 40} text={row.body} color={row.color} size={11.5} bold={i === 2} />
        </Card>
      ))}
      <Lbl x={160} y={162} text="閉じた面を出る正味の量は、中の電荷で決まる" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="いまは数えられれば十分。式は上級編で組み立てる" />
    </LevelFig>
  );
}

// ==================================================================

export const ui_emFigures: Record<string, () => JSX.Element> = {
  // 1. ui-field-map
  'uie-map-grid': MapGrid,
  'uie-map-strength': MapStrength,
  'uie-map-testcharge': MapTestCharge,
  'uie-map-force': MapForce,
  'uie-map-negative': MapNegative,
  'uie-map-point-charge': MapPointCharge,
  'uie-map-magnet': MapMagnet,
  'uie-map-path-preview': MapPathPreview,
  'uie-map-summary': MapSummary,
  // 2. ui-work-direction
  'uie-dir-scene': DirScene,
  'uie-dir-question': DirQuestion,
  'uie-dir-split': DirSplit,
  'uie-dir-component': DirComponent,
  'uie-dir-perp': DirPerp,
  'uie-dir-work': DirWork,
  'uie-dir-units': DirUnits,
  'uie-dir-summary': DirSummary,
  // 3. ui-work-bent-path
  'uie-bent-scene': BentScene,
  'uie-bent-question': BentQuestion,
  'uie-bent-directions': BentDirections,
  'uie-bent-seg1': BentSeg1,
  'uie-bent-seg2': BentSeg2,
  'uie-bent-seg3': BentSeg3,
  'uie-bent-total': BentTotal,
  'uie-bent-reverse': BentReverse,
  'uie-bent-refine': BentRefine,
  'uie-bent-summary': BentSummary,
  // 4. ui-electric-work-path
  'uie-path-recall': PathRecall,
  'uie-path-curve': PathCurveQuestion,
  'uie-path-split': PathSplit,
  'uie-path-seg1': PathSeg1,
  'uie-path-seg2': PathSeg2,
  'uie-path-seg3': PathSeg3,
  'uie-path-seg4': PathSeg4,
  'uie-path-total': PathTotal,
  'uie-path-refine': PathRefine,
  // 5. ui-flux-one-tile
  'uie-tile-intro': TileIntro,
  'uie-tile-normal': TileNormal,
  'uie-tile-perp': TilePerp,
  'uie-tile-parallel': TileParallel,
  'uie-tile-tilt': TileTilt,
  'uie-tile-projected': TileProjected,
  'uie-tile-slider': TileSlider,
  'uie-tile-lines-caution': TileLinesCaution,
  'uie-tile-summary': TileSummary,
  // 6. ui-flux-many-tiles
  'uie-tiles-one': TilesOne,
  'uie-tiles-grid4': TilesGrid4,
  'uie-tiles-cell1': TilesCell1,
  'uie-tiles-cell2': TilesCell2,
  'uie-tiles-weak': TilesWeak,
  'uie-tiles-cell3': TilesCell3,
  'uie-tiles-cell4': TilesCell4,
  'uie-tiles-total': TilesTotal,
  'uie-tiles-analogy': TilesAnalogy,
  'uie-tiles-flip': TilesFlip,
  'uie-tiles-negative': TilesNegative,
  'uie-tiles-refine16': TilesRefine16,
  // 7. ui-closed-bag
  'uie-bag-normal': BagNormal,
  'uie-bag-inout': BagInOut,
  'uie-bag-uniform-box': BagUniformBox,
  'uie-bag-zero-question': BagZeroQuestion,
  'uie-bag-zero-answer': BagZeroAnswer,
  'uie-bag-with-charge': BagWithCharge,
  'uie-bag-negative-charge': BagNegativeCharge,
  'uie-bag-shape': BagShape,
  'uie-bag-summary': BagSummary,
  // 8. ui-charge-and-flux-preview
  'uie-sphere-intro': SphereIntro,
  'uie-sphere-one': SphereOne,
  'uie-sphere-double': SphereDouble,
  'uie-sphere-negative': SphereNegative,
  'uie-sphere-bigger': SphereBigger,
  'uie-sphere-balance': SphereBalance,
  'uie-sphere-outside': SphereOutside,
  'uie-sphere-lines-caution': SphereLinesCaution,
  'uie-sphere-gauss-preview': SphereGaussPreview,
};

export const ui_emReadings: Record<string, string> = {
  'uie-map-grid': 'どの点にも矢印が1本ずつ描かれています。金色の丸が動いて1点ずつ選ぶので、点を決めれば向きと長さが決まることを確かめてください。',
  'uie-map-strength': '3つの点で矢印の長さが違います。長い矢印ほど電場が強く、その点で1 Cが受ける力が大きいことを表します。',
  'uie-map-testcharge': '上の水色の矢印は電場、下の黄緑の矢印は力です。電荷が +1 Cと +2 Cで切り替わるとき、どちらが変わるかを見てください。',
  'uie-map-force': '水色の電場の矢印と、その2倍の長さの黄緑の力の矢印を見比べてください。掛け算の結果が矢印の長さに出ています。',
  'uie-map-negative': '力の矢印だけが左を向いています。長さは同じで、向きだけが裏返っていることを確かめてください。',
  'uie-map-point-charge': '中心の電荷の符号が切り替わります。矢印の向きが外向きから内向きへ変わること、遠い輪ほど矢印が短いことを見てください。',
  'uie-map-magnet': '磁石のまわりの曲線は、矢印をつないだ目印です。線そのものが物ではないこと、矢印がN極側から出ていることを見てください。',
  'uie-map-path-preview': '黄色い道と、金色の面が交互に強調されます。道の上では矢印を足し、面では貫いた量を数える、という2つの使い方があります。',
  'uie-map-summary': '上の札から2つの札へ枝分かれします。道の足し算が仕事、面の足し算が束という対応を確かめてください。',
  'uie-dir-scene': '黄色い目盛りが移動した 2 m、水色の矢印が 10 N の力です。力の矢印だけが斜めを向いていることを見てください。',
  'uie-dir-question': '箱が進んだ向きを示す黄色い矢印は右だけです。斜めの 10 N をそのまま掛けてよいか、という問いの図です。',
  'uie-dir-split': '点線の長方形が、斜めの矢印を右向きと上向きの2本に分けています。合成すると元の矢印に戻ることを確かめてください。',
  'uie-dir-component': '太い黄緑の矢印が右向きの成分です。斜めの矢印のちょうど半分の長さになっていることを見てください。',
  'uie-dir-perp': '金色の矢印が上向きの成分です。箱は右へしか動いておらず、この向きには進んでいないことを確かめてください。',
  'uie-dir-work': '掛けているのは黄緑の 5 N と黄色い 2 m だけです。斜めの矢印は使っていないことを見てください。',
  'uie-dir-units': '単位が上から順に掛けられていきます。N と m を掛けると N·m になり、それが J になる並びを追ってください。',
  'uie-dir-summary': '上の紫の札が誤り、下の黄緑の札が正しい計算です。同じ力・同じ距離でも答えが違うことを見比べてください。',
  'uie-bent-scene': '黄色い折れ線が道で、金色の丸が進んでいきます。右、上、左と進む向きが2回変わることを見てください。',
  'uie-bent-question': '水色の矢印が力です。道全体でひとつの「前」を選べないことを確かめてください。',
  'uie-bent-directions': '区間ごとに矢印が順に光ります。前1が右、前2が上、前3が左を向いていることを見てください。',
  'uie-bent-seg1': '水色が力、点線が道への投影、太い黄緑が前向きの成分です。前が右なので、右向きの長さだけを取っています。',
  'uie-bent-seg2': '前が上に変わりました。黄緑の投影の矢印も上を向いていることを確かめてください。',
  'uie-bent-seg3': '前が左に変わりました。黄緑の投影の矢印が左を向いていることを確かめてください。',
  'uie-bent-total': '区間が1本ずつ色づき、右の合計が 3、5、7 と積み上がります。足しているのが区間の寄与であることを見てください。',
  'uie-bent-reverse': '矢印の向きが往復で入れ替わります。逆向きのときに各区間の値が負になることを確かめてください。',
  'uie-bent-refine': '折れ線の辺が3、6、12と増えます。金色の折れ線が黄色い曲線に重なっていく様子を見てください。',
  'uie-bent-summary': '3つの手順が上から順に光ります。最後の段で「前向き成分 × 長さ を足す」と書かれていることを確かめてください。',
  'uie-path-recall': 'まっすぐな黄色い道の上を、金色の矢印が伸びていきます。道方向の成分と長さを掛けているだけです。',
  'uie-path-curve': '曲線の上の4か所に、それぞれ違う向きの電場の矢印があります。道との角度が場所ごとに違うことを見てください。',
  'uie-path-split': '曲線に4本の矢印が重ねてあります。矢印の向きが進む向き、長さが区間の長さ（1 m、2 m、1 m、1 m）です。',
  'uie-path-seg1': '水色が電場、点線が道への投影、太い黄緑が道方向の成分です。傾いた矢印のうち、どれだけが効くかを見てください。',
  'uie-path-seg2': '電場の矢印は短いのに、区間の矢印が長くなっています。成分と長さのどちらが効いているかを見てください。',
  'uie-path-seg3': '電場の矢印が区間の矢印と直角に交わっています。道方向に伸びる投影の矢印がないことを確かめてください。',
  'uie-path-seg4': '電場の矢印が区間の矢印と正反対を向いています。紫の投影が進む向きの逆に伸びていることを見てください。',
  'uie-path-total': '区間が1本ずつ色づき、右の合計が積み上がります。紫の区間で合計が減ることを確かめてください。',
  'uie-path-refine': '区間の本数が4、8、16、32と増えます。折れ線が黄色い曲線に重なっていく様子を見てください。',
  'uie-tile-intro': '水色の矢印が磁場、金色の板がタイルです。数えたいのが板を通り抜けた量であることを確かめてください。',
  'uie-tile-normal': '白い矢印が法線です。表側と裏側の2つの向きが交互に光るので、どちらかを正と決める必要があることを見てください。',
  'uie-tile-perp': '磁場の矢印と白い法線が同じ向きです。このとき磁束が最大になり、値が 1 Wb になります。',
  'uie-tile-parallel': '磁場の矢印がタイルの横をすり抜けていきます。面積があるのに通り抜けた量が 0 であることを見てください。',
  'uie-tile-tilt': '点線が正面を向けたときのタイル、実線が傾けたタイルです。白い法線の向きが磁場からずれていくのを見てください。',
  'uie-tile-projected': '右の点線の枠が元の面積、金色の部分が正面から見た面積です。0.5 m² より小さくなっていることを確かめてください。',
  'uie-tile-slider': 'スライダーで法線と磁場の角度を変えられます。右の金色のバーの長さが磁束で、なめらかに変わることを見てください。',
  'uie-tile-lines-caution': '水平の線は磁場を見せるために引いた目印です。線の本数を増減させても値そのものは変わらないことを見てください。',
  'uie-tile-summary': '垂直・斜め・平行の3枚が順に光ります。法線と磁場の角度によって値が 1、約 0.71、0 と変わることを見てください。',
  'uie-tiles-one': '磁場に垂直な1枚のタイルです。白い法線と磁場が同じ向きで、寄与が 1 Wb になることを確かめてください。',
  'uie-tiles-grid4': '4枚のタイルが縦に並び、白い法線が立っています。左から届く磁場の矢印の長さがタイルごとに違うことを見てください。',
  'uie-tiles-cell1': '1枚目のタイルだけが金色に光っています。法線方向の磁場 2 T と面積 0.5 m² を掛けていることを確かめてください。',
  'uie-tiles-cell2': '2枚目のタイルが光ります。1枚目とまったく同じ形の掛け算になっていることを見てください。',
  'uie-tiles-weak': '下の2枚のタイルでは、届く磁場の矢印が短いか、面に沿っています。掛ける数字が変わることを見てください。',
  'uie-tiles-cell3': '3枚目のタイルでは磁場の矢印が半分の長さです。掛け算の形は変わらず、数字だけが変わります。',
  'uie-tiles-cell4': '4枚目では磁場がタイルの面に沿って描かれています。法線方向の成分がないことを確かめてください。',
  'uie-tiles-total': 'タイルが1枚ずつ色づき、合計が 1、2、2.5、2.5 と積み上がります。0 の寄与も足していることを見てください。',
  'uie-tiles-analogy': '左が道の和、右が面の和の札です。成分に小片を掛けて足す、という同じ骨組みになっていることを見比べてください。',
  'uie-tiles-flip': '白い法線だけが向きを変えます。タイルも磁場も動いていないことを確かめてください。',
  'uie-tiles-negative': '法線が磁場と逆を向いています。各タイルの値と合計が負の側へ積み上がることを見てください。',
  'uie-tiles-refine16': 'タイルが4枚と16枚で切り替わります。枚数が変わっても手順が同じであることを確かめてください。',
  'uie-bag-normal': '袋のふちに立った白い矢印が、すべて外を向いています。内と外がはっきり分かれていることを見てください。',
  'uie-bag-inout': '紫が入る側、黄緑が出る側の矢印です。外向き法線と同じ側か逆かで符号が決まります。',
  'uie-bag-uniform-box': '左の面の紫が −6、右の面の黄緑が +6、上下の白い法線の面は 0 です。足すと 0 になることを確かめてください。',
  'uie-bag-zero-question': '出入りの値が −6 と +6 で打ち消し合っています。合計が 0 だという事実だけが分かっている状態です。',
  'uie-bag-zero-answer': '箱の内側にも水色の背景と金色の矢印があります。中の電場が 0 ではないことを確かめてください。',
  'uie-bag-with-charge': '中心の正電荷から出た矢印が、袋のふちをすべて外向きに横切っています。入る矢印がないことを見てください。',
  'uie-bag-negative-charge': '矢印が外から内へ向かって袋を横切っています。入る寄与を負と数えることを思い出してください。',
  'uie-bag-shape': '丸い袋と角ばった袋が入れ替わります。中の電荷と矢印は変わっていないことを確かめてください。',
  'uie-bag-summary': '上の札が読めること、下の札が読めないことです。合計 0 と場が 0 の違いに注目してください。',
  'uie-sphere-intro': '球面のふちに立った白い矢印が、すべて外を向いています。閉じた面では外向きを正と決めます。',
  'uie-sphere-one': '矢印が球面を内から外へ横切っています。1本ずつ数える様子と、右下の正味の値を見てください。',
  'uie-sphere-double': '電荷の大きさと矢印の本数が切り替わります。面は変えていないのに正味の量が2倍になることを見てください。',
  'uie-sphere-negative': '矢印が外から内へ向かって球面を横切っています。正味の値が負になることを確かめてください。',
  'uie-sphere-bigger': '球の半径が切り替わり、矢印の長さが変わります。大きい球では矢印が短いことを見てください。',
  'uie-sphere-balance': '3行の札が順に光ります。4分の1と4倍が掛け合わさって元に戻ることを確かめてください。',
  'uie-sphere-outside': '左の電荷から出た線が球を横切ります。紫の点が入る場所、黄緑の点が出る場所で、数が同じことを見てください。',
  'uie-sphere-lines-caution': '線の本数が8本と16本で切り替わります。絵の見た目が変わっても値は変わらないことを確かめてください。',
  'uie-sphere-gauss-preview': '3枚の札が、いまできること・後で増えるもの・上級編で扱う法則の順に並んでいます。対応を確かめてください。',
};
