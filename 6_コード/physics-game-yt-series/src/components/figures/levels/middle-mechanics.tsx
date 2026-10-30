import { Arw, Axes, Bar, Cap, Curve, FigSlider, L, Lbl, LevelFig, mapper, pingPong, step, useManual, useT, fmt } from './base';

/** 力学・中級（変化する運動を式で追う）の図解。
 * 色の約束は base.tsx のとおり。経路は L.path、力の矢印は L.field、
 * いま見ている小区間は L.focus、正の寄与は L.plus、負の寄与は L.minus。
 * キャンバスは 320×190。y >= 164 にはラベルを置かない。 */

// ===== 共通の小物 =====

function Floor({ y = 132, x0 = 16, x1 = 304 }: { y?: number; x0?: number; x1?: number }) {
  return <line x1={x0} y1={y} x2={x1} y2={y} stroke={L.dim} strokeWidth={2} />;
}

function Box({ x, y, w = 34, h = 24, color = L.field, opacity = 0.9 }: {
  x: number; y: number; w?: number; h?: number; color?: string; opacity?: number;
}) {
  return <rect x={x} y={y} width={w} height={h} rx={5} fill={color} opacity={opacity} />;
}

/** 角の丸い札。手順や前提を並べるのに使う。 */
function Card({ x, y, w, h, color, active, text, size = 11.5 }: {
  x: number; y: number; w: number; h: number; color: string; active?: boolean; text: string; size?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={color} opacity={active ? 0.3 : 0.12}
        stroke={color} strokeWidth={active ? 1.6 : 0.8} />
      <Lbl x={x + 10} y={y + h / 2 + 4} text={text} color={active ? L.text : L.dim} size={size} />
    </g>
  );
}

/** ばねの折れ線。x0 が固定端、x1 が自由端。 */
function Spring({ x0, x1, y, coils = 8, color = L.field }: {
  x0: number; x1: number; y: number; coils?: number; color?: string;
}) {
  const span = x1 - x0;
  const pts: string[] = [`${x0.toFixed(1)},${y}`];
  for (let i = 0; i < coils; i++) {
    pts.push(`${(x0 + (span * (i + 0.25)) / coils).toFixed(1)},${y - 9}`);
    pts.push(`${(x0 + (span * (i + 0.75)) / coils).toFixed(1)},${y + 9}`);
  }
  pts.push(`${x1.toFixed(1)},${y}`);
  return <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2} />;
}

/** 一様な力の場を表す小さな右向き矢印の並び。 */
function FieldArrows({ x0, x1, ys, color = L.field }: { x0: number; x1: number; ys: number[]; color?: string }) {
  const xs = [x0, (x0 + x1) / 2, x1];
  return (
    <g opacity={0.45}>
      {ys.map(y => xs.map((x, i) => (
        <Arw key={`${y}-${i}`} x={x} y={y} dx={18} dy={0} color={color} w={1.6} head={5} />
      )))}
    </g>
  );
}

/** 角度の弧。 */
function ArcMark({ cx, cy, rad, from, to, color = L.dim }: {
  cx: number; cy: number; rad: number; from: number; to: number; color?: string;
}) {
  const ax = cx + rad * Math.cos(from), ay = cy - rad * Math.sin(from);
  const bx = cx + rad * Math.cos(to), by = cy - rad * Math.sin(to);
  const large = Math.abs(to - from) > Math.PI ? 1 : 0;
  return <path d={`M ${ax.toFixed(1)} ${ay.toFixed(1)} A ${rad} ${rad} 0 ${large} 0 ${bx.toFixed(1)} ${by.toFixed(1)}`}
    fill="none" stroke={color} strokeWidth={1.4} />;
}

// =====================================================================
// 1. um-newton-components — 運動方程式を成分で書く
// =====================================================================

/** 力が加速度を決める（初級の復習）。 */
export function NcRecall() {
  const t = useT();
  const u = (t % 3.2) / 3.2;
  const x = 40 + 150 * u * u;
  return (
    <LevelFig label="一定の力を受けて加速する台車">
      <Floor />
      <Box x={x} y={108} />
      <Arw x={x - 34} y={120} dx={28} dy={0} color={L.field} w={3} />
      <Lbl x={x - 36} y={110} text="F = 3 N" color={L.field} size={11} />
      <Lbl x={20} y={34} text="m = 2 kg、はたらく力 F = 3 N" color={L.text} size={11.5} />
      <Lbl x={20} y={54} text="a = F / m = 1.5 m/s²" color={L.focus} size={12.5} bold />
      <Lbl x={20} y={74} text="速さは時刻とともに増えていく" color={L.dim} size={10.5} />
      <Lbl x={20} y={156} text={`経過 ${fmt(3.2 * u, 1)} s`} color={L.dim} size={10.5} />
      <Cap text="式が決めているのは、いまこの瞬間の加速度" />
    </LevelFig>
  );
}

/** 向きの違う2力。Fに何を入れるかが決まらない。 */
export function NcTwoForces() {
  const t = useT();
  const blink = 0.78 + 0.2 * Math.sin(4 * t);
  return (
    <LevelFig label="向きの違う二つの力がはたらく台車">
      <Floor />
      <Box x={140} y={108} />
      <Arw x={96} y={120} dx={36} dy={0} color={L.field} w={3} />
      <Lbl x={94} y={110} text="5 N" color={L.field} size={11} anchor="end" />
      <Arw x={212} y={120} dx={-28} dy={0} color={L.field} w={3} />
      <Lbl x={216} y={110} text="2 N" color={L.field} size={11} />
      <Lbl x={20} y={34} text="右へ押す力と、左へ引く力がある" color={L.text} size={11.5} />
      <g opacity={blink}>
        <Lbl x={20} y={58} text="ma = F の F に入れる数は?" color={L.minus} size={12.5} bold />
      </g>
      <Lbl x={20} y={158} text="矢印は描けるが、数は1つに決まらない" color={L.dim} size={10.5} />
      <Cap text="向きを数に変える約束がないと、式が書けない" />
    </LevelFig>
  );
}

/** 式を書く前に決める3つ。 */
export function NcSetup() {
  const t = useT();
  const phase = step(t, 3, 1.5);
  const rows = [
    { text: '① どの物体の式かを1つ選ぶ', color: L.path },
    { text: '② 原点と座標軸を置く', color: L.normal },
    { text: '③ 各軸の正の向きを決める', color: L.plus },
  ];
  return (
    <LevelFig label="運動方程式を書く前に決める三つの手順">
      {rows.map((row, i) => (
        <Card key={row.text} x={34} y={30 + i * 34} w={252} h={26} color={row.color} active={i === phase} text={row.text} />
      ))}
      <Lbl x={160} y={152} text={phase === 2 ? 'ここまで決めて、初めて式が1本に定まる' : '決まっていない項目が残っている'}
        color={phase === 2 ? L.focus : L.dim} size={11} anchor="middle" />
      <Cap text="対象物 → 座標軸 → 正の向き。この順で決める" />
    </LevelFig>
  );
}

/** 正の向きを決めると力に符号が付く。 */
export function NcSign() {
  const t = useT();
  const show = step(t, 3, 1.3);
  return (
    <LevelFig label="正の向きを決めて力に符号を付ける">
      <line x1={24} y1={138} x2={288} y2={138} stroke={L.dim} strokeWidth={1.4} />
      <Arw x={266} y={138} dx={22} dy={0} color={L.dim} w={1.4} head={6} />
      <Lbl x={262} y={154} text="＋x の向き" color={L.dim} size={10.5} anchor="end" />
      <Box x={140} y={106} w={36} h={20} />
      <g opacity={show >= 0 ? 1 : 0.15}>
        <Arw x={176} y={116} dx={58} dy={0} color={L.plus} w={3} />
        <Lbl x={238} y={112} text="＋5 N" color={L.plus} size={11} />
      </g>
      <g opacity={show >= 1 ? 1 : 0.15}>
        <Arw x={140} y={116} dx={-26} dy={0} color={L.minus} w={3} />
        <Lbl x={110} y={112} text="−2 N" color={L.minus} size={11} anchor="end" />
      </g>
      <g opacity={show >= 2 ? 1 : 0.15}>
        <Arw x={158} y={88} dx={36} dy={0} color={L.focus} w={3.5} />
        <Lbl x={200} y={84} text="合力 ＋3 N" color={L.focus} size={11.5} bold />
      </g>
      <Lbl x={20} y={30} text="右を x 軸の正と決める" color={L.text} size={11.5} />
      <Lbl x={20} y={50} text="Fx = (＋5) ＋ (−2) = 3 N" color={L.focus} size={12} />
      <Cap text="符号は向きを数に変える約束。正の向きなしには付かない" />
    </LevelFig>
  );
}

/** 位置 → 速度 → 加速度 の微分の鎖。 */
export function NcSecondDerivative() {
  const t = useT();
  const phase = step(t, 3, 1.3);
  const boxes = [
    { label: '位置 x', color: L.path },
    { label: '速度 v', color: L.normal },
    { label: '加速度 a', color: L.field },
  ];
  return (
    <LevelFig label="位置を二回微分すると加速度になる">
      {boxes.map((b, i) => (
        <g key={b.label}>
          <rect x={18 + i * 100} y={52} width={80} height={30} rx={6}
            fill={b.color} opacity={i === phase ? 0.32 : 0.12} stroke={b.color} strokeWidth={i === phase ? 1.6 : 0.8} />
          <Lbl x={58 + i * 100} y={72} text={b.label} color={L.text} size={12} anchor="middle" />
        </g>
      ))}
      {[0, 1].map(i => (
        <g key={i}>
          <Arw x={100 + i * 100} y={67} dx={14} dy={0} color={L.focus} w={2} head={6} />
          <Lbl x={107 + i * 100} y={44} text="d/dt" color={L.focus} size={10.5} anchor="middle" />
        </g>
      ))}
      <line x1={58} y1={92} x2={58} y2={106} stroke={L.dim} strokeWidth={1.2} />
      <line x1={258} y1={92} x2={258} y2={106} stroke={L.dim} strokeWidth={1.2} />
      <line x1={58} y1={106} x2={258} y2={106} stroke={L.dim} strokeWidth={1.2} />
      <Lbl x={158} y={126} text="a = d²x / dt²" color={L.focus} size={13.5} anchor="middle" bold />
      <Lbl x={158} y={148} text="d/dt を2回続けた、というだけの記号" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="加速度は、位置を時間で2回微分した量" />
    </LevelFig>
  );
}

/** x成分の運動方程式。左辺が動き方、右辺が力。 */
export function NcXEquation() {
  const t = useT();
  const side = step(t, 2, 1.7);
  return (
    <LevelFig label="x成分の運動方程式の左辺と右辺">
      <rect x={16} y={44} width={126} height={50} rx={8} fill={L.path} opacity={side === 0 ? 0.3 : 0.12}
        stroke={L.path} strokeWidth={side === 0 ? 1.6 : 0.8} />
      <Lbl x={79} y={68} text="m d²x / dt²" color={L.text} size={13} anchor="middle" />
      <Lbl x={79} y={86} text="物体の動き方" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={160} y={74} text="=" color={L.focus} size={20} anchor="middle" bold />
      <rect x={178} y={44} width={126} height={50} rx={8} fill={L.field} opacity={side === 1 ? 0.3 : 0.12}
        stroke={L.field} strokeWidth={side === 1 ? 1.6 : 0.8} />
      <Lbl x={241} y={68} text="Fx" color={L.text} size={13} anchor="middle" />
      <Lbl x={241} y={86} text="x 方向の力の合計" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={20} y={28} text="等号は「この2つが同じ値だ」という主張" color={L.text} size={11} />
      <Lbl x={160} y={122} text="右辺に入るのは x 方向の成分だけ" color={L.focus} size={11.5} anchor="middle" />
      <Lbl x={160} y={144} text="y 方向の力は、この式には現れない" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="左辺は動き方、右辺はその軸に沿った力の合計" />
    </LevelFig>
  );
}

/** x軸とy軸で、独立した式が1本ずつ立つ。 */
export function NcYEquation() {
  const t = useT();
  const which = step(t, 2, 1.8);
  const cx = 104, cy = 100;
  return (
    <LevelFig label="x軸とy軸それぞれに独立した運動方程式が立つ">
      <line x1={cx - 76} y1={cy} x2={cx + 76} y2={cy} stroke={L.dim} strokeWidth={1.4} />
      <line x1={cx} y1={cy + 46} x2={cx} y2={cy - 56} stroke={L.dim} strokeWidth={1.4} />
      <Lbl x={cx + 80} y={cy + 4} text="x" color={L.dim} size={10.5} />
      <Lbl x={cx - 4} y={cy - 62} text="y" color={L.dim} size={10.5} anchor="end" />
      <circle cx={cx} cy={cy} r={8} fill={L.path} opacity={0.9} />
      <Arw x={cx} y={cy} dx={62} dy={0} color={which === 0 ? L.focus : L.field} w={3} />
      <Lbl x={cx + 66} y={cy + 16} text="Fx" color={which === 0 ? L.focus : L.field} size={11} />
      <Arw x={cx} y={cy} dx={0} dy={-46} color={which === 1 ? L.focus : L.field} w={3} />
      <Lbl x={cx + 6} y={cy - 50} text="Fy" color={which === 1 ? L.focus : L.field} size={11} />
      <Card x={196} y={52} w={112} h={30} color={L.path} active={which === 0} text="m d²x/dt² = Fx" size={11} />
      <Card x={196} y={94} w={112} h={30} color={L.path} active={which === 1} text="m d²y/dt² = Fy" size={11} />
      <Lbl x={20} y={30} text="軸ごとに、式が1本ずつ立つ" color={L.text} size={11.5} />
      <Lbl x={160} y={150} text="x の式に y の力は入らない" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="ベクトルの式をほどくと、独立した成分の式になる" />
    </LevelFig>
  );
}

/** 斜めの力を成分に分ける。 */
export function NcDecompose() {
  const ox = 88, oy = 132, len = 80;
  const th = Math.PI / 6;
  const ex = ox + len * Math.cos(th), ey = oy - len * Math.sin(th);
  const fx = 10 * Math.cos(th), fy = 10 * Math.sin(th);
  return (
    <LevelFig label="斜めの力をx成分とy成分に分ける">
      <line x1={24} y1={oy} x2={296} y2={oy} stroke={L.dim} strokeWidth={1.2} />
      <line x1={ox} y1={oy + 8} x2={ox} y2={44} stroke={L.dim} strokeWidth={1.2} />
      <Arw x={ox} y={oy} dx={ex - ox} dy={ey - oy} color={L.field} w={3} />
      <Lbl x={ex + 6} y={ey - 6} text="F = 10 N" color={L.field} size={11} />
      <line x1={ex} y1={ey} x2={ex} y2={oy} stroke={L.dim} strokeDasharray="4 3" strokeWidth={1.2} />
      <line x1={ex} y1={ey} x2={ox} y2={ey} stroke={L.dim} strokeDasharray="4 3" strokeWidth={1.2} />
      <Arw x={ox} y={oy} dx={len * Math.cos(th)} dy={0} color={L.focus} w={4.5} />
      <Arw x={ox} y={oy} dx={0} dy={-len * Math.sin(th)} color={L.plus} w={4.5} />
      <ArcMark cx={ox} cy={oy} rad={30} from={0} to={th} />
      <Lbl x={ox + 34} y={oy - 8} text="30°" color={L.dim} size={10} />
      <Lbl x={ox + len * Math.cos(th) + 6} y={oy + 14} text={`Fx = ${fx.toFixed(2)} N`} color={L.focus} size={11} />
      <Lbl x={ox - 6} y={ey + 4} text={`Fy = ${fy.toFixed(2)} N`} color={L.plus} size={11} anchor="end" />
      <Lbl x={20} y={30} text="矢印1本が、2つの数に分かれる" color={L.text} size={11.5} />
      <Cap text="Fx = 10cos30°、Fy = 10sin30°。別々の式に入る" />
    </LevelFig>
  );
}

/** 軸の取り方は自由。運動そのものは変わらない。 */
export function NcAxisChoice() {
  const t = useT();
  const which = step(t, 2, 2.2);
  const ax = 40, ay = 138, bx = 250, by = 62;
  const ux = (bx - ax), uy = (by - ay);
  const len = Math.hypot(ux, uy);
  const px = 150, py = ay + ((px - ax) / ux) * uy;
  return (
    <LevelFig label="斜面での座標軸の選び方">
      <polygon points={`${ax},${ay} ${bx},${ay} ${bx},${by}`} fill={L.dim} opacity={0.18} />
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke={L.path} strokeWidth={2.5} />
      <rect x={px - 13} y={py - 22} width={26} height={18} rx={4} fill={L.field} opacity={0.9}
        transform={`rotate(${(Math.atan2(uy, ux) * 180) / Math.PI} ${px} ${py})`} />
      <Arw x={px} y={py} dx={0} dy={34} color={L.field} w={2.5} />
      <Lbl x={px + 6} y={py + 34} text="重力" color={L.field} size={10.5} />
      {which === 0 ? (
        <g>
          <Arw x={px} y={py - 40} dx={40} dy={0} color={L.focus} w={2.5} />
          <Arw x={px} y={py - 40} dx={0} dy={-30} color={L.plus} w={2.5} />
          <Lbl x={px + 44} y={py - 36} text="x" color={L.focus} size={11} />
          <Lbl x={px + 4} y={py - 74} text="y" color={L.plus} size={11} />
          <Lbl x={20} y={30} text="選び方A: 水平と鉛直に取る" color={L.text} size={11.5} />
        </g>
      ) : (
        <g>
          <Arw x={px} y={py - 44} dx={(40 * ux) / len} dy={(40 * uy) / len} color={L.focus} w={2.5} />
          <Arw x={px} y={py - 44} dx={(30 * uy) / len} dy={(-30 * ux) / len} color={L.plus} w={2.5} />
          <Lbl x={px + 42} y={py - 52} text="x" color={L.focus} size={11} />
          <Lbl x={px - 24} y={py - 78} text="y" color={L.plus} size={11} anchor="end" />
          <Lbl x={20} y={30} text="選び方B: 斜面に沿って取る" color={L.text} size={11.5} />
        </g>
      )}
      <Lbl x={20} y={50} text={which === 0 ? '式は2本とも項が増える' : '斜面方向の式が短くなる'} color={L.dim} size={10.5} />
      <Lbl x={300} y={158} text="どちらでも、実際の動きは同じ" color={L.dim} size={10.5} anchor="end" />
      <Cap text="軸は自由に選べる。ただし途中で変えてはいけない" />
    </LevelFig>
  );
}

/** ベクトルの式は成分の式の束。 */
export function NcBundle() {
  const t = useT();
  const shown = Math.min(step(t, 4, 1.0), 3);
  const rows = ['m d²x/dt² = Fx', 'm d²y/dt² = Fy', 'm d²z/dt² = Fz'];
  return (
    <LevelFig label="ベクトルの運動方程式は成分の式三本の束">
      <rect x={82} y={24} width={156} height={30} rx={7} fill={L.focus} opacity={0.28} stroke={L.focus} strokeWidth={1.4} />
      <Lbl x={160} y={44} text="m d²r⃗ / dt² = F⃗" color={L.text} size={13} anchor="middle" bold />
      {rows.map((row, i) => (
        <g key={row}>
          <line x1={160} y1={56} x2={80 + i * 80} y2={72} stroke={L.dim} strokeWidth={1.2}
            opacity={i < shown ? 0.8 : 0.2} />
          <g opacity={i < shown ? 1 : 0.2}>
            <rect x={28} y={78 + i * 24} width={264} height={20} rx={5} fill={L.path} opacity={0.14} />
            <Lbl x={160} y={92 + i * 24} text={row} color={L.text} size={11.5} anchor="middle" />
          </g>
        </g>
      ))}
      <Lbl x={302} y={44} text={`${shown} / 3 本`} color={L.focus} size={11} anchor="end" />
      <Cap text="1本に見えて中身は3本。解くときは束をほどく" />
    </LevelFig>
  );
}

// =====================================================================
// 2. um-constant-force-derive — 一定の力から等加速度の式を作る
// =====================================================================

const A_T = mapper([0, 4], [0, 3], { x0: 58, y0: 36, x1: 256, y1: 138 });
const V_T = mapper([0, 4], [0, 14], { x0: 58, y0: 36, x1: 256, y1: 138 });
const V_T2 = mapper([0, 4], [0, 18], { x0: 58, y0: 36, x1: 256, y1: 138 });
const X_T = mapper([0, 4], [0, 40], { x0: 58, y0: 36, x1: 256, y1: 138 });

/** 力が一定なら加速度も一定。 */
export function CfConstA() {
  const t = useT();
  const u = pingPong(t, 6);
  return (
    <LevelFig label="加速度が時刻によらず一定であるグラフ">
      <Axes m={A_T} xLabel="時刻 t [s]" yLabel="a [m/s²]" />
      <line x1={A_T.x(0)} y1={A_T.y(2)} x2={A_T.x(4)} y2={A_T.y(2)} stroke={L.field} strokeWidth={2.5} />
      <circle cx={A_T.x(4 * u)} cy={A_T.y(2)} r={5} fill={L.focus} />
      <Lbl x={A_T.x(4) + 2} y={A_T.y(2) - 6} text="a = 2" color={L.field} size={10.5} anchor="end" />
      <Lbl x={66} y={22} text="F = 4 N、m = 2 kg" color={L.text} size={11.5} />
      <Lbl x={A_T.x(2)} y={A_T.y(1)} text="どの時刻でも高さは 2 m/s²" color={L.focus} size={11} anchor="middle" />
      <Lbl x={66} y={158} text={`時刻 ${fmt(4 * u, 1)} s でも a = 2 m/s²`} color={L.dim} size={10.5} />
      <Cap text="力が変わらなければ、加速度も時刻によらず一定" />
    </LevelFig>
  );
}

/** 加速度だけでは3秒後の速度が出ない。積み上げが要る。 */
export function CfQuestion() {
  const t = useT();
  const n = Math.min(step(t, 4, 1.1), 3);
  const blink = 0.78 + 0.2 * Math.sin(4 * t);
  return (
    <LevelFig label="毎秒ふえる速度を積み上げる">
      <line x1={40} y1={120} x2={286} y2={120} stroke={L.dim} strokeWidth={1.4} />
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <line x1={40 + i * 70} y1={116} x2={40 + i * 70} y2={124} stroke={L.dim} strokeWidth={1.4} />
          <Lbl x={40 + i * 70} y={138} text={`${i} s`} color={L.dim} size={10} anchor="middle" />
        </g>
      ))}
      {[0, 1, 2].map(i => (
        <g key={i} opacity={i < n ? 1 : 0.18}>
          <Arw x={44 + i * 70} y={100} dx={60} dy={0} color={L.plus} w={2.5} />
          <Lbl x={74 + i * 70} y={92} text="＋2 m/s" color={L.plus} size={10.5} anchor="middle" />
        </g>
      ))}
      <Lbl x={20} y={32} text="加速度が言うのは「1秒で2 m/s 増える」だけ" color={L.text} size={11} />
      <g opacity={blink}>
        <Lbl x={286} y={60} text="v(3) = ?" color={L.minus} size={13} anchor="end" bold />
      </g>
      <Lbl x={20} y={158} text={`積み上げた分 ${2 * n} m/s`} color={L.focus} size={11} />
      <Cap text="割合を時間ぶん積み上げる操作が積分" />
    </LevelFig>
  );
}

/** a-t グラフの面積が、速度の増えた分。 */
export function CfArea() {
  const t = useT();
  const u = pingPong(t, 6);
  const tf = 3 * u;
  return (
    <LevelFig label="加速度と時間のグラフの面積">
      <Axes m={A_T} xLabel="時刻 t [s]" yLabel="a [m/s²]" />
      <rect x={A_T.x(0)} y={A_T.y(2)} width={Math.max(A_T.x(tf) - A_T.x(0), 0)} height={A_T.y(0) - A_T.y(2)}
        fill={L.focus} opacity={0.35} />
      <line x1={A_T.x(0)} y1={A_T.y(2)} x2={A_T.x(4)} y2={A_T.y(2)} stroke={L.field} strokeWidth={2.5} />
      <Lbl x={66} y={22} text="高さ 2 × 幅 3 の長方形" color={L.text} size={11.5} />
      <Lbl x={A_T.x(1.5)} y={A_T.y(1)} text={`面積 = ${fmt(2 * tf, 1)} m/s`} color={L.focus} size={12} anchor="middle" bold />
      <Lbl x={66} y={158} text="面積の単位は (m/s²)×s = m/s" color={L.dim} size={10.5} />
      <Cap text="面積が、その間に増えた速度そのもの" />
    </LevelFig>
  );
}

/** 積分定数Cの違いは、同じ傾きの平行な直線。 */
export function CfConstant() {
  const t = useT();
  const pick = step(t, 3, 1.4);
  const cs = [0, 4, 8];
  return (
    <LevelFig label="積分定数が違う三本の平行な直線">
      <Axes m={V_T2} xLabel="時刻 t [s]" yLabel="速度 v [m/s]" />
      {cs.map((c, i) => (
        <g key={c}>
          <Curve m={V_T2} f={x => 2 * x + c} color={i === pick ? L.focus : L.dim} w={i === pick ? 2.8 : 1.6} xa={0} xb={4} />
          <Lbl x={V_T2.x(0.12)} y={V_T2.y(c) - 5} text={`C = ${c}`} color={i === pick ? L.focus : L.dim} size={10} />
        </g>
      ))}
      <Lbl x={66} y={22} text="v = 2t + C。傾きはどれも同じ" color={L.text} size={11.5} />
      <Lbl x={66} y={158} text="面積から分かるのは増えた分だけ" color={L.dim} size={10.5} />
      <Cap text="出発点が違えば、同じ傾きでも別の解になる" />
    </LevelFig>
  );
}

/** 初期条件がCを決める。 */
export function CfInitial() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(3 * t);
  return (
    <LevelFig label="初期条件が積分定数を決める">
      <Axes m={V_T2} xLabel="時刻 t [s]" yLabel="速度 v [m/s]" />
      {[0, 8].map(c => (
        <Curve key={c} m={V_T2} f={x => 2 * x + c} color={L.dim} w={1.4} xa={0} xb={4} dash="4 4" />
      ))}
      <Curve m={V_T2} f={x => 2 * x + 4} color={L.focus} w={3} xa={0} xb={4} />
      <circle cx={V_T2.x(0)} cy={V_T2.y(4)} r={6} fill={L.plus} opacity={glow} />
      <Lbl x={V_T2.x(1.6)} y={V_T2.y(1.4)} text="測った値 v(0) = 4 m/s" color={L.plus} size={10.5} />
      <line x1={V_T2.x(1.55)} y1={V_T2.y(1.9)} x2={V_T2.x(0.12)} y2={V_T2.y(3.6)} stroke={L.plus} strokeWidth={1.1} />
      <Lbl x={66} y={22} text="t = 0 を入れると v(0) = C" color={L.text} size={11.5} />
      <Lbl x={66} y={158} text="だから C = v₀ = 4 m/s に決まる" color={L.focus} size={11} />
      <Cap text="積分定数を決めるのは、初期条件という1つの測定値" />
    </LevelFig>
  );
}

/** v = v0 + at の切片と傾き。 */
export function CfVtLine() {
  const t = useT();
  const u = pingPong(t, 6);
  return (
    <LevelFig label="速度の直線の切片と傾き">
      <Axes m={V_T} xLabel="時刻 t [s]" yLabel="速度 v [m/s]" />
      <Curve m={V_T} f={x => 4 + 2 * x} color={L.field} w={2.8} xa={0} xb={4} />
      <line x1={V_T.x(1)} y1={V_T.y(6)} x2={V_T.x(2)} y2={V_T.y(6)} stroke={L.focus} strokeWidth={2} />
      <line x1={V_T.x(2)} y1={V_T.y(6)} x2={V_T.x(2)} y2={V_T.y(8)} stroke={L.focus} strokeWidth={2} />
      <Lbl x={V_T.x(1.5)} y={V_T.y(6) + 14} text="1 s" color={L.focus} size={10} anchor="middle" />
      <Lbl x={V_T.x(2) + 4} y={V_T.y(7)} text="＋2 m/s" color={L.focus} size={10} />
      <circle cx={V_T.x(0)} cy={V_T.y(4)} r={5} fill={L.plus} />
      <Lbl x={V_T.x(0) + 8} y={V_T.y(4) + 16} text="切片 v₀ = 4" color={L.plus} size={10.5} />
      <Lbl x={66} y={22} text="v = v₀ ＋ at" color={L.text} size={12.5} />
      <Lbl x={66} y={158} text={`t = ${fmt(4 * u, 1)} s のとき v = ${fmt(4 + 2 * 4 * u, 1)} m/s`} color={L.dim} size={10.5} />
      <Cap text="切片が初期条件、傾きが加速度" />
    </LevelFig>
  );
}

/** v-t グラフの面積は、長方形と三角形に分かれる。 */
export function CfVtArea() {
  const t = useT();
  const part = step(t, 2, 1.8);
  const tf = 3;
  return (
    <LevelFig label="速度と時間のグラフの面積を長方形と三角形に分ける">
      <Axes m={V_T} xLabel="時刻 t [s]" yLabel="速度 v [m/s]" />
      <rect x={V_T.x(0)} y={V_T.y(4)} width={V_T.x(tf) - V_T.x(0)} height={V_T.y(0) - V_T.y(4)}
        fill={L.plus} opacity={part === 0 ? 0.45 : 0.18} />
      <polygon points={`${V_T.x(0)},${V_T.y(4)} ${V_T.x(tf)},${V_T.y(4)} ${V_T.x(tf)},${V_T.y(10)}`}
        fill={L.focus} opacity={part === 1 ? 0.5 : 0.18} />
      <Curve m={V_T} f={x => 4 + 2 * x} color={L.field} w={2.8} xa={0} xb={4} />
      <Lbl x={66} y={22} text={part === 0 ? '長方形の分 = v₀t = 12 m' : '三角形の分 = ½at² = 9 m'} color={L.text} size={11.5} />
      <Lbl x={V_T.x(1.4)} y={V_T.y(2)} text="v₀t" color={L.plus} size={11.5} anchor="middle" />
      <Lbl x={V_T.x(2.3)} y={V_T.y(5.4)} text="½at²" color={L.focus} size={11.5} anchor="middle" />
      <Lbl x={66} y={158} text="合計 12 ＋ 9 = 21 m 進んだ" color={L.focus} size={11} />
      <Cap text="位置の変化は、速度グラフの下の面積" />
    </LevelFig>
  );
}

/** 三角形の面積に付く2分の1。 */
export function CfHalf() {
  const m = mapper([0, 4], [0, 8], { x0: 58, y0: 36, x1: 256, y1: 138 });
  return (
    <LevelFig label="三角形の面積に付く二分の一">
      <Axes m={m} xLabel="時刻 t [s]" yLabel="at [m/s]" />
      <polygon points={`${m.x(0)},${m.y(0)} ${m.x(3)},${m.y(0)} ${m.x(3)},${m.y(6)}`} fill={L.focus} opacity={0.4} />
      <Curve m={m} f={x => 2 * x} color={L.field} w={2.8} xa={0} xb={3.6} />
      <line x1={m.x(0)} y1={m.y(0) + 10} x2={m.x(3)} y2={m.y(0) + 10} stroke={L.path} strokeWidth={2} />
      <Lbl x={m.x(1.5)} y={m.y(0) + 24} text="底辺 t = 3 s" color={L.path} size={10.5} anchor="middle" />
      <line x1={m.x(3) + 8} y1={m.y(0)} x2={m.x(3) + 8} y2={m.y(6)} stroke={L.plus} strokeWidth={2} />
      <Lbl x={m.x(3) + 12} y={m.y(3)} text="高さ at = 6" color={L.plus} size={10.5} anchor="end" />
      <Lbl x={66} y={22} text="3 × 6 ÷ 2 = 9 m" color={L.text} size={12} />
      <Lbl x={m.x(1.8)} y={m.y(2)} text="½at²" color={L.focus} size={13} anchor="middle" bold />
      <Cap text="2分の1は、三角形の半分であり積分の足跡でもある" />
    </LevelFig>
  );
}

/** 2回目の積分定数は出発点の位置。 */
export function CfX0() {
  const t = useT();
  const pick = step(t, 2, 1.8);
  const x0 = pick === 0 ? 0 : 8;
  return (
    <LevelFig label="出発点の位置だけずれた二本の放物線">
      <Axes m={X_T} xLabel="時刻 t [s]" yLabel="位置 x [m]" />
      <Curve m={X_T} f={s => 4 * s + s * s} color={pick === 0 ? L.focus : L.dim} w={pick === 0 ? 3 : 1.6} xa={0} xb={4} />
      <Curve m={X_T} f={s => 8 + 4 * s + s * s} color={pick === 1 ? L.focus : L.dim} w={pick === 1 ? 3 : 1.6} xa={0} xb={4} />
      <line x1={X_T.x(0)} y1={X_T.y(x0)} x2={X_T.x(4)} y2={X_T.y(x0)} stroke={L.plus} strokeDasharray="4 4" strokeWidth={1.2} />
      <circle cx={X_T.x(0)} cy={X_T.y(x0)} r={5} fill={L.plus} />
      <Lbl x={286} y={X_T.y(x0) - 6} text={`x₀ = ${x0} m`} color={L.plus} size={10.5} anchor="end" />
      <Lbl x={66} y={22} text="形は同じで、縦にずれているだけ" color={L.text} size={11.5} />
      <Lbl x={66} y={158} text="D = x₀。出発点の位置が決める" color={L.focus} size={11} />
      <Cap text="2回目の積分定数は、時刻0の位置そのもの" />
    </LevelFig>
  );
}

/** 2式のまとめと、使ってよい条件。 */
export function CfSummary() {
  const t = useT();
  const pick = step(t, 2, 1.8);
  return (
    <LevelFig label="等加速度の二式と使ってよい条件">
      <Card x={20} y={28} w={280} h={30} color={L.focus} active={pick === 0} text="v = v₀ ＋ at" size={13} />
      <Card x={20} y={66} w={280} h={30} color={L.focus} active={pick === 1} text="x = x₀ ＋ v₀t ＋ ½at²" size={13} />
      <Lbl x={20} y={118} text="使った仮定は「加速度が一定」の1つだけ" color={L.text} size={11} />
      <Lbl x={20} y={136} text="定数を決めたのは v₀ と x₀ の2つ" color={L.dim} size={10.5} />
      <Lbl x={20} y={156} text="力が途中で変わる運動には使えない" color={L.minus} size={11} />
      <Cap text="仮定から積分2回。公式ではなく結果である" />
    </LevelFig>
  );
}

// =====================================================================
// 3. um-work-sum — 変わる力の仕事を式で書く
// =====================================================================

const STEP3 = [2, 3, 1];
const S_X = mapper([0, 3], [0, 4], { x0: 58, y0: 36, x1: 256, y1: 138 });
const SPRING_M = mapper([0, 0.12], [0, 26], { x0: 58, y0: 36, x1: 256, y1: 138 });
const SPRING_W = mapper([0, 0.24], [0, 50], { x0: 58, y0: 36, x1: 256, y1: 138 });

/** 区間ごとの長方形を足していた（復習）。 */
export function WsRecap() {
  const t = useT();
  const shown = Math.min(step(t, 4, 1.0), 3);
  const partial = STEP3.slice(0, shown).reduce((a, b) => a + b, 0);
  return (
    <LevelFig label="三つの区間の長方形を順に足す">
      <Axes m={S_X} xLabel="位置 x [m]" yLabel="力 F [N]" />
      {STEP3.map((f, i) => (i < shown ? <Bar key={i} m={S_X} x0={i} x1={i + 1} height={f} active={i === shown - 1} /> : null))}
      {STEP3.map((f, i) => (
        <Lbl key={`l${i}`} x={S_X.x(i + 0.5)} y={S_X.y(f) - 6} text={`${f} N`} color={i < shown ? L.field : L.dim} size={10.5} anchor="middle" />
      ))}
      <Lbl x={66} y={22} text="幅はどれも 1 m" color={L.text} size={11.5} />
      <Lbl x={286} y={22} text={`合計 ${partial} J`} color={L.focus} size={12.5} anchor="end" bold />
      <Lbl x={66} y={158} text="各区間の力 × その区間の幅を足す" color={L.dim} size={10.5} />
      <Cap text="2 ＋ 3 ＋ 1 = 6 J。足しているのは長方形の面積" />
    </LevelFig>
  );
}

/** 和の記号 Σ は、足し算の省略形。 */
export function WsSigma() {
  const t = useT();
  const active = step(t, 3, 1.2);
  return (
    <LevelFig label="和の記号が足し算の省略形であること">
      <Axes m={S_X} xLabel="位置 x [m]" yLabel="力 F [N]" />
      {STEP3.map((f, i) => <Bar key={i} m={S_X} x0={i} x1={i + 1} height={f} active={i === active} />)}
      {STEP3.map((f, i) => (
        <Lbl key={`i${i}`} x={S_X.x(i + 0.5)} y={S_X.y(f) + 16} text={`F${['₁', '₂', '₃'][i]}Δx${['₁', '₂', '₃'][i]}`}
          color={i === active ? L.focus : L.dim} size={10} anchor="middle" />
      ))}
      <Lbl x={66} y={22} text="i 番目の区間の仕事は Fᵢ Δxᵢ" color={L.text} size={11} />
      <Lbl x={160} y={158} text="W ≈ Σᵢ Fᵢ Δxᵢ" color={L.focus} size={12} anchor="middle" />
      <Cap text="記号が変わっただけ。やっているのは足し算" />
    </LevelFig>
  );
}

/** ばねの力は伸びに比例する。 */
export function WsSpring() {
  const [x, setX] = useManual(time => 0.02 + 0.08 * pingPong(time, 7));
  const tip = 90 + x * 1400;
  const f = 200 * x;
  return (
    <>
      <LevelFig label="伸ばすほど強くなるばねの力">
        <line x1={44} y1={60} x2={44} y2={124} stroke={L.dim} strokeWidth={3} />
        <Spring x0={44} x1={tip} y={92} />
        <Box x={tip} y={80} w={24} h={24} />
        <Arw x={tip + 26} y={92} dx={Math.max(f * 1.6, 8)} dy={0} color={L.field} w={3} />
        <Lbl x={312} y={74} text={`F = ${fmt(f, 1)} N`} color={L.field} size={11} anchor="end" />
        <line x1={90} y1={132} x2={tip} y2={132} stroke={L.path} strokeWidth={2} />
        <Lbl x={(90 + tip) / 2} y={148} text={`伸び x = ${x.toFixed(3)} m`} color={L.path} size={10.5} anchor="middle" />
        <Lbl x={20} y={32} text="k = 200 N/m のばね。F = kx" color={L.text} size={11.5} />
        <Cap text="伸ばすほど力が増えるので、掛けるFが1つに決まらない" />
      </LevelFig>
      <FigSlider label="ばねの伸び [m]" value={x} min={0.01} max={0.10} step={0.005} onChange={setX} display={`${x.toFixed(3)} m`} />
    </>
  );
}

/** ばねの力-位置グラフは原点を通る直線。 */
export function WsLine() {
  const t = useT();
  const u = pingPong(t, 6);
  const xp = 0.1 * u;
  return (
    <LevelFig label="ばねの力と伸びのグラフは原点を通る直線">
      <Axes m={SPRING_M} xLabel="伸び x [m]" yLabel="力 F [N]" />
      <Curve m={SPRING_M} f={x => 200 * x} color={L.field} w={2.8} xa={0} xb={0.12} />
      <circle cx={SPRING_M.x(xp)} cy={SPRING_M.y(200 * xp)} r={5} fill={L.focus} />
      <Lbl x={SPRING_M.x(0.1) + 2} y={SPRING_M.y(20) - 8} text="20 N" color={L.field} size={10.5} anchor="end" />
      <Lbl x={66} y={22} text="傾きがばね定数 k = 200 N/m" color={L.text} size={11.5} />
      <Lbl x={66} y={158} text={`x = ${xp.toFixed(3)} m で F = ${fmt(200 * xp, 1)} N`} color={L.focus} size={11} />
      <Cap text="階段ではなく、傾いた1本の直線が相手になる" />
    </LevelFig>
  );
}

/** 5本の短冊で足す。 */
export function WsBars() {
  const t = useT();
  const shown = Math.min(step(t, 6, 0.8), 5);
  const mids = [0.01, 0.03, 0.05, 0.07, 0.09];
  const partial = mids.slice(0, shown).reduce((a, x) => a + 200 * x * 0.02, 0);
  return (
    <LevelFig label="直線の下を五本の短冊で近似する">
      <Axes m={SPRING_M} xLabel="伸び x [m]" yLabel="力 F [N]" />
      {mids.map((mx, i) => (i < shown
        ? <Bar key={i} m={SPRING_M} x0={i * 0.02} x1={(i + 1) * 0.02} height={200 * mx} active={i === shown - 1} />
        : null))}
      <Curve m={SPRING_M} f={x => 200 * x} color={L.field} w={2.4} xa={0} xb={0.12} />
      {mids.map((mx, i) => (
        <Lbl key={`v${i}`} x={SPRING_M.x(mx)} y={SPRING_M.y(200 * mx) - 5} text={`${Math.round(200 * mx)}`}
          color={i < shown ? L.focus : L.dim} size={9.5} anchor="middle" />
      ))}
      <Lbl x={66} y={22} text="中央の力 2, 6, 10, 14, 18 N" color={L.text} size={11} />
      <Lbl x={66} y={158} text={`合計 ${partial.toFixed(2)} J（幅 0.02 m）`} color={L.focus} size={11} />
      <Cap text="力の合計 50 N に幅 0.02 m を掛けて 1.0 J" />
    </LevelFig>
  );
}

/** 細かくすると三角形の面積。 */
export function WsTriangle() {
  return (
    <LevelFig label="直線の下の三角形の面積">
      <Axes m={SPRING_M} xLabel="伸び x [m]" yLabel="力 F [N]" />
      <polygon points={`${SPRING_M.x(0)},${SPRING_M.y(0)} ${SPRING_M.x(0.1)},${SPRING_M.y(0)} ${SPRING_M.x(0.1)},${SPRING_M.y(20)}`}
        fill={L.focus} opacity={0.4} />
      <Curve m={SPRING_M} f={x => 200 * x} color={L.field} w={2.8} xa={0} xb={0.12} />
      <line x1={SPRING_M.x(0)} y1={SPRING_M.y(0) + 10} x2={SPRING_M.x(0.1)} y2={SPRING_M.y(0) + 10} stroke={L.path} strokeWidth={2} />
      <Lbl x={SPRING_M.x(0.05)} y={SPRING_M.y(0) + 24} text="底辺 0.10 m" color={L.path} size={10.5} anchor="middle" />
      <line x1={SPRING_M.x(0.1) + 8} y1={SPRING_M.y(0)} x2={SPRING_M.x(0.1) + 8} y2={SPRING_M.y(20)} stroke={L.plus} strokeWidth={2} />
      <Lbl x={SPRING_M.x(0.1) - 4} y={SPRING_M.y(21.5)} text="高さ 20 N" color={L.plus} size={10.5} anchor="end" />
      <Lbl x={66} y={22} text="0.10 × 20 ÷ 2 = 1.0" color={L.text} size={12} />
      <Lbl x={SPRING_M.x(0.062)} y={SPRING_M.y(5)} text="1.0 J" color={L.focus} size={13} anchor="middle" bold />
      <Cap text="短冊の和 1.0 J と、三角形の面積が一致する" />
    </LevelFig>
  );
}

/** 記号のまま書いた三角形。 */
export function WsHalfKx2() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(3 * t);
  const m = mapper([0, 1.2], [0, 1.4], { x0: 58, y0: 36, x1: 256, y1: 138 });
  return (
    <LevelFig label="記号のまま書いた三角形の面積">
      <Axes m={m} xLabel="位置 x" yLabel="F = kx" />
      <polygon points={`${m.x(0)},${m.y(0)} ${m.x(1)},${m.y(0)} ${m.x(1)},${m.y(1)}`} fill={L.focus} opacity={0.38} />
      <Curve m={m} f={x => x} color={L.field} w={2.8} xa={0} xb={1.2} />
      <Lbl x={m.x(0.5)} y={m.y(0) + 20} text="底辺 x" color={L.path} size={11} anchor="middle" />
      <Lbl x={m.x(1) + 6} y={m.y(0.5)} text="高さ kx" color={L.plus} size={11} />
      <g opacity={glow}>
        <Lbl x={m.x(0.58)} y={m.y(0.28)} text="W = ½kx²" color={L.focus} size={13.5} anchor="middle" bold />
      </g>
      <Lbl x={66} y={22} text="x × kx ÷ 2 を整理する" color={L.text} size={11.5} />
      <Cap text="数値を入れる前に、形のまま計算しておける" />
    </LevelFig>
  );
}

/** 伸びを2倍にすると仕事は4倍。 */
export function WsQuadruple() {
  const t = useT();
  const pick = step(t, 2, 1.8);
  const xe = pick === 0 ? 0.1 : 0.2;
  const w = 0.5 * 200 * xe * xe;
  return (
    <LevelFig label="伸びを二倍にしたときの三角形の面積">
      <Axes m={SPRING_W} xLabel="伸び x [m]" yLabel="力 F [N]" />
      <polygon points={`${SPRING_W.x(0)},${SPRING_W.y(0)} ${SPRING_W.x(0.1)},${SPRING_W.y(0)} ${SPRING_W.x(0.1)},${SPRING_W.y(20)}`}
        fill={L.plus} opacity={0.35} />
      {pick === 1 && (
        <polygon points={`${SPRING_W.x(0)},${SPRING_W.y(0)} ${SPRING_W.x(0.2)},${SPRING_W.y(0)} ${SPRING_W.x(0.2)},${SPRING_W.y(40)}`}
          fill={L.focus} opacity={0.3} />
      )}
      <Curve m={SPRING_W} f={x => 200 * x} color={L.field} w={2.6} xa={0} xb={0.24} />
      <Lbl x={66} y={22} text={`伸び ${xe.toFixed(2)} m のときの仕事`} color={L.text} size={11.5} />
      <Lbl x={286} y={22} text={`${w.toFixed(1)} J`} color={L.focus} size={13} anchor="end" bold />
      <Lbl x={66} y={158} text="距離も2倍、力も2倍。だから4倍になる" color={L.dim} size={10.5} />
      <Cap text="W は x の2乗に比例する。1.0 J が 4.0 J へ" />
    </LevelFig>
  );
}

/** 和が積分になる。 */
export function WsIntegral() {
  const t = useT();
  const counts = [5, 10, 20, 40];
  const n = counts[step(t, counts.length, 1.3)];
  const w = 0.1 / n;
  const sum = Array.from({ length: n }, (_, i) => 200 * (i + 0.5) * w * w).reduce((a, b) => a + b, 0);
  return (
    <LevelFig label="区間を細かくして和を積分に近づける">
      <Axes m={SPRING_M} xLabel="伸び x [m]" yLabel="力 F [N]" />
      {Array.from({ length: n }, (_, i) => (
        <Bar key={i} m={SPRING_M} x0={i * w} x1={(i + 1) * w} height={200 * (i + 0.5) * w} />
      ))}
      <Curve m={SPRING_M} f={x => 200 * x} color={L.field} w={2.4} xa={0} xb={0.12} />
      <Lbl x={66} y={22} text={`区間 ${n} 個`} color={L.text} size={11.5} />
      <Lbl x={286} y={22} text={`合計 ${sum.toFixed(3)} J`} color={L.focus} size={11.5} anchor="end" />
      <Lbl x={160} y={158} text="Σᵢ Fᵢ Δxᵢ  →  ∫ F dx" color={L.focus} size={12} anchor="middle" />
      <Cap text="細かくする約束を付けた和が積分。操作は同じ" />
    </LevelFig>
  );
}

// =====================================================================
// 4. um-work-vector — 仕事を内積で書く
// =====================================================================

const PATH_M = mapper([-0.4, 4.2], [-0.4, 2.6], { x0: 44, y0: 44, x1: 282, y1: 138 });
const PATH_PTS: [number, number][] = [[0, 0], [3, 0], [3, 2], [2, 2]];

function PathPoly({ upto, activeSeg }: { upto: number; activeSeg?: number }) {
  return (
    <g>
      {PATH_PTS.slice(0, -1).map(([x, y], i) => {
        if (i >= upto) return null;
        const [nx, ny] = PATH_PTS[i + 1];
        const active = activeSeg === i;
        return (
          <line key={i} x1={PATH_M.x(x)} y1={PATH_M.y(y)} x2={PATH_M.x(nx)} y2={PATH_M.y(ny)}
            stroke={active ? L.focus : L.path} strokeWidth={active ? 4 : 2.5} strokeLinecap="round" />
        );
      })}
      {PATH_PTS.map(([x, y], i) => (
        <circle key={`p${i}`} cx={PATH_M.x(x)} cy={PATH_M.y(y)} r={3.5} fill={i <= upto ? L.path : L.dim} />
      ))}
    </g>
  );
}

/** 斜めの力のうち、水平成分だけが効く（復習）。 */
export function WvRecall() {
  const t = useT();
  const u = pingPong(t, 6);
  const bx = 112 + 86 * u;
  const th = Math.PI / 3;
  const len = 64;
  return (
    <LevelFig label="斜めに引く力のうち水平成分だけが効く">
      <Floor y={134} />
      <Box x={bx - 18} y={110} w={36} h={24} />
      <Arw x={bx} y={122} dx={len * Math.cos(th)} dy={-len * Math.sin(th)} color={L.field} w={3} />
      <Lbl x={bx + len * Math.cos(th) + 6} y={122 - len * Math.sin(th) - 4} text="10 N" color={L.field} size={11} />
      <Arw x={bx} y={122} dx={len * Math.cos(th)} dy={0} color={L.focus} w={4.5} />
      <Arw x={bx} y={122} dx={0} dy={-len * Math.sin(th)} color={L.dim} w={2} />
      <ArcMark cx={bx} cy={122} rad={26} from={0} to={th} />
      <Lbl x={bx + 30} y={116} text="60°" color={L.dim} size={10} />
      <Lbl x={20} y={26} text="箱は水平にしか進まない" color={L.text} size={11.5} />
      <Lbl x={20} y={46} text="効くのは水平成分 5.0 N だけ" color={L.focus} size={11.5} />
      <Lbl x={bx - 6} y={84} text="8.7 N は効かない" color={L.dim} size={10} anchor="end" />
      <Cap text="矢印の長さをそのまま掛けてはいけない" />
    </LevelFig>
  );
}

/** cosθ で投影する。角度を動かせる。 */
export function WvCos() {
  const [deg, setDeg] = useManual(time => 20 + 60 * pingPong(time, 8));
  const th = (deg * Math.PI) / 180;
  const ox = 80, oy = 128, len = 62;
  const par = 10 * Math.cos(th);
  return (
    <>
      <LevelFig label="力を移動の向きへ投影した長さ">
        <line x1={24} y1={oy} x2={296} y2={oy} stroke={L.dim} strokeWidth={1.2} />
        <Arw x={ox} y={oy} dx={len * Math.cos(th)} dy={-len * Math.sin(th)} color={L.field} w={3} />
        <Lbl x={ox + len * Math.cos(th) + 6} y={oy - len * Math.sin(th) - 4} text="F = 10 N" color={L.field} size={11} />
        <line x1={ox + len * Math.cos(th)} y1={oy - len * Math.sin(th)} x2={ox + len * Math.cos(th)} y2={oy}
          stroke={L.dim} strokeDasharray="4 3" strokeWidth={1.2} />
        <Arw x={ox} y={oy} dx={len * Math.cos(th)} dy={0} color={L.focus} w={5} />
        <ArcMark cx={ox} cy={oy} rad={30} from={0} to={th} />
        <Lbl x={ox + 34} y={oy - 8} text={`${Math.round(deg)}°`} color={L.dim} size={10} />
        <Lbl x={ox + len * Math.cos(th) + 4} y={oy + 16} text={`F cos θ = ${fmt(par, 2)} N`} color={L.focus} size={11} />
        <Lbl x={20} y={26} text="移動の向きへ下ろした影の長さ" color={L.text} size={11.5} />
        <Lbl x={20} y={44} text="角が大きいほど、影は短くなる" color={L.dim} size={10.5} />
        <Cap text="効くのは、移動の向きに揃った成分だけ" />
      </LevelFig>
      <FigSlider label="力と移動のなす角 [度]" value={deg} min={0} max={180} step={1} onChange={setDeg} display={`${Math.round(deg)}°`} />
    </>
  );
}

/** 内積という名前。 */
export function WvDot() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(3 * t);
  const ox = 70, oy = 112, th = Math.PI / 4;
  return (
    <LevelFig label="力ベクトルと変位ベクトルの内積">
      <Arw x={ox} y={oy} dx={96} dy={0} color={L.path} w={3} />
      <Lbl x={ox + 100} y={oy + 14} text="Δr⃗" color={L.path} size={11.5} />
      <Arw x={ox} y={oy} dx={80 * Math.cos(th)} dy={-80 * Math.sin(th)} color={L.field} w={3} />
      <Lbl x={ox + 80 * Math.cos(th) + 4} y={oy - 80 * Math.sin(th) - 4} text="F⃗" color={L.field} size={11.5} />
      <ArcMark cx={ox} cy={oy} rad={30} from={0} to={th} />
      <Lbl x={ox + 34} y={oy - 10} text="θ" color={L.dim} size={11} />
      <g opacity={glow}>
        <rect x={172} y={42} width={132} height={54} rx={7} fill={L.focus} opacity={0.2} stroke={L.focus} strokeWidth={1.3} />
        <Lbl x={238} y={64} text="ΔW = F⃗ · Δr⃗" color={L.text} size={12} anchor="middle" />
        <Lbl x={238} y={84} text="= F Δs cos θ" color={L.focus} size={12} anchor="middle" />
      </g>
      <Lbl x={20} y={30} text="向きの揃った分だけを取り出す掛け算" color={L.text} size={11} />
      <Lbl x={20} y={150} text="この掛け算の名前が「内積」" color={L.dim} size={10.5} />
      <Cap text="内積は、2本の矢印から1つの数を作る" />
    </LevelFig>
  );
}

/** 折れ線の経路と一様な力。 */
export function WvPath() {
  const t = useT();
  const blink = 0.78 + 0.2 * Math.sin(4 * t);
  return (
    <LevelFig label="一様な力の中を歩く折れ線の経路">
      <Axes m={PATH_M} xLabel="x [m]" yLabel="y [m]" />
      <FieldArrows x0={PATH_M.x(0.3)} x1={PATH_M.x(3.2)} ys={[PATH_M.y(0.7), PATH_M.y(1.5), PATH_M.y(2.3)]} />
      <PathPoly upto={3} />
      <Lbl x={PATH_M.x(1.5)} y={PATH_M.y(0) + 16} text="3 m" color={L.path} size={10.5} anchor="middle" />
      <Lbl x={PATH_M.x(3) + 6} y={PATH_M.y(1)} text="2 m" color={L.path} size={10.5} />
      <Lbl x={PATH_M.x(2.5)} y={PATH_M.y(2) - 8} text="1 m" color={L.path} size={10.5} anchor="middle" />
      <Lbl x={66} y={22} text="力はどこでも右向き 4 N" color={L.text} size={11} />
      <g opacity={blink}>
        <Lbl x={160} y={158} text="辺ごとに、道と力のなす角が違う" color={L.minus} size={11} anchor="middle" />
      </g>
      <Cap text="まとめて1回の掛け算では計算できない" />
    </LevelFig>
  );
}

function WvSegment({ seg, label, value, color, note }: {
  seg: number; label: string; value: string; color: string; note: string;
}) {
  const [x, y] = PATH_PTS[seg];
  const [nx, ny] = PATH_PTS[seg + 1];
  const mx = PATH_M.x((x + nx) / 2), my = PATH_M.y((y + ny) / 2);
  return (
    <g>
      <PathPoly upto={3} activeSeg={seg} />
      <Arw x={PATH_M.x(x)} y={PATH_M.y(y)} dx={PATH_M.x(nx) - PATH_M.x(x)} dy={PATH_M.y(ny) - PATH_M.y(y)} color={L.focus} w={2} />
      <Arw x={mx} y={my - 16} dx={24} dy={0} color={L.field} w={2.5} />
      <Lbl x={mx + 28} y={my - 12} text="F = 4 N" color={L.field} size={10} />
      <Lbl x={66} y={22} text={label} color={L.text} size={11} />
      <Lbl x={286} y={22} text={value} color={color} size={13} anchor="end" bold />
      <Lbl x={66} y={158} text={note} color={color} size={10.5} />
    </g>
  );
}

/** 1辺目: 同じ向きなので正。 */
export function WvSegPlus() {
  return (
    <LevelFig label="力と同じ向きに進む辺の仕事">
      <Axes m={PATH_M} xLabel="x [m]" yLabel="y [m]" />
      <WvSegment seg={0} label="1辺目: 右へ 3 m、θ = 0°" value="＋12 J" color={L.plus}
        note="cos 0° = 1。速さを増やす向きの受け渡し" />
      <Cap text="4 N × 3 m × 1 = 12 J。符号は正" />
    </LevelFig>
  );
}

/** 2辺目: 直角なので0。 */
export function WvSegZero() {
  return (
    <LevelFig label="力と直角に進む辺の仕事">
      <Axes m={PATH_M} xLabel="x [m]" yLabel="y [m]" />
      <WvSegment seg={1} label="2辺目: 上へ 2 m、θ = 90°" value="0 J" color={L.normal}
        note="cos 90° = 0。動いても受け渡しは起きない" />
      <Cap text="4 N × 2 m × 0 = 0 J。移動しても仕事は0" />
    </LevelFig>
  );
}

/** 3辺目: 逆向きなので負。 */
export function WvSegMinus() {
  return (
    <LevelFig label="力と逆向きに戻る辺の仕事">
      <Axes m={PATH_M} xLabel="x [m]" yLabel="y [m]" />
      <WvSegment seg={2} label="3辺目: 左へ 1 m、θ = 180°" value="−4 J" color={L.minus}
        note="cos 180° = −1。速さを減らす向きだった" />
      <Cap text="4 N × 1 m × (−1) = −4 J。符号は負" />
    </LevelFig>
  );
}

/** 合計と、全体の変位から出した値の一致。 */
export function WvTotal() {
  const t = useT();
  const shown = Math.min(step(t, 4, 1.0), 3);
  const vals = [12, 0, -4];
  const partial = vals.slice(0, shown).reduce((a, b) => a + b, 0);
  return (
    <LevelFig label="三辺の仕事の合計と全体の変位">
      <Axes m={PATH_M} xLabel="x [m]" yLabel="y [m]" />
      <PathPoly upto={shown} activeSeg={shown - 1} />
      <line x1={PATH_M.x(0)} y1={PATH_M.y(0.85)} x2={PATH_M.x(2)} y2={PATH_M.y(0.85)} stroke={L.plus} strokeWidth={2} />
      <line x1={PATH_M.x(2)} y1={PATH_M.y(0.7)} x2={PATH_M.x(2)} y2={PATH_M.y(1)} stroke={L.plus} strokeWidth={2} />
      <Lbl x={PATH_M.x(1)} y={PATH_M.y(0.85) - 7} text="全体の変位 2 m" color={L.plus} size={10.5} anchor="middle" />
      <Lbl x={66} y={22} text="12 ＋ 0 − 4" color={L.text} size={11.5} />
      <Lbl x={286} y={22} text={`${partial >= 0 ? '' : '−'}${Math.abs(partial)} J`} color={L.focus} size={13} anchor="end" bold />
      <Lbl x={66} y={158} text="4 N × 2 m = 8 J。同じ値になる" color={L.focus} size={10.5} />
      <Cap text="力が一定なら、辺ごとの和と全体の変位が一致する" />
    </LevelFig>
  );
}

/** cosθ の符号の切り替わり。 */
export function WvSignMap() {
  const [deg, setDeg] = useManual(time => 180 * pingPong(time, 9));
  const m = mapper([0, 180], [-1.3, 1.3], { x0: 58, y0: 40, x1: 256, y1: 138 });
  const c = Math.cos((deg * Math.PI) / 180);
  return (
    <>
      <LevelFig label="角度による仕事の符号の切り替わり">
        <rect x={m.x(0)} y={m.y(1.3)} width={m.x(90) - m.x(0)} height={m.y(0) - m.y(1.3)} fill={L.plus} opacity={0.16} />
        <rect x={m.x(90)} y={m.y(0)} width={m.x(180) - m.x(90)} height={m.y(-1.3) - m.y(0)} fill={L.minus} opacity={0.16} />
        <Axes m={m} xLabel="角 θ [度]" yLabel="cos θ" />
        <Curve m={m} f={d => Math.cos((d * Math.PI) / 180)} color={L.field} w={2.8} xa={0} xb={180} />
        <line x1={m.x(90)} y1={m.y(1.3)} x2={m.x(90)} y2={m.y(-1.3)} stroke={L.dim} strokeDasharray="4 3" strokeWidth={1.2} />
        <circle cx={m.x(deg)} cy={m.y(c)} r={5} fill={L.focus} />
        <Lbl x={m.x(45)} y={m.y(0.85)} text="正の仕事" color={L.plus} size={10.5} anchor="middle" />
        <Lbl x={m.x(140)} y={m.y(-1.08)} text="負の仕事" color={L.minus} size={10.5} anchor="middle" />
        <Lbl x={m.x(90)} y={m.y(1.3) - 6} text="90° が境目" color={L.dim} size={10} anchor="middle" />
        <Lbl x={66} y={158} text={`θ = ${Math.round(deg)}° のとき cos θ = ${fmt(c, 2)}`} color={L.focus} size={11} />
        <Cap text="符号を決めるのは力の強さではなく角度" />
      </LevelFig>
      <FigSlider label="力と移動のなす角 [度]" value={deg} min={0} max={180} step={1} onChange={setDeg} display={`${Math.round(deg)}°`} />
    </>
  );
}

// =====================================================================
// 5. um-work-energy — 仕事と運動エネルギーの関係
// =====================================================================

/** 前提と、扱わない場合。 */
export function WePremise() {
  const t = useT();
  const phase = step(t, 4, 1.1);
  const keep = ['質量 m が一定', '粒子は1個', '慣性系で見る', '運動は1本の軸に沿う'];
  const drop = ['質量変化', '多粒子系', '非慣性系'];
  return (
    <LevelFig label="導出で置く前提と扱わない場合">
      <Lbl x={20} y={26} text="前提として置くもの" color={L.plus} size={11} />
      {keep.map((k, i) => (
        <Card key={k} x={16 + (i % 2) * 148} y={34 + Math.floor(i / 2) * 30} w={140} h={24}
          color={L.plus} active={i === phase} text={k} size={10.5} />
      ))}
      <Lbl x={20} y={116} text="ここでは扱わないもの" color={L.minus} size={11} />
      {drop.map((d, i) => (
        <g key={d}>
          <rect x={16 + i * 96} y={124} width={88} height={22} rx={5} fill={L.minus} opacity={0.12}
            stroke={L.minus} strokeWidth={0.8} />
          <Lbl x={60 + i * 96} y={139} text={d} color={L.dim} size={10} anchor="middle" />
          <line x1={20 + i * 96} y1={145} x2={100 + i * 96} y2={125} stroke={L.minus} strokeWidth={1.2} opacity={0.7} />
        </g>
      ))}
      <Cap text="前提を外れた場面に、結論をそのまま持ち出さない" />
    </LevelFig>
  );
}

/** 出発点は運動方程式1本。 */
export function WeStart() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(3 * t);
  return (
    <LevelFig label="出発点に置く運動方程式">
      <Floor y={128} />
      <Box x={60} y={104} />
      <Arw x={94} y={116} dx={40} dy={0} color={L.field} w={3} />
      <Lbl x={96} y={106} text="合力 F" color={L.field} size={10.5} />
      <g opacity={glow}>
        <rect x={168} y={86} width={136} height={40} rx={8} fill={L.focus} opacity={0.24} stroke={L.focus} strokeWidth={1.4} />
        <Lbl x={236} y={112} text="F = ma" color={L.text} size={16} anchor="middle" bold />
      </g>
      <Lbl x={20} y={30} text="足す法則はこれ以外にない" color={L.text} size={11.5} />
      <Lbl x={20} y={52} text="この1本を、速さと位置の言葉へ" color={L.dim} size={10.5} />
      <Lbl x={20} y={72} text="書き換えていくだけで導ける" color={L.dim} size={10.5} />
      <Lbl x={236} y={146} text="ここから出発する" color={L.focus} size={10.5} anchor="middle" />
      <Cap text="新しい法則は足さない。式変形だけで進む" />
    </LevelFig>
  );
}

/** 時刻が主役の見方から、位置が主役の見方へ。 */
export function WeQuestion() {
  const t = useT();
  const side = step(t, 2, 1.8);
  const ml = mapper([0, 3], [0, 6], { x0: 42, y0: 50, x1: 138, y1: 118 });
  const mr = mapper([0, 3], [0, 6], { x0: 196, y0: 50, x1: 292, y1: 118 });
  const frame = (m: typeof ml, xl: string) => (
    <g>
      <line x1={m.x0 - 4} y1={m.y(0)} x2={m.x1 + 8} y2={m.y(0)} stroke={L.dim} strokeWidth={1.4} />
      <line x1={m.x0} y1={m.y1 + 4} x2={m.x0} y2={m.y0 - 8} stroke={L.dim} strokeWidth={1.4} />
      <Lbl x={m.x1 + 10} y={m.y(0) + 4} text={xl} color={L.dim} size={10.5} />
      <Lbl x={m.x0 - 6} y={m.y0 - 2} text="v" color={L.dim} size={10.5} anchor="end" />
    </g>
  );
  return (
    <LevelFig label="時刻を主役にした見方と位置を主役にした見方">
      <g opacity={side === 0 ? 1 : 0.35}>
        {frame(ml, 't')}
        <Curve m={ml} f={x => 1 + 1.4 * x} color={L.field} w={2.4} xa={0} xb={3} />
        <Lbl x={90} y={136} text="時刻が主役" color={side === 0 ? L.focus : L.dim} size={11} anchor="middle" />
      </g>
      <g opacity={side === 1 ? 1 : 0.35}>
        {frame(mr, 'x')}
        <Curve m={mr} f={x => Math.sqrt(1 + 3.2 * x)} color={L.plus} w={2.4} xa={0} xb={3} />
        <Lbl x={244} y={136} text="位置が主役" color={side === 1 ? L.focus : L.dim} size={11} anchor="middle" />
      </g>
      <Arw x={152} y={84} dx={30} dy={0} color={L.focus} w={2.5} />
      <Lbl x={167} y={76} text="?" color={L.minus} size={14} anchor="middle" bold />
      <Lbl x={20} y={30} text="知りたいのは「どこまで動いたら速さがいくつか」" color={L.text} size={10.5} />
      <Lbl x={160} y={156} text="時刻 t を式から消したい" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="同じ運動を、時刻ではなく位置から見直したい" />
    </LevelFig>
  );
}

/** 加速度の定義は、v-t曲線の傾き。 */
export function WeADef() {
  const t = useT();
  const u = pingPong(t, 6);
  const m = mapper([0, 3], [0, 8], { x0: 60, y0: 40, x1: 256, y1: 136 });
  const f = (x: number) => 2 + 1.6 * x;
  const tp = 0.4 + 2.2 * u;
  return (
    <LevelFig label="速度と時刻のグラフの傾きが加速度">
      <Axes m={m} xLabel="時刻 t [s]" yLabel="速度 v [m/s]" />
      <Curve m={m} f={f} color={L.field} w={2.6} xa={0} xb={3} />
      <line x1={m.x(tp - 0.6)} y1={m.y(f(tp - 0.6))} x2={m.x(tp + 0.6)} y2={m.y(f(tp + 0.6))} stroke={L.focus} strokeWidth={2.6} />
      <circle cx={m.x(tp)} cy={m.y(f(tp))} r={5} fill={L.focus} />
      <Lbl x={66} y={22} text="a = dv / dt は、この傾きのこと" color={L.text} size={11} />
      <Lbl x={m.x(tp) + 8} y={m.y(f(tp)) + 18} text="接線の傾き" color={L.focus} size={10.5} />
      <Lbl x={66} y={156} text="この定義を入れると F = m dv/dt" color={L.dim} size={10.5} />
      <Cap text="加速度の定義を入れただけ。中身は変えていない" />
    </LevelFig>
  );
}

/** dt = dx / v と、v ≠ 0 の断り。 */
export function WeDtSwap() {
  const t = useT();
  const blink = 0.78 + 0.2 * Math.sin(4 * t);
  return (
    <LevelFig label="微小時間を微小変位で置き換える">
      <line x1={30} y1={96} x2={290} y2={96} stroke={L.path} strokeWidth={2.5} />
      <rect x={140} y={86} width={42} height={20} fill={L.focus} opacity={0.6} />
      <line x1={140} y1={78} x2={140} y2={114} stroke={L.focus} strokeWidth={1.6} />
      <line x1={182} y1={78} x2={182} y2={114} stroke={L.focus} strokeWidth={1.6} />
      <Lbl x={161} y={128} text="dx" color={L.focus} size={11.5} anchor="middle" />
      <Arw x={140} y={70} dx={42} dy={0} color={L.field} w={2.5} />
      <Lbl x={186} y={68} text="速さ v で通過" color={L.field} size={10.5} />
      <Lbl x={20} y={30} text="この幅を通るのにかかる時間が dt" color={L.text} size={11} />
      <Lbl x={20} y={50} text="dt = dx / v" color={L.focus} size={13.5} />
      <g opacity={blink}>
        <rect x={166} y={138} width={136} height={22} rx={5} fill={L.minus} opacity={0.2} stroke={L.minus} strokeWidth={1} />
        <Lbl x={234} y={153} text="v = 0 では割れない" color={L.minus} size={11} anchor="middle" />
      </g>
      <Lbl x={20} y={152} text="速さが0でない区間で考える" color={L.dim} size={10.5} />
      <Cap text="分母に v が来るので、v ≠ 0 を断っておく" />
    </LevelFig>
  );
}

/** dt を dx/v で置き換える。分母が分数になる。 */
export function WeSubstitute() {
  const t = useT();
  const glow = 0.62 + 0.3 * Math.sin(3 * t);
  return (
    <LevelFig label="分母のdtをdx割るvで置き換える">
      <Lbl x={20} y={28} text="分母の dt に、dx / v を入れる" color={L.text} size={11.5} />
      <g opacity={glow}>
        <rect x={182} y={40} width={122} height={26} rx={6} fill={L.focus} opacity={0.24} stroke={L.focus} strokeWidth={1.3} />
        <Lbl x={243} y={58} text="dt = dx / v" color={L.text} size={12} anchor="middle" />
      </g>
      <Arw x={206} y={68} dx={-26} dy={40} color={L.focus} w={2} head={6} />
      <Lbl x={94} y={102} text="a =" color={L.text} size={15} anchor="end" />
      <Lbl x={152} y={92} text="dv" color={L.text} size={14} anchor="middle" />
      <line x1={112} y1={102} x2={192} y2={102} stroke={L.text} strokeWidth={1.6} />
      <Lbl x={152} y={120} text="dx / v" color={L.focus} size={14} anchor="middle" />
      <Lbl x={160} y={150} text="分母が分数になった形。次に整理する" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="置き換えただけで、式の中身は変えていない" />
    </LevelFig>
  );
}

/** 両辺に dx を掛ける。 */
export function WeTimesDx() {
  const t = useT();
  const done = step(t, 2, 1.6) === 1;
  return (
    <LevelFig label="両辺にdxを掛ける一手">
      <Lbl x={20} y={26} text="両辺に dx を掛ける" color={L.text} size={11.5} />
      <Card x={38} y={40} w={244} h={28} color={L.dim} active={!done} text="F  =  m v dv / dx" size={13} />
      {[100, 226].map(x => (
        <g key={x}>
          <Arw x={x} y={74} dx={0} dy={22} color={L.focus} w={2} head={6} />
          <Lbl x={x + 8} y={90} text="× dx" color={L.focus} size={11} />
        </g>
      ))}
      <Card x={38} y={102} w={244} h={28} color={L.focus} active={done} text="F dx  =  m v dv" size={13} />
      <Lbl x={160} y={152} text="右辺の分母にあった dx が消えた" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="左右に同じものを掛けたので、等号は保たれる" />
    </LevelFig>
  );
}

/** 両辺を、始点から終点まで積分する。 */
export function WeIntegrateBoth() {
  const t = useT();
  const shown = step(t, 2, 1.6);
  return (
    <LevelFig label="両辺に始点から終点までの積分を付ける">
      <Lbl x={20} y={26} text="両辺を、始点から終点まで足し集める" color={L.text} size={11.5} />
      <Card x={38} y={40} w={244} h={28} color={L.dim} active={shown === 0} text="F dx  =  m v dv" size={13} />
      <Arw x={160} y={74} dx={0} dy={20} color={L.focus} w={2} head={6} />
      <Lbl x={168} y={90} text="∫ を付ける" color={L.focus} size={10.5} />
      <g opacity={shown === 1 ? 1 : 0.35}>
        <rect x={24} y={100} width={272} height={34} rx={7} fill={L.focus} opacity={0.24} stroke={L.focus} strokeWidth={1.3} />
        <Lbl x={160} y={122} text="∫ F dx  =  ∫ m v dv" color={L.text} size={13.5} anchor="middle" />
      </g>
      <Lbl x={54} y={150} text="xi → xf" color={L.path} size={10.5} anchor="middle" />
      <Lbl x={220} y={150} text="vi → vf" color={L.plus} size={10.5} anchor="middle" />
      <Cap text="範囲は、左辺が位置、右辺が速さで付ける" />
    </LevelFig>
  );
}

/** 連鎖律で a = v dv/dx。 */
export function WeChain() {
  const t = useT();
  const phase = step(t, 3, 1.4);
  const rows = [
    'a = dv/dt',
    'dt を dx/v で置き換える',
    'a = v dv/dx',
  ];
  return (
    <LevelFig label="連鎖律で加速度を位置の言葉に直す">
      {rows.map((row, i) => (
        <Card key={row} x={22} y={32 + i * 36} w={276} h={28}
          color={i === 2 ? L.focus : L.normal} active={i === phase} text={row} size={12} />
      ))}
      {[0, 1].map(i => (
        <Arw key={i} x={160} y={60 + i * 36} dx={0} dy={10} color={L.dim} w={1.6} head={5} />
      ))}
      <Lbl x={160} y={156} text="連鎖律 dv/dt = (dv/dx)(dx/dt) でも同じ形" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="位置が主役になり、時刻が式から消える" />
    </LevelFig>
  );
}

/** 時刻が消えた運動方程式。 */
export function WeEqX() {
  const t = useT();
  const glow = 0.5 + 0.4 * Math.sin(3 * t);
  return (
    <LevelFig label="時刻を含まない形の運動方程式">
      <rect x={30} y={44} width={110} height={34} rx={7} fill={L.dim} opacity={0.18} />
      <Lbl x={85} y={66} text="F = m dv/dt" color={L.dim} size={12} anchor="middle" />
      <Arw x={146} y={61} dx={26} dy={0} color={L.focus} w={2.2} head={7} />
      <rect x={178} y={44} width={118} height={34} rx={7} fill={L.focus} opacity={0.26} stroke={L.focus} strokeWidth={1.4} />
      <Lbl x={237} y={66} text="F = m v dv/dx" color={L.text} size={12} anchor="middle" />
      <g opacity={glow}>
        <Lbl x={160} y={104} text="時刻 t が式から消えた" color={L.plus} size={12.5} anchor="middle" bold />
      </g>
      <Lbl x={160} y={128} text="残ったのは 力・速さ・位置 の3つだけ" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={160} y={150} text="次は、両辺に dx を掛ける" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="同じ運動方程式を、位置の言葉で書き直した形" />
    </LevelFig>
  );
}

/** F dx は微小仕事、mv dv は運動エネルギーの増分。 */
export function WeFdx() {
  const t = useT();
  const side = step(t, 2, 1.7);
  const ml = mapper([0, 3], [0, 4], { x0: 30, y0: 52, x1: 142, y1: 120 });
  const mr = mapper([0, 3], [0, 4], { x0: 186, y0: 52, x1: 298, y1: 120 });
  return (
    <LevelFig label="微小な仕事と運動エネルギーの増分">
      <g opacity={side === 0 ? 1 : 0.4}>
        <Curve m={ml} f={x => 1.2 + 0.7 * x} color={L.field} w={2.2} xa={0} xb={3} />
        <Bar m={ml} x0={1.3} x1={1.7} height={2.15} active />
        <line x1={ml.x0 - 4} y1={ml.y(0)} x2={ml.x1} y2={ml.y(0)} stroke={L.dim} strokeWidth={1.2} />
        <Lbl x={86} y={136} text="F dx = 微小な仕事" color={side === 0 ? L.focus : L.dim} size={10.5} anchor="middle" />
        <Lbl x={86} y={44} text="縦 F、横 dx" color={L.dim} size={10} anchor="middle" />
      </g>
      <g opacity={side === 1 ? 1 : 0.4}>
        <Curve m={mr} f={x => 1.1 * x} color={L.plus} w={2.2} xa={0} xb={3} />
        <Bar m={mr} x0={1.3} x1={1.7} height={1.65} active color={L.plus} />
        <line x1={mr.x0 - 4} y1={mr.y(0)} x2={mr.x1} y2={mr.y(0)} stroke={L.dim} strokeWidth={1.2} />
        <Lbl x={242} y={136} text="mv dv = K の増分" color={side === 1 ? L.focus : L.dim} size={10.5} anchor="middle" />
        <Lbl x={242} y={44} text="縦 mv、横 dv" color={L.dim} size={10} anchor="middle" />
      </g>
      <Lbl x={160} y={86} text="=" color={L.focus} size={18} anchor="middle" bold />
      <Lbl x={20} y={28} text="両辺に dx を掛けると F dx = mv dv" color={L.text} size={11} />
      <Cap text="仕事とエネルギーが、1本の等号で結ばれた" />
    </LevelFig>
  );
}

/** 積分範囲は、左右で別の変数。 */
export function WeLimits() {
  const t = useT();
  const glow = 0.55 + 0.35 * Math.sin(3 * t);
  return (
    <LevelFig label="左辺と右辺で積分変数と範囲が違うこと">
      <rect x={16} y={48} width={130} height={46} rx={7} fill={L.path} opacity={0.18} stroke={L.path} strokeWidth={1} />
      <Lbl x={81} y={68} text="∫ F dx" color={L.text} size={13} anchor="middle" />
      <Lbl x={81} y={86} text="xi から xf まで" color={L.path} size={10.5} anchor="middle" />
      <Lbl x={160} y={76} text="=" color={L.focus} size={18} anchor="middle" bold />
      <rect x={174} y={48} width={130} height={46} rx={7} fill={L.plus} opacity={0.18} stroke={L.plus} strokeWidth={1} />
      <Lbl x={239} y={68} text="∫ mv dv" color={L.text} size={13} anchor="middle" />
      <Lbl x={239} y={86} text="vi から vf まで" color={L.plus} size={10.5} anchor="middle" />
      <g opacity={glow}>
        <line x1={81} y1={100} x2={81} y2={118} stroke={L.focus} strokeWidth={1.4} />
        <line x1={239} y1={100} x2={239} y2={118} stroke={L.focus} strokeWidth={1.4} />
        <line x1={81} y1={118} x2={239} y2={118} stroke={L.focus} strokeWidth={1.4} />
        <Lbl x={160} y={134} text="同じ時刻の始点と終点を対にする" color={L.focus} size={11} anchor="middle" />
      </g>
      <Lbl x={20} y={30} text="積分変数が違えば、範囲の書き方も違う" color={L.text} size={11} />
      <Lbl x={160} y={156} text="範囲を書かないと、差が取れない" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="左辺は位置の範囲、右辺は速さの範囲" />
    </LevelFig>
  );
}

/** 運動エネルギーは、mv の下の三角形の差。 */
export function WeResult() {
  const m = mapper([0, 6], [0, 14], { x0: 58, y0: 40, x1: 244, y1: 136 });
  const vi = 2, vf = 5, mass = 2;
  return (
    <LevelFig label="速さの二乗の差として出る運動エネルギー">
      <Axes m={m} xLabel="速さ v [m/s]" yLabel="mv [kg·m/s]" />
      <polygon points={`${m.x(0)},${m.y(0)} ${m.x(vf)},${m.y(0)} ${m.x(vf)},${m.y(mass * vf)}`} fill={L.focus} opacity={0.32} />
      <polygon points={`${m.x(0)},${m.y(0)} ${m.x(vi)},${m.y(0)} ${m.x(vi)},${m.y(mass * vi)}`} fill={L.minus} opacity={0.4} />
      <Curve m={m} f={v => mass * v} color={L.field} w={2.6} xa={0} xb={6} />
      <Lbl x={66} y={22} text="m = 2 kg。面積 ½mv² の差だけが残る" color={L.text} size={11} />
      <Lbl x={m.x(vi)} y={m.y(0) + 14} text="vi = 2" color={L.minus} size={10} anchor="middle" />
      <Lbl x={m.x(vf)} y={m.y(0) + 14} text="vf = 5" color={L.focus} size={10} anchor="middle" />
      <Lbl x={m.x(3.6)} y={m.y(3.4)} text="W = 25 − 4 = 21 J" color={L.focus} size={11.5} anchor="middle" bold />
      <Cap text="運動エネルギーは、速さの2乗の差で決まる" />
    </LevelFig>
  );
}

/** W は合力のした仕事。 */
export function WeNet() {
  const t = useT();
  const u = pingPong(t, 6);
  const push = 6, fric = 2 + 6 * u;
  const net = push - fric;
  return (
    <LevelFig label="押す力と摩擦の合力がする仕事">
      <Floor y={130} />
      <Box x={132} y={106} />
      <Arw x={92} y={118} dx={36} dy={0} color={L.plus} w={3} />
      <Lbl x={90} y={108} text={`押す ${push} N`} color={L.plus} size={10.5} anchor="end" />
      <Arw x={132} y={126} dx={-Math.max(fric * 5, 8)} dy={0} color={L.minus} w={3} />
      <Lbl x={130} y={150} text={`摩擦 ${fmt(fric, 1)} N`} color={L.minus} size={10.5} anchor="end" />
      <Arw x={172} y={96} dx={net * 6} dy={0} color={L.focus} w={3.5} />
      <Lbl x={176} y={88} text={`合力 ${fmt(net, 1)} N`} color={L.focus} size={11} />
      <Lbl x={20} y={30} text="W は、両方の仕事を合わせた値" color={L.text} size={11.5} />
      <Lbl x={20} y={50} text={net >= 0 ? 'ΔK は正: 速くなる' : 'ΔK は負: 遅くなる'}
        color={net >= 0 ? L.plus : L.minus} size={11.5} />
      <Lbl x={300} y={30} text="W = ΔK" color={L.focus} size={13} anchor="end" bold />
      <Cap text="左辺のFは合力。個々の力の仕事ではない" />
    </LevelFig>
  );
}

// =====================================================================
// 6. um-potential-slope — 力はポテンシャルの傾き
// =====================================================================

const U_M = mapper([-0.12, 0.12], [0, 1.8], { x0: 52, y0: 40, x1: 258, y1: 130 });

/** 縮めた仕事がたまる。 */
export function PsStore() {
  const t = useT();
  const u = pingPong(t, 6);
  const comp = 0.1 * u;
  const tip = 200 - comp * 900;
  const stored = 0.5 * 200 * comp * comp;
  return (
    <LevelFig label="ばねを縮めるとエネルギーがたまる">
      <line x1={40} y1={56} x2={40} y2={120} stroke={L.dim} strokeWidth={3} />
      <Spring x0={40} x1={tip} y={88} />
      <Box x={tip} y={76} w={24} h={24} />
      <Arw x={tip + 52} y={88} dx={-22} dy={0} color={L.field} w={3} />
      <Lbl x={tip + 56} y={78} text="縮める" color={L.field} size={10.5} />
      <rect x={40} y={126} width={220} height={14} rx={4} fill={L.dim} opacity={0.25} />
      <rect x={40} y={126} width={220 * (stored / 1.0)} height={14} rx={4} fill={L.focus} opacity={0.8} />
      <Lbl x={266} y={137} text={`${stored.toFixed(2)} J`} color={L.focus} size={11} />
      <Lbl x={20} y={30} text={`縮み ${comp.toFixed(3)} m。k = 200 N/m`} color={L.text} size={11.5} />
      <Lbl x={20} y={158} text="手を離すと、この分が運動に戻る" color={L.dim} size={10.5} />
      <Cap text="位置だけで決まる「戻せる量」がある" />
    </LevelFig>
  );
}

/** dU = −F dx の定義。 */
export function PsDef() {
  const t = useT();
  const side = step(t, 2, 1.7);
  return (
    <LevelFig label="ポテンシャルの増分の決め方">
      <rect x={16} y={48} width={128} height={44} rx={7} fill={L.field} opacity={side === 0 ? 0.28 : 0.12}
        stroke={L.field} strokeWidth={side === 0 ? 1.4 : 0.8} />
      <Lbl x={80} y={68} text="力のした仕事" color={L.text} size={11} anchor="middle" />
      <Lbl x={80} y={85} text="F dx" color={L.field} size={12.5} anchor="middle" />
      <Arw x={150} y={70} dx={22} dy={0} color={L.focus} w={2.2} head={7} />
      <Lbl x={161} y={54} text="符号を反転" color={L.focus} size={9.5} anchor="middle" />
      <rect x={178} y={48} width={128} height={44} rx={7} fill={L.plus} opacity={side === 1 ? 0.28 : 0.12}
        stroke={L.plus} strokeWidth={side === 1 ? 1.4 : 0.8} />
      <Lbl x={242} y={68} text="U の増分" color={L.text} size={11} anchor="middle" />
      <Lbl x={242} y={85} text="dU = −F dx" color={L.plus} size={12.5} anchor="middle" />
      <Lbl x={20} y={30} text="小さな移動 dx ごとに、1組ずつ対応する" color={L.text} size={11} />
      <Lbl x={160} y={118} text="力に逆らって動かした分だけ U が増える" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={160} y={142} text="基準点を1つ決めて、そこで U = 0 とする" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="Uの増分は、力のした仕事の符号を変えたもの" />
    </LevelFig>
  );
}

/** 負号の意味。 */
export function PsSign() {
  const t = useT();
  const glow = 0.55 + 0.35 * Math.sin(3 * t);
  return (
    <LevelFig label="定義の負号が果たす役割">
      <Floor y={104} x0={30} x1={290} />
      <Arw x={190} y={92} dx={-46} dy={0} color={L.path} w={3} />
      <Lbl x={192} y={88} text="縮める向きに動かす" color={L.path} size={10.5} />
      <Arw x={144} y={118} dx={46} dy={0} color={L.field} w={3} />
      <Lbl x={192} y={122} text="ばねの力は逆向き" color={L.field} size={10.5} />
      <Lbl x={20} y={30} text="ばねの力がした仕事は負になる" color={L.text} size={11} />
      <Card x={20} y={132} w={124} h={24} color={L.minus} active text="F dx = −1.0 J" size={11} />
      <g opacity={glow}>
        <Card x={176} y={132} w={124} h={24} color={L.plus} active text="dU = ＋1.0 J" size={11} />
      </g>
      <Arw x={150} y={144} dx={20} dy={0} color={L.focus} w={2} head={6} />
      <Lbl x={20} y={54} text="そのままでは、たまった量が負の数になる" color={L.dim} size={10.5} />
      <Cap text="負号は、たまった分を正の数で表すための約束" />
    </LevelFig>
  );
}

/** ばねのUは三角形の面積。 */
export function PsSpringU() {
  const t = useT();
  const u = pingPong(t, 6);
  const xe = 0.1 * u;
  const m = mapper([0, 0.12], [0, 26], { x0: 58, y0: 40, x1: 256, y1: 136 });
  return (
    <LevelFig label="ばねのポテンシャルは三角形の面積">
      <Axes m={m} xLabel="伸び x [m]" yLabel="kx [N]" />
      <polygon points={`${m.x(0)},${m.y(0)} ${m.x(xe)},${m.y(0)} ${m.x(xe)},${m.y(200 * xe)}`} fill={L.plus} opacity={0.42} />
      <Curve m={m} f={x => 200 * x} color={L.field} w={2.6} xa={0} xb={0.12} />
      <Lbl x={66} y={22} text="dU = kx dx を 0 から x まで足す" color={L.text} size={11} />
      <Lbl x={m.x(0.062)} y={m.y(5)} text={`U = ${(0.5 * 200 * xe * xe).toFixed(2)} J`} color={L.focus} size={12} anchor="middle" bold />
      <Lbl x={66} y={156} text="U = ½kx²。三角形の面積と同じ形" color={L.plus} size={11} />
      <Cap text="負号が2つ重なって、被積分関数は正の kx になる" />
    </LevelFig>
  );
}

/** ばねの力を定義に入れる。負号が2つ重なる。 */
export function PsSpringSub() {
  const t = useT();
  const phase = step(t, 3, 1.3);
  return (
    <LevelFig label="ばねの力を定義に入れて負号が二つ重なる">
      <Lbl x={20} y={26} text="定義の F に、ばねの力を入れる" color={L.text} size={11.5} />
      <Card x={20} y={40} w={132} h={28} color={L.plus} active={phase === 0} text="dU = − F dx" size={12.5} />
      <Card x={168} y={40} w={132} h={28} color={L.field} active={phase === 0} text="F = − k x" size={12.5} />
      <Arw x={234} y={72} dx={-64} dy={22} color={L.focus} w={2} head={6} />
      <g opacity={phase >= 1 ? 1 : 0.25}>
        <rect x={24} y={98} width={272} height={30} rx={7} fill={L.focus} opacity={phase === 1 ? 0.28 : 0.16}
          stroke={L.focus} strokeWidth={1.2} />
        <Lbl x={160} y={118} text="dU = −(−k x) dx" color={L.text} size={13} anchor="middle" />
      </g>
      <Lbl x={160} y={150} text={phase >= 2 ? '負号が2つで正 → dU = k x dx' : '負号が2つ並んでいる'}
        color={phase >= 2 ? L.focus : L.minus} size={11.5} anchor="middle" bold={phase >= 2} />
      <Cap text="力の向きの負号と、定義の負号が打ち消し合う" />
    </LevelFig>
  );
}

/** Uの式から力を取り戻せるか。 */
export function PsRecover() {
  const t = useT();
  const blink = 0.78 + 0.2 * Math.sin(4 * t);
  return (
    <LevelFig label="ポテンシャルの式から力を取り戻せるか">
      <Axes m={U_M} xLabel="位置 x [m]" yLabel="U [J]" />
      <Curve m={U_M} f={x => 100 * x * x} color={L.plus} w={2.8} xa={-0.12} xb={0.12} />
      <Lbl x={66} y={22} text="U = ½kx² は位置だけの関数" color={L.text} size={11} />
      <g opacity={blink}>
        <Lbl x={230} y={62} text="ここから F を読めるか?" color={L.minus} size={11.5} anchor="end" />
      </g>
      <Lbl x={66} y={156} text="dU = −F dx を、逆にたどればよい" color={L.dim} size={10.5} />
      <Cap text="力の情報が U の中に全部入っているかを確かめる" />
    </LevelFig>
  );
}

/** F = −dU/dx。接線の傾き。 */
export function PsSlope() {
  const [xp, setXp] = useManual(time => -0.09 + 0.18 * pingPong(time, 8));
  const slope = 200 * xp;
  return (
    <>
      <LevelFig label="ポテンシャルの傾きと力の向き">
        <Axes m={U_M} xLabel="位置 x [m]" yLabel="U [J]" />
        <Curve m={U_M} f={x => 100 * x * x} color={L.plus} w={2.6} xa={-0.12} xb={0.12} />
        <line x1={U_M.x(xp - 0.035)} y1={U_M.y(100 * xp * xp - 0.035 * slope)}
          x2={U_M.x(xp + 0.035)} y2={U_M.y(100 * xp * xp + 0.035 * slope)}
          stroke={L.focus} strokeWidth={2.6} />
        <circle cx={U_M.x(xp)} cy={U_M.y(100 * xp * xp)} r={5} fill={L.focus} />
        <Arw x={U_M.x(xp)} y={140} dx={slope > 0 ? -26 : 26} dy={0} color={L.field} w={3} />
        <Lbl x={66} y={22} text={`傾き dU/dx = ${fmt(slope, 1)} N`} color={L.focus} size={11} />
        <Lbl x={66} y={158} text={`F = −dU/dx = ${fmt(-slope, 1)} N`} color={L.field} size={11} />
        <Lbl x={U_M.x(0)} y={U_M.y(0) - 8} text="傾き 0" color={L.dim} size={9.5} anchor="middle" />
        <Cap text="接線が急なほど力は強い。傾きと力は逆符号" />
      </LevelFig>
      <FigSlider label="見ている位置 [m]" value={xp} min={-0.1} max={0.1} step={0.005} onChange={setXp} display={`${xp.toFixed(3)} m`} />
    </>
  );
}

/** U を微分すると元の力に戻る。 */
export function PsDifferentiate() {
  const t = useT();
  const u = pingPong(t, 6);
  const xp = -0.1 + 0.2 * u;
  const mu = mapper([-0.12, 0.12], [0, 1.8], { x0: 52, y0: 32, x1: 288, y1: 82 });
  const mf = mapper([-0.12, 0.12], [-26, 26], { x0: 52, y0: 92, x1: 288, y1: 142 });
  return (
    <LevelFig label="ポテンシャルを微分すると復元力に戻る">
      <Curve m={mu} f={x => 100 * x * x} color={L.plus} w={2.4} xa={-0.12} xb={0.12} />
      <line x1={mu.x(-0.12)} y1={mu.y(0)} x2={mu.x(0.12)} y2={mu.y(0)} stroke={L.dim} strokeWidth={1.2} />
      <Lbl x={294} y={mu.y(0) - 4} text="U" color={L.plus} size={10.5} anchor="end" />
      <circle cx={mu.x(xp)} cy={mu.y(100 * xp * xp)} r={4} fill={L.focus} />
      <line x1={mf.x(-0.12)} y1={mf.y(0)} x2={mf.x(0.12)} y2={mf.y(0)} stroke={L.dim} strokeWidth={1.2} />
      <Curve m={mf} f={x => -200 * x} color={L.field} w={2.4} xa={-0.12} xb={0.12} />
      <Lbl x={294} y={mf.y(0) - 4} text="F" color={L.field} size={10.5} anchor="end" />
      <circle cx={mf.x(xp)} cy={mf.y(-200 * xp)} r={4} fill={L.focus} />
      <line x1={mu.x(xp)} y1={mu.y(100 * xp * xp) + 6} x2={mf.x(xp)} y2={mf.y(-200 * xp) - 6}
        stroke={L.focus} strokeDasharray="3 3" strokeWidth={1.2} />
      <Lbl x={20} y={24} text="U = ½kx² を微分して負号を付ける" color={L.text} size={10.5} />
      <Lbl x={20} y={158} text={`x = ${xp.toFixed(3)} m で F = ${fmt(-200 * xp, 1)} N`} color={L.focus} size={11} />
      <Cap text="出発点のばねの力 F = −kx と一致する" />
    </LevelFig>
  );
}

/** 力は谷底を向く。 */
export function PsValley() {
  const t = useT();
  const u = Math.cos(1.6 * t);
  const xp = 0.095 * u;
  const slope = 200 * xp;
  return (
    <LevelFig label="ポテンシャルの谷を転がる物体">
      <Axes m={U_M} xLabel="位置 x [m]" yLabel="U [J]" />
      <Curve m={U_M} f={x => 100 * x * x} color={L.plus} w={2.8} xa={-0.12} xb={0.12} />
      <circle cx={U_M.x(xp)} cy={U_M.y(100 * xp * xp) - 6} r={6} fill={L.path} />
      <Arw x={U_M.x(xp)} y={U_M.y(100 * xp * xp) + 12} dx={slope > 0 ? -24 : 24} dy={0} color={L.field} w={2.8} />
      <Lbl x={66} y={22} text="力は U が減る向き、つまり谷底へ" color={L.text} size={11} />
      <circle cx={U_M.x(0)} cy={U_M.y(0)} r={4} fill={L.focus} />
      <Lbl x={66} y={158} text="谷底は傾き0。力もはたらかない点" color={L.focus} size={10.5} />
      <Cap text="力は U の坂を下る向きを向く" />
    </LevelFig>
  );
}

/** 摩擦の仕事は経路で変わる。 */
export function PsFriction() {
  const t = useT();
  const which = step(t, 2, 2.0);
  const ax = 60, ay = 116, bx = 236;
  return (
    <LevelFig label="まっすぐ進む道と遠回りの道での摩擦の仕事">
      <Floor y={136} x0={30} x1={296} />
      <circle cx={ax} cy={ay} r={5} fill={L.path} />
      <Lbl x={ax - 6} y={ay + 18} text="A" color={L.path} size={11} anchor="end" />
      <circle cx={bx} cy={ay} r={5} fill={L.path} />
      <Lbl x={bx + 8} y={ay + 18} text="B" color={L.path} size={11} />
      {which === 0 ? (
        <g>
          <line x1={ax} y1={ay} x2={bx} y2={ay} stroke={L.focus} strokeWidth={3.5} />
          <Lbl x={20} y={30} text="道1: まっすぐ 2 m 進む" color={L.text} size={11.5} />
          <Lbl x={20} y={52} text="摩擦の仕事 = −2.0 J" color={L.minus} size={12.5} bold />
        </g>
      ) : (
        <g>
          <polyline points={`${ax},${ay} ${ax + 44},${ay - 48} ${ax + 88},${ay - 12} ${ax + 132},${ay - 52} ${bx},${ay}`}
            fill="none" stroke={L.focus} strokeWidth={3.5} strokeLinejoin="round" />
          <Lbl x={20} y={30} text="道2: 遠回りして 6 m 歩く" color={L.text} size={11.5} />
          <Lbl x={20} y={52} text="摩擦の仕事 = −6.0 J" color={L.minus} size={12.5} bold />
        </g>
      )}
      <Lbl x={296} y={30} text="摩擦 1 N" color={L.field} size={10.5} anchor="end" />
      <Lbl x={160} y={158} text="同じ2点なのに、値がそろわない" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="道のりに比例して増えるので、位置だけでは決まらない" />
    </LevelFig>
  );
}

/** 保存力ならUを作れる。 */
export function PsConservative() {
  const t = useT();
  const side = step(t, 2, 1.8);
  return (
    <LevelFig label="保存力と非保存力の対比">
      <rect x={14} y={34} width={140} height={96} rx={8} fill={L.plus} opacity={side === 0 ? 0.22 : 0.09}
        stroke={L.plus} strokeWidth={side === 0 ? 1.5 : 0.8} />
      <Lbl x={84} y={54} text="保存力" color={L.plus} size={12} anchor="middle" bold />
      <Lbl x={84} y={76} text="ばね・重力" color={L.text} size={10.5} anchor="middle" />
      <Lbl x={84} y={96} text="仕事が道によらない" color={L.dim} size={10} anchor="middle" />
      <Lbl x={84} y={118} text="U を作れる" color={L.plus} size={11} anchor="middle" />
      <rect x={166} y={34} width={140} height={96} rx={8} fill={L.minus} opacity={side === 1 ? 0.22 : 0.09}
        stroke={L.minus} strokeWidth={side === 1 ? 1.5 : 0.8} />
      <Lbl x={236} y={54} text="そうでない力" color={L.minus} size={12} anchor="middle" bold />
      <Lbl x={236} y={76} text="摩擦・空気抵抗" color={L.text} size={10.5} anchor="middle" />
      <Lbl x={236} y={96} text="仕事が道で変わる" color={L.dim} size={10} anchor="middle" />
      <Lbl x={236} y={118} text="U を作れない" color={L.minus} size={11} anchor="middle" />
      <Lbl x={160} y={152} text="境目は「2点間の仕事が道によらないか」" color={L.focus} size={11} anchor="middle" />
      <Cap text="保存力でなければ、位置だけで決まる U は定義できない" />
    </LevelFig>
  );
}

// =====================================================================
// 7. um-momentum-change — 力積と運動量
// =====================================================================

const FT_BUMP = mapper([0, 0.012], [0, 1050], { x0: 58, y0: 40, x1: 256, y1: 136 });
const FT_WIDE = mapper([0, 0.12], [0, 700], { x0: 58, y0: 40, x1: 256, y1: 136 });
const bump = (s: number) => (s >= 0 && s <= 0.01 ? 942 * Math.sin((Math.PI * s) / 0.01) : 0);

/** 運動量 p = mv。 */
export function McP() {
  const [v, setV] = useManual(time => 8 + 12 * pingPong(time, 8));
  const p = 0.15 * v;
  return (
    <>
      <LevelFig label="質量かける速度で決まる運動量">
        <Floor y={124} />
        <circle cx={96} cy={110} r={13} fill={L.path} />
        <Lbl x={96} y={92} text="m = 0.15 kg" color={L.dim} size={10} anchor="middle" />
        <Arw x={112} y={110} dx={Math.max(v * 6, 10)} dy={0} color={L.field} w={3} />
        <Lbl x={118 + v * 6} y={106} text={`v = ${fmt(v, 1)} m/s`} color={L.field} size={11} />
        <rect x={40} y={140} width={230} height={14} rx={4} fill={L.dim} opacity={0.25} />
        <rect x={40} y={140} width={230 * (p / 3.6)} height={14} rx={4} fill={L.focus} opacity={0.85} />
        <Lbl x={276} y={151} text={`${fmt(p, 2)}`} color={L.focus} size={10.5} />
        <Lbl x={20} y={30} text="p = mv" color={L.text} size={13} />
        <Lbl x={20} y={52} text={`p = 0.15 × ${fmt(v, 1)} = ${fmt(p, 2)} kg·m/s`} color={L.focus} size={11.5} />
        <Cap text="速度が向きを持つので、運動量も向きを持つ" />
      </LevelFig>
      <FigSlider label="ボールの速さ [m/s]" value={v} min={0} max={24} step={0.5} onChange={setV} display={`${fmt(v, 1)} m/s`} />
    </>
  );
}

/** F = dp/dt。p-t グラフの傾き。 */
export function McDpdt() {
  const t = useT();
  const u = pingPong(t, 6);
  const m = mapper([0, 4], [0, 12], { x0: 58, y0: 40, x1: 256, y1: 136 });
  const f = (s: number) => 2 + 2 * s;
  const tp = 0.4 + 3.2 * u;
  return (
    <LevelFig label="運動量と時刻のグラフの傾きが力">
      <Axes m={m} xLabel="時刻 t [s]" yLabel="p [kg·m/s]" />
      <Curve m={m} f={f} color={L.field} w={2.6} xa={0} xb={4} />
      <line x1={m.x(tp - 0.7)} y1={m.y(f(tp - 0.7))} x2={m.x(tp + 0.7)} y2={m.y(f(tp + 0.7))} stroke={L.focus} strokeWidth={2.6} />
      <circle cx={m.x(tp)} cy={m.y(f(tp))} r={5} fill={L.focus} />
      <Lbl x={66} y={22} text="質量が一定なら m dv/dt = d(mv)/dt" color={L.text} size={10.5} />
      <Lbl x={m.x(tp) + 8} y={m.y(f(tp)) + 18} text="傾き = F" color={L.focus} size={10.5} />
      <Lbl x={66} y={156} text="力とは、運動量の1秒あたりの変化" color={L.dim} size={10.5} />
      <Cap text="F = dp/dt。運動方程式の書き換えにすぎない" />
    </LevelFig>
  );
}

/** 衝突中、力は刻々と変わる。 */
export function McVarying() {
  const t = useT();
  const blink = 0.78 + 0.2 * Math.sin(4 * t);
  const tp = 0.01 * ((t % 2.4) / 2.4);
  return (
    <LevelFig label="衝突のあいだ変化する力">
      <Axes m={FT_BUMP} xLabel="時刻 t [s]" yLabel="力 F [N]" />
      <Curve m={FT_BUMP} f={bump} color={L.field} w={2.8} xa={0} xb={0.012} />
      <circle cx={FT_BUMP.x(tp)} cy={FT_BUMP.y(bump(tp))} r={5} fill={L.focus} />
      <Lbl x={66} y={22} text="接触は 0.010 s のあいだだけ" color={L.text} size={11} />
      <Lbl x={FT_BUMP.x(tp) + 12} y={FT_BUMP.y(bump(tp)) - 10} text={`${Math.round(bump(tp))} N`} color={L.focus} size={10.5} />
      <g opacity={blink}>
        <Lbl x={160} y={156} text="どの瞬間の値を使えばよいのか" color={L.minus} size={11} anchor="middle" />
      </g>
      <Cap text="0 から急に大きくなり、また 0 に戻る" />
    </LevelFig>
  );
}

/** 短い区間の F Δt。 */
export function McPiece() {
  const t = useT();
  const n = 10, w = 0.01 / n;
  const i = step(t, n, 0.55);
  return (
    <LevelFig label="短い時間の区間ひとつぶんの運動量変化">
      <Axes m={FT_BUMP} xLabel="時刻 t [s]" yLabel="力 F [N]" />
      <Bar m={FT_BUMP} x0={i * w} x1={(i + 1) * w} height={bump((i + 0.5) * w)} active />
      <Curve m={FT_BUMP} f={bump} color={L.field} w={2.4} xa={0} xb={0.012} />
      <Lbl x={66} y={22} text="この幅の中では、力をほぼ一定とみなす" color={L.text} size={10.5} />
      <Lbl x={FT_BUMP.x((i + 0.5) * w)} y={FT_BUMP.y(bump((i + 0.5) * w)) - 8}
        text={`${Math.round(bump((i + 0.5) * w))} N`} color={L.focus} size={10} anchor="middle" />
      <Lbl x={66} y={156} text={`Δpᵢ ≈ Fᵢ Δtᵢ = ${(bump((i + 0.5) * w) * w).toFixed(3)} kg·m/s`} color={L.focus} size={11} />
      <Cap text="両辺に dt を掛けると dp = F dt。掛け算1回に戻る" />
    </LevelFig>
  );
}

/** 全部足すと面積 = Δp。 */
export function McSum() {
  const t = useT();
  const n = 20, w = 0.01 / n;
  const filled = Math.min(step(t, n + 4, 0.28) + 1, n);
  const sum = Array.from({ length: filled }, (_, i) => bump((i + 0.5) * w) * w).reduce((a, b) => a + b, 0);
  return (
    <LevelFig label="細かい区間を足し集めて力積にする">
      <Axes m={FT_BUMP} xLabel="時刻 t [s]" yLabel="力 F [N]" />
      {Array.from({ length: filled }, (_, i) => (
        <Bar key={i} m={FT_BUMP} x0={i * w} x1={(i + 1) * w} height={bump((i + 0.5) * w)} active={i === filled - 1} />
      ))}
      <Curve m={FT_BUMP} f={bump} color={L.field} w={2.4} xa={0} xb={0.012} />
      <Lbl x={66} y={22} text="足し集めた面積が力積" color={L.text} size={11} />
      <Lbl x={286} y={22} text={`${sum.toFixed(2)} kg·m/s`} color={L.focus} size={11.5} anchor="end" bold />
      <Lbl x={66} y={156} text="Σ Fᵢ Δtᵢ → ∫ F dt = Δp" color={L.focus} size={11} />
      <Cap text="力-時間グラフの面積が、運動量の変化にあたる" />
    </LevelFig>
  );
}

/** 跳ね返るボールの運動量の変化。 */
export function McBall() {
  const t = useT();
  const phase = (t % 3) / 3;
  const before = phase < 0.5;
  const s = before ? phase / 0.5 : (phase - 0.5) / 0.5;
  const bxp = before ? 60 + 150 * s : 210 - 150 * s;
  return (
    <LevelFig label="壁で跳ね返るボールの速度の符号">
      <rect x={226} y={44} width={22} height={92} fill={L.dim} opacity={0.5} />
      <Floor y={136} x0={24} x1={226} />
      <circle cx={bxp} cy={104} r={12} fill={L.path} />
      {before
        ? <Arw x={bxp + 14} y={104} dx={38} dy={0} color={L.minus} w={3} />
        : <Arw x={bxp - 14} y={104} dx={-38} dy={0} color={L.plus} w={3} />}
      <line x1={24} y1={148} x2={176} y2={148} stroke={L.dim} strokeWidth={1.2} />
      <Arw x={160} y={148} dx={-22} dy={0} color={L.dim} w={1.4} head={6} />
      <Lbl x={182} y={152} text="＋ の向き = 跳ね返る向き" color={L.dim} size={9.5} />
      <Lbl x={20} y={28} text={before ? '当たる前 v = −20 m/s' : '当たった後 v = ＋20 m/s'}
        color={before ? L.minus : L.plus} size={11.5} />
      <Lbl x={20} y={50} text="差は 20 − (−20) = 40 m/s" color={L.text} size={11} />
      <Lbl x={20} y={72} text="Δp = 0.15 × 40 = 6.0 kg·m/s" color={L.focus} size={12} bold />
      <Cap text="符号を落とすと、変化が半分になってしまう" />
    </LevelFig>
  );
}

/** 同じ運動量変化の跳ね返りで、接触時間を比較する。 */
export function McHard() {
  const t = useT();
  const u = pingPong(t, 5);
  return (
    <LevelFig label="接触時間が短いときの平均の力">
      <Axes m={FT_WIDE} xLabel="時刻 t [s]" yLabel="力 F [N]" />
      <rect x={FT_WIDE.x(0)} y={FT_WIDE.y(600)} width={FT_WIDE.x(0.01) - FT_WIDE.x(0)}
        height={FT_WIDE.y(0) - FT_WIDE.y(600)} fill={L.minus} opacity={0.5} />
      <line x1={FT_WIDE.x(0)} y1={FT_WIDE.y(600)} x2={FT_WIDE.x(0.01)} y2={FT_WIDE.y(600)} stroke={L.minus} strokeWidth={2.5} />
      <Lbl x={FT_WIDE.x(0.012) + 4} y={FT_WIDE.y(600) + 4} text="600 N" color={L.minus} size={11} />
      <Lbl x={FT_WIDE.x(0.012) + 4} y={FT_WIDE.y(280)} text="幅 0.010 s" color={L.path} size={10} />
      <Lbl x={66} y={22} text="0.010秒で跳ね返る" color={L.text} size={11.5} />
      <Lbl x={286} y={22} text={`面積 ${fmt(6 * u, 1)} / 6.0`} color={L.focus} size={10.5} anchor="end" />
      <Lbl x={66} y={156} text="6.0 ÷ 0.010 = 600 N" color={L.minus} size={11.5} />
      <Cap text="細くて高い長方形。同じ面積を短い幅で作る" />
    </LevelFig>
  );
}

/** 時間を伸ばすと力が小さい。 */
export function McSoft() {
  const t = useT();
  const u = pingPong(t, 5);
  return (
    <LevelFig label="接触時間が長いときの平均の力">
      <Axes m={FT_WIDE} xLabel="時刻 t [s]" yLabel="力 F [N]" />
      <rect x={FT_WIDE.x(0)} y={FT_WIDE.y(60)} width={FT_WIDE.x(0.1) - FT_WIDE.x(0)}
        height={FT_WIDE.y(0) - FT_WIDE.y(60)} fill={L.plus} opacity={0.5} />
      <line x1={FT_WIDE.x(0)} y1={FT_WIDE.y(60)} x2={FT_WIDE.x(0.1)} y2={FT_WIDE.y(60)} stroke={L.plus} strokeWidth={2.5} />
      <Lbl x={FT_WIDE.x(0.1)} y={FT_WIDE.y(60) - 8} text="60 N" color={L.plus} size={11} anchor="middle" />
      <Lbl x={FT_WIDE.x(0.05)} y={FT_WIDE.y(60) - 26} text="幅 0.10 s" color={L.path} size={10} anchor="middle" />
      <Lbl x={66} y={22} text="同じ速度まで0.10秒で跳ね返る" color={L.text} size={11.5} />
      <Lbl x={286} y={22} text={`面積 ${fmt(6 * u, 1)} / 6.0`} color={L.focus} size={10.5} anchor="end" />
      <Lbl x={66} y={156} text="6.0 ÷ 0.10 = 60 N" color={L.plus} size={11.5} />
      <Cap text="平たくて広い長方形。面積は同じ 6.0 のまま" />
    </LevelFig>
  );
}

/** 同じ面積での縦横の取り替え。 */
export function McCompare() {
  const t = useT();
  const which = step(t, 2, 1.8);
  return (
    <LevelFig label="同じ面積で縦と横を取り替えた二つの長方形">
      <Axes m={FT_WIDE} xLabel="時刻 t [s]" yLabel="力 F [N]" />
      <rect x={FT_WIDE.x(0)} y={FT_WIDE.y(60)} width={FT_WIDE.x(0.1) - FT_WIDE.x(0)}
        height={FT_WIDE.y(0) - FT_WIDE.y(60)} fill={L.plus} opacity={which === 1 ? 0.5 : 0.22} />
      <rect x={FT_WIDE.x(0)} y={FT_WIDE.y(600)} width={FT_WIDE.x(0.01) - FT_WIDE.x(0)}
        height={FT_WIDE.y(0) - FT_WIDE.y(600)} fill={L.minus} opacity={which === 0 ? 0.55 : 0.25} />
      <Lbl x={66} y={22} text="どちらも面積は 6.0 kg·m/s" color={L.text} size={11.5} />
      <Lbl x={FT_WIDE.x(0.02)} y={FT_WIDE.y(600) - 8} text="600 N × 0.010 s" color={L.minus} size={10} />
      <Lbl x={FT_WIDE.x(0.05)} y={FT_WIDE.y(60) - 8} text="60 N × 0.10 s" color={L.plus} size={10} anchor="middle" />
      <Lbl x={66} y={156} text={which === 0 ? '幅が狭いと、高さが上がる' : '幅を広げると、高さが下がる'}
        color={which === 0 ? L.minus : L.plus} size={11} />
      <Cap text="変わるのは縦と横の割り振りだけ" />
    </LevelFig>
  );
}

/** 平均の力は Δp / Δt。 */
export function McAverage() {
  const [dt, setDt] = useManual(time => 0.01 + 0.09 * pingPong(time, 8));
  const fbar = 6.0 / dt;
  const m = mapper([0, 0.12], [0, 700], { x0: 58, y0: 40, x1: 256, y1: 124 });
  const h = Math.min(fbar, 690);
  return (
    <>
      <LevelFig label="接触時間を変えたときの平均の力">
        <Axes m={m} xLabel="t [s]" yLabel="力 F [N]" />
        <rect x={m.x(0)} y={m.y(h)} width={m.x(dt) - m.x(0)} height={m.y(0) - m.y(h)} fill={L.focus} opacity={0.45} />
        <line x1={m.x(0)} y1={m.y(h)} x2={m.x(dt)} y2={m.y(h)} stroke={L.focus} strokeWidth={2.5} />
        <Lbl x={66} y={22} text="Δp = 6.0 kg·m/s は変えられない" color={L.text} size={10.5} />
        <Lbl x={m.x(dt) + 6} y={m.y(h) + 4} text={`F平均 = ${Math.round(fbar)} N`} color={L.focus} size={11.5} bold />
        <Lbl x={66} y={144} text={`接触 ${dt.toFixed(3)} s`} color={L.dim} size={10.5} />
        <Lbl x={286} y={158} text="時間を伸ばすほど低くなる" color={L.plus} size={10.5} anchor="end" />
        <Cap text="F平均 = Δp / Δt。面積を固定して幅を変える" />
      </LevelFig>
      <FigSlider label="接触している時間 [s]" value={dt} min={0.01} max={0.1} step={0.005} onChange={setDt} display={`${dt.toFixed(3)} s`} />
    </>
  );
}

// =====================================================================

export const um_mechFigures: Record<string, () => JSX.Element> = {
  'umm-nc-recall': NcRecall,
  'umm-nc-two-forces': NcTwoForces,
  'umm-nc-setup': NcSetup,
  'umm-nc-sign': NcSign,
  'umm-nc-second-derivative': NcSecondDerivative,
  'umm-nc-x-equation': NcXEquation,
  'umm-nc-y-equation': NcYEquation,
  'umm-nc-decompose': NcDecompose,
  'umm-nc-axis-choice': NcAxisChoice,
  'umm-nc-bundle': NcBundle,

  'umm-cf-const-a': CfConstA,
  'umm-cf-question': CfQuestion,
  'umm-cf-area': CfArea,
  'umm-cf-constant': CfConstant,
  'umm-cf-initial': CfInitial,
  'umm-cf-vt-line': CfVtLine,
  'umm-cf-vt-area': CfVtArea,
  'umm-cf-half': CfHalf,
  'umm-cf-x0': CfX0,
  'umm-cf-summary': CfSummary,

  'umm-ws-recap': WsRecap,
  'umm-ws-sigma': WsSigma,
  'umm-ws-spring': WsSpring,
  'umm-ws-line': WsLine,
  'umm-ws-bars': WsBars,
  'umm-ws-triangle': WsTriangle,
  'umm-ws-half-kx2': WsHalfKx2,
  'umm-ws-quadruple': WsQuadruple,
  'umm-ws-integral': WsIntegral,

  'umm-wv-recall': WvRecall,
  'umm-wv-cos': WvCos,
  'umm-wv-dot': WvDot,
  'umm-wv-path': WvPath,
  'umm-wv-seg-plus': WvSegPlus,
  'umm-wv-seg-zero': WvSegZero,
  'umm-wv-seg-minus': WvSegMinus,
  'umm-wv-total': WvTotal,
  'umm-wv-sign-map': WvSignMap,

  'umm-we-premise': WePremise,
  'umm-we-start': WeStart,
  'umm-we-question': WeQuestion,
  'umm-we-a-def': WeADef,
  'umm-we-dt-swap': WeDtSwap,
  'umm-we-substitute': WeSubstitute,
  'umm-we-chain': WeChain,
  'umm-we-eq-x': WeEqX,
  'umm-we-times-dx': WeTimesDx,
  'umm-we-fdx': WeFdx,
  'umm-we-integrate-both': WeIntegrateBoth,
  'umm-we-limits': WeLimits,
  'umm-we-result': WeResult,
  'umm-we-net': WeNet,

  'umm-ps-store': PsStore,
  'umm-ps-def': PsDef,
  'umm-ps-sign': PsSign,
  'umm-ps-spring-sub': PsSpringSub,
  'umm-ps-spring-u': PsSpringU,
  'umm-ps-recover': PsRecover,
  'umm-ps-slope': PsSlope,
  'umm-ps-differentiate': PsDifferentiate,
  'umm-ps-valley': PsValley,
  'umm-ps-friction': PsFriction,
  'umm-ps-conservative': PsConservative,

  'umm-mc-p': McP,
  'umm-mc-dpdt': McDpdt,
  'umm-mc-varying': McVarying,
  'umm-mc-piece': McPiece,
  'umm-mc-sum': McSum,
  'umm-mc-ball': McBall,
  'umm-mc-hard': McHard,
  'umm-mc-soft': McSoft,
  'umm-mc-compare': McCompare,
  'umm-mc-average': McAverage,
};

export const um_mechReadings: Record<string, string> = {
  'umm-nc-recall': '力の矢印の大きさは変わらないのに、台車の速さが増えていきます。式が決めているのは加速度です。',
  'umm-nc-two-forces': '右向きと左向き、2本の矢印が同時に描かれています。この2本から1つの数を作る方法がまだありません。',
  'umm-nc-setup': '3枚の札が上から順に光ります。3枚目まで決まって初めて、式が1本に定まると書かれていることを確かめてください。',
  'umm-nc-sign': '右向きの矢印に＋、左向きの矢印に−が付きます。下の軸に描かれた正の向きが、この符号の根拠です。',
  'umm-nc-second-derivative': '位置・速度・加速度の3つの箱が、d/dt の矢印でつながっています。矢印を2本たどると2階微分になります。',
  'umm-nc-x-equation': '等号の左右で、左が動き方、右がx方向の力の合計です。右の箱にy方向の力が入っていないことを見てください。',
  'umm-nc-y-equation': '中央の2本の軸に沿って、力の矢印が1本ずつ出ています。右の2枚の札が、軸ごとの独立した式です。',
  'umm-nc-decompose': '斜めの矢印から下ろした点線と、軸に沿った2本の太い矢印が成分です。長さの数値が別々に付いています。',
  'umm-nc-axis-choice': '同じ斜面と同じ重力の矢印のまま、座標軸の組だけが切り替わります。物体の置かれ方は変わりません。',
  'umm-nc-bundle': '上のベクトルの式から、下へ3本の成分の式が1本ずつ現れます。中身が3本であることを確かめてください。',

  'umm-cf-const-a': '横軸が時刻、縦軸が加速度です。線が水平のままで、丸がどこへ動いても高さが変わらないことを見てください。',
  'umm-cf-question': '1秒ごとに＋2 m/sの矢印が積み上がります。右上の疑問符は、出発点の値がまだ分からないことを表しています。',
  'umm-cf-area': '塗られた長方形の幅が伸びると、面積の数値も増えます。この面積が、増えた速度そのものです。',
  'umm-cf-constant': '3本の直線は傾きが同じで、上下にずれているだけです。ずれの大きさが積分定数Cにあたります。',
  'umm-cf-initial': '点線の候補の中から、測った点を通る1本だけが実線になります。この1点が定数を決めています。',
  'umm-cf-vt-line': '縦軸との交点が初期条件、階段状の補助線が傾きです。1秒進むごとに2 m/s上がることを見てください。',
  'umm-cf-vt-area': '同じ図形が、下の長方形と上の三角形に塗り分けられます。2つの面積の合計が進んだ距離です。',
  'umm-cf-half': '底辺と高さに目盛りが付いた三角形です。掛けて2で割ると、式の2分の1と同じ値になります。',
  'umm-cf-x0': '2本の放物線は形がまったく同じで、縦にずれているだけです。ずれの大きさが出発点の位置です。',
  'umm-cf-summary': '2枚の式の札が交互に光ります。下に並ぶ3行が、使った仮定と使えない場合です。',

  'umm-ws-recap': '高さの違う棒が左から1本ずつ増え、右上の合計が積み上がります。足しているのは長方形の面積です。',
  'umm-ws-sigma': '各棒の下に FᵢΔxᵢ という名札が付いています。下の行の和の記号が、その足し算の省略形です。',
  'umm-ws-spring': 'ばねを伸ばすほど、右の力の矢印が長くなります。スライダーで伸びを変えられます。',
  'umm-ws-line': '原点から右上がりの直線です。丸が動くと高さも変わり、力が1つに決まらないことが分かります。',
  'umm-ws-bars': '5本の棒が左から順に現れます。各棒の高さは、その区間の中央での力です。',
  'umm-ws-triangle': '直線の下が三角形に塗られています。底辺と高さの目盛りから、面積を自分で計算してみてください。',
  'umm-ws-half-kx2': '目盛りのない図で、底辺がx、高さがkxと記号のまま書かれています。面積の式がそのまま答えです。',
  'umm-ws-quadruple': '小さい三角形と大きい三角形が重ねて描かれます。底辺が2倍のとき、面積が何倍かを見てください。',
  'umm-ws-integral': '区間の数が5、10、20、40と増えます。右上の合計の数値が、ある値に落ち着いていきます。',

  'umm-wv-recall': '斜めの矢印と、床に沿った太い矢印、真上を向いた細い矢印の3本があります。効くのは床に沿う分だけです。',
  'umm-wv-cos': '点線を下ろした先の太い矢印が、移動の向きに揃った成分です。スライダーで角度を変えられます。',
  'umm-wv-dot': '力と変位の2本の矢印と、その間の角θが描かれています。右の札が、この3つから作る式です。',
  'umm-wv-path': '黄色い折れ線が歩いた道、薄い矢印が一様な力です。辺ごとに、道と力のなす角が違います。',
  'umm-wv-seg-plus': '1辺目だけが太く光っています。力の矢印と辺の向きが同じであることを確かめてください。',
  'umm-wv-seg-zero': '2辺目が光っています。辺は上向き、力は右向きで直角です。それでも仕事が0になります。',
  'umm-wv-seg-minus': '3辺目が光っています。辺は左向き、力は右向きで正反対です。ここで符号が負になります。',
  'umm-wv-total': '辺が1本ずつ増え、右上の合計が変わります。下の短い線は、出発点から終点までの正味の変位です。',
  'umm-wv-sign-map': '横軸が角度、縦軸が余弦です。90度の点線を境に、塗りの色が緑から紫へ変わります。',

  'umm-we-premise': '上段が前提として置くもの、下段が斜線で消してある扱わない場合です。結論を使ってよい範囲を表しています。',
  'umm-we-start': '左の箱にはたらく合力の矢印と、右の式の札があります。ここから新しい法則を足さずに進みます。',
  'umm-we-question': '左は横軸が時刻、右は横軸が位置のグラフです。同じ運動を別の見方で描いています。',
  'umm-we-a-def': '曲線に沿って接線が動きます。この接線の傾きが、その時刻の加速度です。',
  'umm-we-dt-swap': '経路上の小さな幅dxと、そこを速さvで通る矢印です。右下の札が、割り算ができない場合の注意です。',
  'umm-we-substitute': '右上の札にある dx / v が、分数の分母へ矢印で運ばれます。分母が分数になった形を確かめてください。',
  'umm-we-chain': '3枚の札が上から順に光ります。真ん中の札が、どの置き換えをしたかを示しています。',
  'umm-we-eq-x': '左の古い形から右の新しい形へ矢印が伸びます。右の式に時刻tが入っていないことを確かめてください。',
  'umm-we-times-dx': '上の式の両側から、× dx の矢印が下へ伸びます。下の式で分母の dx が消えていることを見てください。',
  'umm-we-fdx': '左右に1本ずつ細い短冊があります。左は縦がF・横がdx、右は縦がmv・横がdvで、面積が等しくなります。',
  'umm-we-integrate-both': '上の式に積分記号が付いて、下の式になります。左右それぞれに範囲が付くことを確かめてください。',
  'umm-we-limits': '左右の箱で、積分変数と範囲が違うことが書かれています。下の線が、同じ始点と終点で対にしていることを示します。',
  'umm-we-result': '大きい三角形から小さい三角形を引いた残りが仕事です。差だけが残ることを見てください。',
  'umm-we-net': '押す力と摩擦の2本の矢印から、合力の矢印が作られます。摩擦が強くなると合力の向きが変わります。',

  'umm-ps-store': 'ばねが縮むほど、下のゲージがたまっていきます。たまった値は縮みだけで決まります。',
  'umm-ps-def': '左が力のした仕事、右がUの増分で、間の矢印が符号の反転です。この対応が定義そのものです。',
  'umm-ps-sign': '動かす向きの矢印と、ばねの力の矢印が逆を向いています。下の2枚の札で、符号が入れ替わります。',
  'umm-ps-spring-sub': '右の札のばねの力が、左の定義の F へ矢印で入ります。負号が2つ並び、打ち消し合うところを見てください。',
  'umm-ps-spring-u': '塗られた三角形が伸びとともに広がり、Uの値が増えます。面積がそのままUです。',
  'umm-ps-recover': '放物線だけが描かれています。この曲線から力を読み取れるか、という問いを表した図です。',
  'umm-ps-slope': '曲線に接する線と、下の力の矢印が連動します。傾きが正のとき矢印が左を向くことを確かめてください。',
  'umm-ps-differentiate': '上がUの放物線、下が力の直線です。点線でつないだ2つの丸が、同じ位置に対応しています。',
  'umm-ps-valley': '谷の中を球が往復し、力の矢印はいつも谷底の側を向きます。谷底では矢印が短くなります。',
  'umm-ps-friction': 'まっすぐな道と遠回りの道が交互に現れます。両端のAとBは同じなのに、仕事の値が違います。',
  'umm-ps-conservative': '左が保存力、右がそうでない力です。下の行にUを作れるかどうかが書かれています。',

  'umm-mc-p': '速さを変えると、下のゲージの長さが変わります。運動量は質量と速度の積です。',
  'umm-mc-dpdt': '縦軸が運動量、横軸が時刻です。曲線に接する線の傾きが、その時刻の力にあたります。',
  'umm-mc-varying': '山の形をした曲線が、接触中の力です。丸が動くと値が大きく変わることを見てください。',
  'umm-mc-piece': '山の下の1本だけが金色になります。その幅の中では、力を一定とみなして掛け算1回にしています。',
  'umm-mc-sum': '細い棒が左から順に足され、右上の合計が増えます。最後の値が運動量の変化です。',
  'umm-mc-ball': '当たる前と後で、速度の矢印の向きが逆になります。下の軸に描かれた正の向きが符号の根拠です。',
  'umm-mc-hard': '幅が狭く、高さのある長方形です。面積は6.0のまま、高さが600 Nになっています。',
  'umm-mc-soft': '幅が広く、平たい長方形です。面積は同じ6.0ですが、高さは60 Nまで下がっています。',
  'umm-mc-compare': '細い長方形と平たい長方形が重ねて描かれます。面積が同じで、縦横の割り振りだけが違います。',
  'umm-mc-average': 'スライダーで接触時間を変えると、長方形の幅と高さが入れ替わります。面積は常に6.0です。',
};
