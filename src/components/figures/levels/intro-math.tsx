import { Arw, Axes, Bar, Cap, Curve, FigSlider, L, Lbl, LevelFig, mapper, pingPong, step, useManual, useT, fmt } from './base';

// 数学の武器庫（図と小さな計算で、変化を読む）の図解。
// 図解IDはすべて uix- で始める。
// 縦軸・横軸の約束:
//   ui-average-to-now  … 横 = 時刻 t [s]、縦 = 位置 x [m]
//   ui-area-is-distance / ui-curve-tiles … 横 = 時刻 t [s]、縦 = 速さ v [m/s]。面積が距離 [m]
//   ui-effective-component / ui-vector-map / ui-through-a-surface … 実空間の絵

// ===================== ui-average-to-now =====================

/** x = 5t^2（t は秒、x はメートル）。 */
const quad = (t: number) => 5 * t * t;
const XT = mapper([0, 2.2], [0, 25], { x0: 52, y0: 46, x1: 286, y1: 144 });

/** 100 m を 20 s で進む。平均は 5 m/s。 */
export function AvgRun() {
  const t = useT();
  const u = (t % 5) / 5;
  const x0 = 46, x1 = 284, y = 104;
  return (
    <LevelFig label="100メートルを20秒で進む">
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={L.path} strokeWidth={3} />
      <line x1={x0} y1={y - 9} x2={x0} y2={y + 9} stroke={L.path} strokeWidth={2} />
      <line x1={x1} y1={y - 9} x2={x1} y2={y + 9} stroke={L.path} strokeWidth={2} />
      <circle cx={x0 + (x1 - x0) * u} cy={y - 16} r={7} fill={L.field} />
      <Lbl x={x0} y={y + 24} text="0 m" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={x1} y={y + 24} text="100 m" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={(x0 + x1) / 2} y={y + 24} text={`経過 ${fmt(20 * u, 1)} s`} color={L.path} size={11} anchor="middle" />
      <Lbl x={18} y={38} text="進んだ距離 100 m ÷ かかった時間 20 s" color={L.text} size={11.5} />
      <Lbl x={18} y={60} text="平均の速さ = 5 m/s" color={L.focus} size={13} bold />
      <Lbl x={18} y={148} text="出てくるのは、区間全体をならした一つの値" color={L.dim} size={10.5} />
      <Cap text="割っているのは、進んだ距離をかかった時間で" />
    </LevelFig>
  );
}

/** 同じ100 m・20 sでも、途中の速さは凸凹している。 */
export function AvgReal() {
  const t = useT();
  const m = mapper([0, 20], [0, 9], { x0: 52, y0: 48, x1: 286, y1: 140 });
  const legs = [6, 0, 8, 6];
  const glow = 0.55 + 0.3 * Math.sin(3 * t);
  return (
    <LevelFig label="途中の速さは凸凹している">
      <Axes m={m} xLabel="時刻 t [s]" yLabel="速さ v [m/s]" />
      {legs.map((v, i) => <Bar key={i} m={m} x0={i * 5} x1={i * 5 + 5} height={v} />)}
      <line x1={m.x(0)} y1={m.y(5)} x2={m.x(20)} y2={m.y(5)} stroke={L.focus} strokeWidth={2.5} strokeDasharray="6 4" />
      <Lbl x={m.x(20) - 2} y={m.y(5) - 6} text="平均 5 m/s" color={L.focus} size={11} anchor="end" />
      <Lbl x={m.x(7.5)} y={m.y(0) + 14} text="信号待ち 0 m/s" color={L.dim} size={10} anchor="middle" />
      <Lbl x={m.x(12.5)} y={m.y(8) - 6} text="小走り 8 m/s" color={L.field} size={10} anchor="middle" />
      <g opacity={glow}>
        <Lbl x={66} y={26} text="どの瞬間も5 m/sだったわけではない" color={L.minus} size={11} />
      </g>
      <Cap text="凸凹をならして一つにした値が、平均の速さ" />
    </LevelFig>
  );
}

/** x = 5t^2 のグラフ。t=1で5 m、t=2で20 m。 */
export function QuadPath() {
  const t = useT();
  const u = pingPong(t, 6);
  const tp = 2 * u;
  return (
    <LevelFig label="位置が時刻の2乗で増える運動">
      <Axes m={XT} xLabel="時刻 t [s]" yLabel="位置 x [m]" />
      <Curve m={XT} f={quad} color={L.path} xa={0} xb={2.2} />
      <circle cx={XT.x(tp)} cy={XT.y(quad(tp))} r={5} fill={L.field} />
      <circle cx={XT.x(1)} cy={XT.y(5)} r={3.5} fill={L.focus} />
      <circle cx={XT.x(2)} cy={XT.y(20)} r={3.5} fill={L.focus} />
      <Lbl x={XT.x(1) + 6} y={XT.y(5) + 14} text="t = 1 sで5 m" color={L.focus} size={10.5} />
      <Lbl x={XT.x(2) - 4} y={XT.y(20) - 8} text="t = 2 sで20 m" color={L.focus} size={10.5} anchor="end" />
      <Lbl x={66} y={24} text="進むほど速くなる運動を題材にする" color={L.text} size={11} />
      <Cap text="同じ1秒でも、後のほうが多く進んでいる" />
    </LevelFig>
  );
}

/** 幅1 sの平均 = 割線の傾き15 m/s。 */
export function Avg1s() {
  const t = useT();
  const glow = 0.6 + 0.25 * Math.sin(3 * t);
  const ax = XT.x(1), ay = XT.y(5), bx = XT.x(2), by = XT.y(20);
  return (
    <LevelFig label="幅1秒の平均は割線の傾き">
      <Axes m={XT} xLabel="時刻 t [s]" yLabel="位置 x [m]" />
      <Curve m={XT} f={quad} color={L.path} xa={0} xb={2.2} />
      <line x1={ax} y1={ay} x2={bx} y2={ay} stroke={L.dim} strokeDasharray="4 3" />
      <line x1={bx} y1={ay} x2={bx} y2={by} stroke={L.dim} strokeDasharray="4 3" />
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke={L.focus} strokeWidth={2.5} opacity={glow} />
      <circle cx={ax} cy={ay} r={4} fill={L.focus} />
      <circle cx={bx} cy={by} r={4} fill={L.focus} />
      <Lbl x={(ax + bx) / 2} y={ay + 15} text="Δt = 1 s" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={bx - 5} y={(ay + by) / 2} text="Δx = 15 m" color={L.dim} size={10.5} anchor="end" />
      <Lbl x={66} y={24} text="2点を結ぶ直線の傾きが、その区間の平均" color={L.text} size={11} />
      <Lbl x={66} y={162} text="平均 = 15 ÷ 1 = 15 m/s" color={L.focus} size={12} bold />
      <Cap text="幅1 sで測ると15 m/s。区間の後半ほど速い" />
    </LevelFig>
  );
}

/** 幅0.5 sの平均は12.5 m/s。 */
export function AvgHalf() {
  const t = useT();
  const glow = 0.6 + 0.25 * Math.sin(3 * t);
  const ax = XT.x(1), ay = XT.y(5), bx = XT.x(1.5), by = XT.y(11.25);
  return (
    <LevelFig label="幅0.5秒の平均は12.5メートル毎秒">
      <Axes m={XT} xLabel="時刻 t [s]" yLabel="位置 x [m]" />
      <Curve m={XT} f={quad} color={L.path} xa={0} xb={2.2} />
      <line x1={XT.x(1)} y1={XT.y(5)} x2={XT.x(2)} y2={XT.y(20)} stroke={L.dim} strokeWidth={1.6} strokeDasharray="5 4" />
      <Lbl x={XT.x(2) - 4} y={XT.y(20) - 6} text="幅1 sのとき" color={L.dim} size={10} anchor="end" />
      <line x1={ax} y1={ay} x2={bx} y2={ay} stroke={L.dim} strokeDasharray="4 3" />
      <line x1={bx} y1={ay} x2={bx} y2={by} stroke={L.dim} strokeDasharray="4 3" />
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke={L.focus} strokeWidth={2.5} opacity={glow} />
      <circle cx={ax} cy={ay} r={4} fill={L.focus} />
      <circle cx={bx} cy={by} r={4} fill={L.focus} />
      <Lbl x={(ax + bx) / 2} y={ay + 15} text="Δt = 0.5 s" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={bx + 6} y={(ay + by) / 2 + 4} text="Δx = 6.25 m" color={L.dim} size={10.5} />
      <Lbl x={66} y={24} text="幅を半分にして測り直す" color={L.text} size={11} />
      <Lbl x={66} y={162} text="平均 = 6.25 ÷ 0.5 = 12.5 m/s" color={L.focus} size={12} bold />
      <Cap text="15 m/sより小さくなった。幅を縮めると値が下がる" />
    </LevelFig>
  );
}

/** 幅と平均の対応表。 */
export function AvgTable() {
  const t = useT();
  const shown = Math.min(step(t, 6, 0.9) + 1, 4);
  const rows = [
    { w: '幅 1 s', v: '15 m/s' },
    { w: '幅 0.5 s', v: '12.5 m/s' },
    { w: '幅 0.1 s', v: '10.5 m/s' },
    { w: '幅 0.01 s', v: '10.05 m/s' },
  ];
  return (
    <LevelFig label="区間の幅と平均の速さの対応表">
      <Lbl x={44} y={28} text="区間の幅" color={L.dim} size={10.5} />
      <Lbl x={276} y={28} text="平均の速さ" color={L.dim} size={10.5} anchor="end" />
      {rows.map((row, i) => (
        <g key={row.w} opacity={i < shown ? 1 : 0.18}>
          <rect x={36} y={36 + i * 26} width={244} height={22} rx={5} fill={L.focus} opacity={i === shown - 1 ? 0.24 : 0.09} />
          <Lbl x={48} y={51 + i * 26} text={row.w} color={L.text} size={11.5} />
          <Lbl x={268} y={51 + i * 26} text={row.v} color={L.focus} size={11.5} anchor="end" bold={i === shown - 1} />
        </g>
      ))}
      <g opacity={shown >= 4 ? 1 : 0.18}>
        <Lbl x={158} y={156} text="幅を縮めるほど、10 m/s へ寄っていく" color={L.plus} size={11.5} anchor="middle" />
      </g>
      <Cap text="幅を10分の1にすると、10 m/sとの差も10分の1" />
    </LevelFig>
  );
}

/** 割線を接線へ近づける（スライダーで幅を操作）。 */
export function SecantZoom() {
  const [h, setH] = useManual(time => 0.06 + 0.94 * (1 - pingPong(time, 9)));
  const ax = XT.x(1), ay = XT.y(5);
  const bt = 1 + h, bx = XT.x(bt), by = XT.y(quad(bt));
  const slope = 10 + 5 * h;
  const ext = 0.4;
  const tanA = [XT.x(1 - ext), XT.y(5 - 10 * ext)];
  const tanB = [XT.x(1 + ext), XT.y(5 + 10 * ext)];
  return (
    <>
      <LevelFig label="割線を近づけると一本の直線に落ち着く">
        <Axes m={XT} xLabel="時刻 t [s]" yLabel="位置 x [m]" />
        <Curve m={XT} f={quad} color={L.path} xa={0} xb={2.2} />
        <line x1={tanA[0]} y1={tanA[1]} x2={tanB[0]} y2={tanB[1]} stroke={L.plus} strokeWidth={1.8} strokeDasharray="5 4" />
        <line x1={ax} y1={ay} x2={bx} y2={by} stroke={L.focus} strokeWidth={2.6} />
        <circle cx={ax} cy={ay} r={4} fill={L.focus} />
        <circle cx={bx} cy={by} r={4} fill={L.field} />
        <Lbl x={66} y={24} text={`幅 ${fmt(h, 2)} s の平均 = ${fmt(slope, 2)} m/s`} color={L.focus} size={11.5} />
        <Lbl x={66} y={162} text="点線は落ち着き先の直線（傾き 10 m/s）" color={L.plus} size={10.5} />
        <Cap text="右の点を近づけると、直線の傾きが10 m/sへ寄る" />
      </LevelFig>
      <FigSlider label="区間の幅 [s]" value={h} min={0.05} max={1} step={0.01} onChange={setH} display={`${fmt(h, 2)} s`} />
    </>
  );
}

/** 0で割るのではなく、0へ近づけた行き先を見る。 */
export function ZeroDivide() {
  const t = useT();
  const blink = 0.45 + 0.35 * Math.sin(4 * t);
  return (
    <LevelFig label="0で割ることと、0へ近づけることの違い">
      <rect x={16} y={30} width={138} height={102} rx={8} fill={L.minus} opacity={0.12} stroke={L.minus} strokeWidth={1.2} />
      <Lbl x={85} y={48} text="幅を0にする" color={L.minus} size={11.5} anchor="middle" bold />
      <Lbl x={85} y={70} text="Δx = 0 m" color={L.text} size={11} anchor="middle" />
      <Lbl x={85} y={88} text="Δt = 0 s" color={L.text} size={11} anchor="middle" />
      <g opacity={blink}>
        <Lbl x={85} y={116} text="0 ÷ 0 は決まらない" color={L.minus} size={11.5} anchor="middle" bold />
      </g>
      <rect x={166} y={30} width={138} height={102} rx={8} fill={L.plus} opacity={0.12} stroke={L.plus} strokeWidth={1.2} />
      <Lbl x={235} y={48} text="幅を0へ近づける" color={L.plus} size={11.5} anchor="middle" bold />
      <Lbl x={235} y={70} text="幅 0.1 s → 10.5 m/s" color={L.text} size={10.5} anchor="middle" />
      <Lbl x={235} y={88} text="幅 0.01 s → 10.05 m/s" color={L.text} size={10.5} anchor="middle" />
      <Lbl x={235} y={116} text="行き先 10 m/s を答えにする" color={L.plus} size={10.5} anchor="middle" bold />
      <Lbl x={160} y={152} text="割る操作はしない。近づけた先を見る" color={L.dim} size={11} anchor="middle" />
      <Cap text="0で割るのではなく、0へ近づけたときの行き先を見る" />
    </LevelFig>
  );
}

/** 幅を縮めた順に、平均の値が10 m/sへ寄っていく。 */
export function LimitArrow() {
  const t = useT();
  const shown = Math.min(step(t, 6, 0.9) + 1, 4);
  const px = (v: number) => 96 + ((v - 9.6) / 6) * 156;
  const marks = [
    { v: 15, tag: '幅 1 s' },
    { v: 12.5, tag: '幅 0.5 s' },
    { v: 10.5, tag: '幅 0.1 s' },
    { v: 10.05, tag: '幅 0.01 s' },
  ];
  return (
    <LevelFig label="幅を縮めた順に平均の値が10メートル毎秒へ寄る">
      <line x1={px(10)} y1={38} x2={px(10)} y2={140} stroke={L.plus} strokeWidth={2.5} />
      <Lbl x={px(10) + 6} y={32} text="行き先 10 m/s" color={L.plus} size={11} bold />
      {marks.map((mk, i) => {
        const y = 52 + i * 24;
        return (
          <g key={mk.v} opacity={i < shown ? 1 : 0.16}>
            <line x1={96} y1={y} x2={272} y2={y} stroke={L.dim} strokeWidth={1.2} />
            <Lbl x={22} y={y + 4} text={mk.tag} color={L.dim} size={10.5} />
            <circle cx={px(mk.v)} cy={y} r={4.5} fill={i === shown - 1 ? L.focus : L.field} />
            <Lbl x={px(mk.v) + 9} y={y + 4} text={`${fmt(mk.v, 2)} m/s`} color={L.focus} size={10.5} />
          </g>
        );
      })}
      <Arw x={248} y={152} dx={px(10.3) - 248} dy={0} color={L.focus} w={2.4} />
      <Lbl x={22} y={156} text="上から下へ" color={L.dim} size={10} />
      <Cap text="幅を縮めるほど、点が緑の線へ寄っていく" />
    </LevelFig>
  );
}

/** 幅を文字 h にして、約分で 10 + 5h を出す。 */
export function HGeneral() {
  const t = useT();
  const shown = Math.min(step(t, 5, 1.1) + 1, 3);
  const h = 0.05 + 0.75 * (1 - pingPong(t, 9));
  const rows = [
    { tag: '① 右端の位置', tex: 'x(1+h) = 5 + 10h + 5h²' },
    { tag: '② 差を取る', tex: '差 = 10h + 5h²' },
    { tag: '③ h で割る', tex: '平均 = 10 + 5h' },
  ];
  return (
    <LevelFig label="幅を文字hにして約分する">
      {rows.map((row, i) => (
        <g key={row.tag} opacity={i < shown ? 1 : 0.18}>
          <rect x={30} y={32 + i * 30} width={256} height={26} rx={6} fill={L.focus} opacity={i === shown - 1 ? 0.24 : 0.09} />
          <Lbl x={42} y={50 + i * 30} text={row.tag} color={L.dim} size={10} />
          <Lbl x={278} y={50 + i * 30} text={row.tex} color={L.focus} size={11.5} anchor="end" bold={i === 2} />
        </g>
      ))}
      <Lbl x={160} y={140} text="h は0ではないので、h で割れる" color={L.plus} size={11.5} anchor="middle" bold />
      <Lbl x={160} y={160} text={`h = ${fmt(h, 2)} なら 10 + 5h = ${fmt(10 + 5 * h, 2)} m/s`} color={L.text} size={11} anchor="middle" />
      <Cap text="割ってから約分している。0で割ってはいない" />
    </LevelFig>
  );
}

/** 予告: v = dx/dt。区間を縮め続ける。 */
export function DxDtPreview() {
  const t = useT();
  const h = 0.08 + 0.62 * (1 - pingPong(t, 7));
  const ax = XT.x(1), ay = XT.y(5);
  const bx = XT.x(1 + h), by = XT.y(quad(1 + h));
  return (
    <LevelFig label="区間を縮め続けた行き先がdx/dt">
      <Axes m={XT} xLabel="時刻 t [s]" yLabel="位置 x [m]" />
      <Curve m={XT} f={quad} color={L.path} xa={0} xb={2.2} />
      <line x1={ax} y1={ay} x2={bx} y2={ay} stroke={L.focus} strokeWidth={2} />
      <line x1={bx} y1={ay} x2={bx} y2={by} stroke={L.focus} strokeWidth={2} />
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke={L.field} strokeWidth={2.4} />
      <Lbl x={(ax + bx) / 2} y={ay + 15} text="dt" color={L.focus} size={11} anchor="middle" />
      <Lbl x={bx + 6} y={(ay + by) / 2 + 4} text="dx" color={L.focus} size={11} />
      <Lbl x={66} y={24} text="縮め続けても、傾きは10 m/sへ落ち着く" color={L.text} size={11} />
      <Lbl x={66} y={66} text="v = dx / dt" color={L.plus} size={13} bold />
      <Lbl x={66} y={84} text="dは極限まで縮める約束の印" color={L.dim} size={10} />
      <Cap text="割り算をやめたのではなく、幅の約束を決めただけ" />
    </LevelFig>
  );
}

// ===================== ui-area-is-distance =====================

const VT = mapper([0, 4.2], [0, 5], { x0: 52, y0: 46, x1: 286, y1: 142 });
const STEP_V = [2, 3, 4];

function StepOutline() {
  const points: string[] = [];
  STEP_V.forEach((v, i) => { points.push(`${VT.x(i)},${VT.y(v)}`, `${VT.x(i + 1)},${VT.y(v)}`); });
  return <polyline points={points.join(' ')} fill="none" stroke={L.field} strokeWidth={2.5} />;
}

/** 一定の速さ3 m/sで4 s進む。 */
export function VtRect() {
  const t = useT();
  const u = pingPong(t, 6);
  const x0 = 46, x1 = 276, y = 100;
  return (
    <LevelFig label="一定の速さで4秒進む">
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={L.path} strokeWidth={3} />
      <line x1={x0} y1={y - 9} x2={x0} y2={y + 9} stroke={L.path} strokeWidth={2} />
      <line x1={x1} y1={y - 9} x2={x1} y2={y + 9} stroke={L.path} strokeWidth={2} />
      <circle cx={x0 + (x1 - x0) * u} cy={y - 16} r={7} fill={L.field} />
      <Arw x={x0 + (x1 - x0) * u + 10} y={y - 16} dx={22} dy={0} color={L.field} w={2} head={6} />
      <Lbl x={x0} y={y + 24} text="0 m" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={x1} y={y + 24} text="12 m" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={18} y={38} text="速さはずっと 3 m/s、時間は 4 s" color={L.text} size={11.5} />
      <Lbl x={18} y={60} text="距離 = 3 × 4 = 12 m" color={L.focus} size={13} bold />
      <Lbl x={18} y={148} text={`経過 ${fmt(4 * u, 1)} s / 進んだ距離 ${fmt(12 * u, 1)} m`} color={L.dim} size={10.5} />
      <Cap text="単位も掛けると (m/s)×s = m。掛け算1回で距離が出る" />
    </LevelFig>
  );
}

/** 1 sごとに3 mずつ、4回ぶんを掛け算にまとめる。 */
export function VtMultiply() {
  const t = useT();
  const shown = Math.min(step(t, 5, 0.8) + 1, 4);
  const boxes = [0, 1, 2, 3];
  return (
    <LevelFig label="1秒ごとに3メートルずつ4回進む">
      {boxes.map(i => (
        <g key={i} opacity={i < shown ? 1 : 0.18}>
          <rect x={44 + i * 60} y={54} width={56} height={38} rx={6}
            fill={L.focus} opacity={i === shown - 1 ? 0.45 : 0.26} stroke={L.focus} strokeWidth={1.2} />
          <Lbl x={72 + i * 60} y={78} text="3 m" color={L.text} size={12} anchor="middle" bold />
          <Lbl x={72 + i * 60} y={108} text="1 s" color={L.path} size={10.5} anchor="middle" />
        </g>
      ))}
      <Lbl x={18} y={30} text="1 sごとに 3 m ずつ進む" color={L.text} size={11.5} />
      <Lbl x={302} y={30} text={`ここまで ${shown * 3} m`} color={L.dim} size={10.5} anchor="end" />
      <Lbl x={160} y={134} text="3 m/s × 4 s = 12 m" color={L.focus} size={13.5} anchor="middle" bold />
      <Lbl x={160} y={156} text="単位も掛けると (m/s) × s = m" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="同じ3 mを4回足すのと、3×4の掛け算は同じこと" />
    </LevelFig>
  );
}

/** 速さ-時刻グラフの長方形の面積が距離。 */
export function VtArea() {
  const t = useT();
  const u = pingPong(t, 6);
  const right = VT.x(4 * u);
  return (
    <LevelFig label="速さと時刻のグラフの長方形の面積">
      <Axes m={VT} xLabel="時刻 t [s]" yLabel="速さ v [m/s]" />
      <rect x={VT.x(0)} y={VT.y(3)} width={Math.max(right - VT.x(0), 0)} height={VT.y(0) - VT.y(3)} fill={L.focus} opacity={0.35} />
      <line x1={VT.x(0)} y1={VT.y(3)} x2={VT.x(4)} y2={VT.y(3)} stroke={L.field} strokeWidth={2.5} />
      <Lbl x={VT.x(4) + 2} y={VT.y(3) - 6} text="v = 3 m/s" color={L.field} size={10.5} anchor="end" />
      <Lbl x={VT.x(2)} y={VT.y(1.5) + 4} text={`面積 = ${fmt(12 * u, 1)} m`} color={L.focus} size={12} anchor="middle" bold />
      <Lbl x={66} y={24} text="縦 = 速さ、横 = 時間。囲む面積が距離" color={L.text} size={11} />
      <Cap text="縦3 m/s・横4 sの長方形。面積12がそのまま12 m" />
    </LevelFig>
  );
}

/** 速さが区間ごとに変わると、高さが一つに決まらない。 */
export function VtSteps() {
  const t = useT();
  const blink = 0.45 + 0.35 * Math.sin(4 * t);
  return (
    <LevelFig label="速さが区間ごとに変わる場合">
      <Axes m={VT} xLabel="時刻 t [s]" yLabel="速さ v [m/s]" />
      {STEP_V.map((v, i) => <Bar key={i} m={VT} x0={i} x1={i + 1} height={v} />)}
      <StepOutline />
      {STEP_V.map((v, i) => (
        <Lbl key={i} x={VT.x(i + 0.5)} y={VT.y(v) - 6} text={`${v} m/s`} color={L.field} size={10.5} anchor="middle" />
      ))}
      <Lbl x={66} y={24} text="2 m/s → 3 m/s → 4 m/s と変わる" color={L.text} size={11} />
      <g opacity={blink}>
        <Lbl x={158} y={VT.y(0) + 18} text="どの高さを使えばよい？" color={L.minus} size={11.5} anchor="middle" />
      </g>
      <Cap text="高さが一つに決まらず、長方形1個では表せない" />
    </LevelFig>
  );
}

/** 最初の1 sだけなら、長方形1個で数えられる。 */
export function VtPiece1() {
  const t = useT();
  const glow = 0.6 + 0.25 * Math.sin(3 * t);
  return (
    <LevelFig label="最初の1秒間の距離">
      <Axes m={VT} xLabel="時刻 t [s]" yLabel="速さ v [m/s]" />
      {STEP_V.map((v, i) => <Bar key={i} m={VT} x0={i} x1={i + 1} height={v} active={i === 0} />)}
      <StepOutline />
      <rect x={VT.x(0)} y={VT.y(2)} width={VT.x(1) - VT.x(0)} height={VT.y(0) - VT.y(2)}
        fill="none" stroke={L.focus} strokeWidth={2} opacity={glow} />
      <Lbl x={VT.x(0.5)} y={VT.y(1)} text="2 m" color={L.focus} size={12} anchor="middle" bold />
      <Lbl x={66} y={24} text="区間1: 速さ2 m/s、幅1 s" color={L.text} size={11} />
      <Lbl x={96} y={VT.y(0) + 18} text="Δx₁ = 2 m/s × 1 s = 2 m" color={L.focus} size={11.5} />
      <Cap text="区間の中では速さが一定。長方形1個で数えられる" />
    </LevelFig>
  );
}

/** 残りの2区間も同じ形で作る。 */
export function VtPiece23() {
  const t = useT();
  const which = step(t, 2, 1.6);
  return (
    <LevelFig label="残りの区間の距離">
      <Axes m={VT} xLabel="時刻 t [s]" yLabel="速さ v [m/s]" />
      {STEP_V.map((v, i) => <Bar key={i} m={VT} x0={i} x1={i + 1} height={v} active={i === 1 + which} />)}
      <StepOutline />
      <Lbl x={VT.x(0.5)} y={VT.y(1)} text="2 m" color={L.plus} size={11} anchor="middle" />
      <Lbl x={VT.x(1.5)} y={VT.y(1.5)} text="3 m" color={which === 0 ? L.focus : L.plus} size={11.5} anchor="middle" bold={which === 0} />
      <Lbl x={VT.x(2.5)} y={VT.y(2)} text="4 m" color={which === 1 ? L.focus : L.plus} size={11.5} anchor="middle" bold={which === 1} />
      <Lbl x={66} y={24} text="区間2: 3×1 = 3 m、区間3: 4×1 = 4 m" color={L.text} size={11} />
      <Lbl x={96} y={VT.y(0) + 18} text="幅は同じ1 s、高さだけが違う" color={L.dim} size={10.5} />
      <Cap text="幅が同じでも、高さが違えば面積も違う" />
    </LevelFig>
  );
}

/** 3区間の距離を積み上げて9 m。 */
export function VtTotal() {
  const t = useT();
  const shown = Math.min(step(t, 4, 1) + 1, 3);
  const partial = STEP_V.slice(0, shown).reduce((a, b) => a + b, 0);
  return (
    <LevelFig label="区間ごとの距離を全部足す">
      <Axes m={VT} xLabel="時刻 t [s]" yLabel="速さ v [m/s]" />
      {STEP_V.map((v, i) => (i < shown ? <Bar key={i} m={VT} x0={i} x1={i + 1} height={v} active={i === shown - 1} /> : null))}
      <StepOutline />
      <Lbl x={66} y={24} text="Δx = 2 + 3 + 4" color={L.text} size={12} />
      <Lbl x={66} y={66} text={`足した分 = ${partial} m`} color={L.focus} size={12.5} bold />
      <Lbl x={284} y={66} text={`${shown} / 3 区間`} color={L.dim} size={10.5} anchor="end" />
      <Lbl x={284} y={86} text={shown === 3 ? '合計 9 m' : ''} color={L.focus} size={12} anchor="end" bold />
      <Cap text="棒を1本ずつ足していくと、合計9 mになる" />
    </LevelFig>
  );
}

/** Σ の定義: 番号を付けて並べたものを全部足す。 */
export function SigmaDef() {
  const t = useT();
  const shown = Math.min(step(t, 5, 0.9) + 1, 3);
  const names = ['a₁', 'a₂', 'a₃'];
  return (
    <LevelFig label="シグマは並んだものを全部足す記号">
      {names.map((name, i) => (
        <g key={name} opacity={i < shown ? 1 : 0.2}>
          <rect x={40 + i * 74} y={40} width={58} height={40} rx={7} fill={L.focus} opacity={0.22} stroke={L.focus} strokeWidth={1.2} />
          <Lbl x={69 + i * 74} y={65} text={name} color={L.focus} size={14} anchor="middle" bold />
        </g>
      ))}
      <Lbl x={286} y={65} text="…" color={L.dim} size={16} anchor="end" />
      <Arw x={160} y={90} dx={0} dy={16} color={L.dim} w={2} head={7} />
      <Lbl x={160} y={128} text="Σ aᵢ = a₁ + a₂ + a₃" color={L.focus} size={14} anchor="middle" bold />
      <Lbl x={160} y={150} text="番号 i に 1、2、3 と入れて、全部足す" color={L.text} size={11} anchor="middle" />
      <Cap text="Σは「後ろに並ぶものを全部足す」という指示の記号" />
    </LevelFig>
  );
}

/** 日本語の言い方と記号の言い方を並べる。 */
export function SigmaWords() {
  const t = useT();
  const glow = 0.7 + 0.3 * Math.sin(2.4 * t);
  const m = mapper([0, 3], [0, 5], { x0: 40, y0: 30, x1: 132, y1: 96 });
  return (
    <LevelFig label="日本語の言い方と記号の言い方を並べる">
      {STEP_V.map((v, i) => <Bar key={i} m={m} x0={i} x1={i + 1} height={v} active />)}
      {STEP_V.map((v, i) => (
        <Lbl key={i} x={m.x(i + 0.5)} y={m.y(0) + 14} text={`${v}`} color={L.focus} size={11.5} anchor="middle" bold />
      ))}
      <Lbl x={86} y={24} text="区間ごとの距離 [m]" color={L.dim} size={10} anchor="middle" />
      <Lbl x={148} y={44} text="その区間の速さ" color={L.text} size={11} />
      <Lbl x={148} y={62} text="× その区間の時間" color={L.text} size={11} />
      <Lbl x={148} y={80} text="を全部足す" color={L.text} size={11} />
      <g opacity={glow}>
        <Lbl x={160} y={128} text="Δx ≈ Σ vᵢ Δtᵢ = 2 + 3 + 4 = 9 m" color={L.focus} size={13} anchor="middle" bold />
      </g>
      <Lbl x={160} y={150} text="日本語と記号は、同じ操作を指している" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="棒の 2・3・4 と、式の 2+3+4 は同じ色で対応している" />
    </LevelFig>
  );
}

/** 面積が距離になる理由（縦と横が何かを見る）。 */
export function AreaIsDistance() {
  const t = useT();
  const which = step(t, 3, 1.5);
  return (
    <LevelFig label="縦が速さ横が時間だから面積が距離になる">
      <Axes m={VT} xLabel="時刻 t [s]" yLabel="速さ v [m/s]" />
      {STEP_V.map((v, i) => <Bar key={i} m={VT} x0={i} x1={i + 1} height={v} active />)}
      <StepOutline />
      <line x1={VT.x(1)} y1={VT.y(0)} x2={VT.x(1)} y2={VT.y(3)} stroke={L.plus} strokeWidth={which === 0 ? 3 : 1.5} />
      <line x1={VT.x(1)} y1={VT.y(3)} x2={VT.x(2)} y2={VT.y(3)} stroke={L.plus} strokeWidth={which === 1 ? 3 : 1.5} />
      <Lbl x={66} y={24} text={['縦 = 速さ [m/s]', '横 = 時間 [s]', '縦 × 横 = 距離 [m]'][which]} color={L.plus} size={12} bold />
      <Lbl x={96} y={VT.y(0) + 18} text="面積の合計 = 進んだ距離 9 m" color={L.focus} size={11.5} />
      <Cap text="掛ければ距離、足せば全体の距離。だから面積が距離" />
    </LevelFig>
  );
}

// ===================== ui-curve-tiles =====================

/** v = t^2（t は秒、v は m/s）。0〜2 s の真の距離は約2.67 m。 */
const sq = (x: number) => x * x;
const CT = mapper([0, 2], [0, 4.4], { x0: 52, y0: 46, x1: 286, y1: 142 });
const TRUE_AREA = 8 / 3;

function lowerSum(n: number): number {
  const w = 2 / n;
  let s = 0;
  for (let i = 0; i < n; i++) s += sq(i * w) * w;
  return s;
}
function upperSum(n: number): number {
  const w = 2 / n;
  let s = 0;
  for (let i = 0; i < n; i++) s += sq((i + 1) * w) * w;
  return s;
}

/** 復習: 階段ならぴったり数えられた。 */
export function TilesRecall() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(2.5 * t);
  const m = mapper([0, 4], [0, 5], { x0: 52, y0: 46, x1: 286, y1: 142 });
  const stair = [1, 2, 4, 3];
  const points: string[] = [];
  stair.forEach((v, i) => { points.push(`${m.x(i)},${m.y(v)}`, `${m.x(i + 1)},${m.y(v)}`); });
  return (
    <LevelFig label="階段の速さなら長方形がぴったり重なる">
      <Axes m={m} xLabel="時刻 t [s]" yLabel="速さ v [m/s]" />
      {stair.map((v, i) => <Bar key={i} m={m} x0={i} x1={i + 1} height={v} active />)}
      <polyline points={points.join(' ')} fill="none" stroke={L.plus} strokeWidth={2.6} opacity={glow} />
      <Lbl x={66} y={24} text="速さの線と、長方形の上端がぴったり重なる" color={L.text} size={11} />
      <Lbl x={66} y={m.y(0) + 18} text="合計 = 1 + 2 + 4 + 3 = 10 m" color={L.plus} size={10.5} />
      <Cap text="区間の中に迷う余地がないので、値はぴったり正しい" />
    </LevelFig>
  );
}

/** 曲線では区間の中で速さが一つに決まらない。 */
export function CurveGap() {
  const t = useT();
  const glow = 0.5 + 0.35 * Math.sin(3.2 * t);
  const a = 1, b = 1.5;
  return (
    <LevelFig label="曲線では区間の中で速さが変わる">
      <Axes m={CT} xLabel="時刻 t [s]" yLabel="速さ v [m/s]" />
      <rect x={CT.x(a)} y={CT.y(sq(b))} width={CT.x(b) - CT.x(a)} height={CT.y(sq(a)) - CT.y(sq(b))}
        fill={L.focus} opacity={0.3} />
      <Curve m={CT} f={sq} color={L.field} xa={0} xb={2} />
      <line x1={CT.x(a)} y1={CT.y(sq(a))} x2={CT.x(b)} y2={CT.y(sq(a))} stroke={L.dim} strokeDasharray="4 3" />
      <line x1={CT.x(a)} y1={CT.y(sq(b))} x2={CT.x(b)} y2={CT.y(sq(b))} stroke={L.dim} strokeDasharray="4 3" />
      <Lbl x={CT.x(b) + 4} y={CT.y(sq(a)) + 4} text="1 m/s" color={L.dim} size={10} />
      <Lbl x={CT.x(b) + 4} y={CT.y(sq(b)) + 4} text="2.25 m/s" color={L.dim} size={10} />
      <Lbl x={66} y={24} text="1〜1.5 sの区間の中でも、速さは動き続ける" color={L.text} size={11} />
      <g opacity={glow}>
        <Lbl x={66} y={CT.y(0) + 18} text="代表の値を選ばないと、長方形が作れない" color={L.minus} size={10} />
      </g>
      <Cap text="金色の帯の高さぶんだけ、区間の中で速さが変わる" />
    </LevelFig>
  );
}

/** 下端で取った4分割の和。 */
export function Lower4() {
  const t = useT();
  // 最初の区間は高さ0なので、2本目から見せて空の画面が続かないようにする
  const shown = Math.min(step(t, 4, 0.9) + 2, 4);
  const w = 0.5;
  const partial = Array.from({ length: shown }, (_, i) => sq(i * w) * w).reduce((a, b) => a + b, 0);
  return (
    <LevelFig label="区間の下端で取った4分割の和">
      <Axes m={CT} xLabel="時刻 t [s]" yLabel="速さ v [m/s]" />
      {Array.from({ length: 4 }, (_, i) => (
        i < shown ? <Bar key={i} m={CT} x0={i * w} x1={(i + 1) * w} height={sq(i * w)} active={i === shown - 1} /> : null
      ))}
      <Curve m={CT} f={sq} color={L.field} xa={0} xb={2} />
      <Lbl x={66} y={24} text="左端の速さ 0、0.25、1、2.25 m/s" color={L.text} size={10.5} />
      <Lbl x={140} y={CT.y(0) + 18} text={`下端の和 = ${partial.toFixed(2)} m`} color={L.focus} size={11.5} />
      <Cap text="棒はどれも曲線の下に収まる。だから少なめの見積もり" />
    </LevelFig>
  );
}

/** 上端で取った4分割の和。 */
export function Upper4() {
  const t = useT();
  const shown = Math.min(step(t, 5, 0.85) + 1, 4);
  const w = 0.5;
  const partial = Array.from({ length: shown }, (_, i) => sq((i + 1) * w) * w).reduce((a, b) => a + b, 0);
  return (
    <LevelFig label="区間の上端で取った4分割の和">
      <Axes m={CT} xLabel="時刻 t [s]" yLabel="速さ v [m/s]" />
      {Array.from({ length: 4 }, (_, i) => (
        i < shown ? <Bar key={i} m={CT} x0={i * w} x1={(i + 1) * w} height={sq((i + 1) * w)} active={i === shown - 1} /> : null
      ))}
      <Curve m={CT} f={sq} color={L.field} xa={0} xb={2} />
      <Lbl x={66} y={24} text="右端の速さ 0.25、1、2.25、4 m/s" color={L.text} size={10.5} />
      <Lbl x={140} y={CT.y(0) + 18} text={`上端の和 = ${partial.toFixed(2)} m`} color={L.focus} size={11.5} />
      <Cap text="棒はどれも曲線をはみ出す。だから多めの見積もり" />
    </LevelFig>
  );
}

/** 上下ではさむ（4分割）。 */
export function Sandwich4() {
  const t = useT();
  const glow = 0.55 + 0.3 * Math.sin(2.6 * t);
  const w = 0.5;
  return (
    <LevelFig label="下端の和と上端の和で真の値をはさむ">
      <Axes m={CT} xLabel="時刻 t [s]" yLabel="速さ v [m/s]" />
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={`u${i}`} x={CT.x(i * w)} y={CT.y(sq((i + 1) * w))}
          width={Math.max(CT.x((i + 1) * w) - CT.x(i * w) - 1, 1)}
          height={Math.max(CT.y(0) - CT.y(sq((i + 1) * w)), 0)}
          fill="none" stroke={L.minus} strokeWidth={1.4} strokeDasharray="4 3" opacity={glow} />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <Bar key={`l${i}`} m={CT} x0={i * w} x1={(i + 1) * w} height={sq(i * w)} active />
      ))}
      <Curve m={CT} f={sq} color={L.field} xa={0} xb={2} />
      <Lbl x={66} y={24} text="点線が上端の和、塗りが下端の和" color={L.text} size={11} />
      <Lbl x={66} y={CT.y(0) + 18} text="1.75 m ≤ 真の距離 ≤ 3.75 m" color={L.plus} size={11.5} bold />
      <Lbl x={284} y={44} text="はさむ幅 2.00 m" color={L.dim} size={10.5} anchor="end" />
      <Cap text="真の距離は、必ずこの二つの値の間に入る" />
    </LevelFig>
  );
}

/** 分割数を4・8・16と切り替える。 */
export function TilesSwitch() {
  const counts = [4, 8, 16];
  const [idx, setIdx] = useManual(time => step(time, 3, 1.8));
  const n = counts[Math.min(Math.max(Math.round(idx), 0), 2)];
  const w = 2 / n;
  const lo = lowerSum(n), hi = upperSum(n);
  return (
    <>
      <LevelFig label="分割数を4と8と16で切り替える">
        <Axes m={CT} xLabel="時刻 t [s]" yLabel="速さ v [m/s]" />
        {Array.from({ length: n }, (_, i) => (
          <rect key={`u${i}`} x={CT.x(i * w)} y={CT.y(sq((i + 1) * w))}
            width={Math.max(CT.x((i + 1) * w) - CT.x(i * w) - 0.5, 0.5)}
            height={Math.max(CT.y(0) - CT.y(sq((i + 1) * w)), 0)}
            fill={L.minus} opacity={0.22} />
        ))}
        {Array.from({ length: n }, (_, i) => (
          <Bar key={`l${i}`} m={CT} x0={i * w} x1={(i + 1) * w} height={sq(i * w)} active />
        ))}
        <Curve m={CT} f={sq} color={L.field} xa={0} xb={2} />
        <Lbl x={66} y={24} text={`区間 ${n} 個（幅 ${fmt(w, 2)} s）`} color={L.text} size={11} />
        <Lbl x={66} y={CT.y(0) + 18} text={`下端 ${lo.toFixed(2)} m / 上端 ${hi.toFixed(2)} m`} color={L.focus} size={11} />
        <Lbl x={284} y={24} text={`差 ${(hi - lo).toFixed(2)} m`} color={L.plus} size={11} anchor="end" bold />
        <Cap text="区間の数を倍にするたび、上下の差が半分になる" />
      </LevelFig>
      <FigSlider label="区間の数" value={idx} min={0} max={2} step={1} onChange={setIdx} display={`${n} 個`} />
    </>
  );
}

/** 分割数と差の表。 */
export function GapTable() {
  const t = useT();
  const shown = Math.min(step(t, 5, 1.1) + 1, 3);
  const rows = [4, 8, 16].map(n => ({ n, lo: lowerSum(n), hi: upperSum(n) }));
  return (
    <LevelFig label="分割数と上下の差の表">
      <Lbl x={44} y={30} text="区間の数" color={L.dim} size={10.5} />
      <Lbl x={150} y={30} text="下端 / 上端" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={278} y={30} text="差" color={L.dim} size={10.5} anchor="end" />
      {rows.map((row, i) => (
        <g key={row.n} opacity={i < shown ? 1 : 0.18}>
          <rect x={36} y={38 + i * 30} width={246} height={26} rx={5} fill={L.focus} opacity={i === shown - 1 ? 0.24 : 0.09} />
          <Lbl x={50} y={56 + i * 30} text={`${row.n} 個`} color={L.text} size={11.5} />
          <Lbl x={162} y={56 + i * 30} text={`${row.lo.toFixed(2)} / ${row.hi.toFixed(2)}`} color={L.field} size={11} anchor="middle" />
          <Lbl x={270} y={56 + i * 30} text={`${(row.hi - row.lo).toFixed(2)} m`} color={L.plus} size={11.5} anchor="end" bold={i === shown - 1} />
        </g>
      ))}
      <Lbl x={160} y={150} text="差は区間の数に反比例して縮む" color={L.dim} size={11} anchor="middle" />
      <Cap text="4個で2.00 m、8個で1.00 m、16個で0.50 m" />
    </LevelFig>
  );
}

/** 上下が一つの値へ挟み込まれる。 */
export function Squeeze() {
  const t = useT();
  const shown = Math.min(step(t, 5, 1.1) + 1, 3);
  const px = (v: number) => 34 + ((v - 1.5) / (4.0 - 1.5)) * 258;
  const y = 92;
  const rows = [4, 8, 16].map(n => ({ n, lo: lowerSum(n), hi: upperSum(n) }));
  return (
    <LevelFig label="下からの和と上からの和が一つの値へ挟み込まれる">
      <line x1={px(TRUE_AREA)} y1={y - 56} x2={px(TRUE_AREA)} y2={y + 28} stroke={L.plus} strokeWidth={2.5} />
      <Lbl x={px(TRUE_AREA)} y={y + 46} text="真の距離 約2.67 m" color={L.plus} size={11.5} anchor="middle" bold />
      {rows.map((row, i) => (
        <g key={row.n} opacity={i < shown ? 1 : 0.16}>
          <line x1={px(row.lo)} y1={y - 10 - i * 17} x2={px(row.hi)} y2={y - 10 - i * 17} stroke={L.focus} strokeWidth={2.4} />
          <circle cx={px(row.lo)} cy={y - 10 - i * 17} r={3.4} fill={L.field} />
          <circle cx={px(row.hi)} cy={y - 10 - i * 17} r={3.4} fill={L.minus} />
          <Lbl x={20} y={y - 6 - i * 17} text={`${row.n}個`} color={L.dim} size={10} anchor="start" />
        </g>
      ))}
      <Lbl x={36} y={26} text="下からの和は増え、上からの和は減る" color={L.text} size={11} />
      <Lbl x={160} y={156} text="はさむ帯が短くなり、差は0へ向かう" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="上下の帯が縮んで、一つの値へ挟み込まれていく" />
    </LevelFig>
  );
}

/** Σ から ∫ へ。 */
export function IntegralSymbol() {
  const t = useT();
  const u = pingPong(t, 6);
  const n = 48, w = 2 / n;
  const filled = Math.max(1, Math.round(n * u));
  return (
    <LevelFig label="限りなく細かくした和をインテグラルと書く">
      <Axes m={CT} xLabel="時刻 t [s]" yLabel="速さ v [m/s]" />
      {Array.from({ length: filled }, (_, i) => (
        <Bar key={i} m={CT} x0={i * w} x1={(i + 1) * w} height={sq((i + 0.5) * w)} active={i === filled - 1} />
      ))}
      <Curve m={CT} f={sq} color={L.field} xa={0} xb={2} />
      <Lbl x={66} y={24} text="限りなく細かくした和の行き先" color={L.text} size={11} />
      <Lbl x={66} y={CT.y(0) + 18} text="Σ vᵢ Δt  →  ∫ v dt" color={L.plus} size={13} bold />
      <Lbl x={284} y={44} text="行き先は約2.67 m" color={L.dim} size={10.5} anchor="end" />
      <Cap text="足す操作は同じ。細かさの約束だけが変わる" />
    </LevelFig>
  );
}

// ===================== ui-effective-component =====================

const FLOOR_Y = 134;

function Box4({ x, y = FLOOR_Y - 26, w = 34, h = 26 }: { x: number; y?: number; w?: number; h?: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={5} fill={L.field} opacity={0.85} />;
}

function Floor4({ y = FLOOR_Y }: { y?: number }) {
  return <line x1={16} y1={y} x2={304} y2={y} stroke={L.dim} strokeWidth={2} />;
}

/** 力と移動が同じ向き: W = 20 J。 */
export function CompAlong() {
  const t = useT();
  const u = pingPong(t, 6);
  const x = 84 + 120 * u;
  return (
    <LevelFig label="力と移動が同じ向きの場合">
      <Floor4 />
      <Box4 x={x} />
      <Arw x={x - 38} y={FLOOR_Y - 13} dx={32} dy={0} color={L.focus} w={3.5} />
      <Lbl x={x - 42} y={FLOOR_Y - 22} text="F = 10 N" color={L.focus} size={11} anchor="end" />
      <line x1={84} y1={150} x2={204} y2={150} stroke={L.path} strokeWidth={2} />
      <line x1={84} y1={144} x2={84} y2={156} stroke={L.path} strokeWidth={2} />
      <line x1={204} y1={144} x2={204} y2={156} stroke={L.path} strokeWidth={2} />
      <Lbl x={144} y={162} text="右へ 2 m" color={L.path} size={10.5} anchor="middle" />
      <Lbl x={18} y={36} text="力の向きと移動の向きがぴったり揃う" color={L.text} size={11.5} />
      <Lbl x={18} y={58} text={`W = 10 × ${fmt(2 * u, 1)} = ${fmt(20 * u, 1)} J`} color={L.focus} size={12.5} bold />
      <Lbl x={18} y={78} text="単位は N·m = J" color={L.dim} size={10.5} />
      <Cap text="向きが揃った場合が、同じ10 Nでいちばん大きい値" />
    </LevelFig>
  );
}

/** 力×距離の単位が J になることを、行で追う。 */
export function CompWork20() {
  const t = useT();
  const phase = step(t, 3, 1.4);
  const rows = [
    { left: '力 F', right: '10 N', color: L.focus },
    { left: '移動距離 L', right: '2 m', color: L.path },
    { left: '仕事 W = F × L', right: '20 N·m = 20 J', color: L.plus },
  ];
  return (
    <LevelFig label="力かける距離の単位がジュールになる">
      {rows.map((row, i) => (
        <g key={row.left} opacity={i <= phase ? 1 : 0.2}>
          <rect x={34} y={38 + i * 34} width={252} height={26} rx={6} fill={row.color} opacity={i === phase ? 0.24 : 0.1} />
          <Lbl x={48} y={56 + i * 34} text={row.left} color={L.text} size={12} />
          <Lbl x={274} y={56 + i * 34} text={row.right} color={row.color} size={12} anchor="end" bold={i === 2} />
        </g>
      ))}
      <Lbl x={160} y={154} text="N × m = J（ニュートン・メートルがジュール）" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="数だけでなく単位も掛ける。答えの単位がJなら仕事" />
    </LevelFig>
  );
}

/** 力が真上、移動が右: W = 0 J。 */
export function CompUp() {
  const t = useT();
  const u = pingPong(t, 6);
  const x = 84 + 120 * u;
  return (
    <LevelFig label="力が真上で移動が右の場合">
      <Floor4 />
      <Box4 x={x} />
      <Arw x={x + 17} y={FLOOR_Y - 28} dx={0} dy={-36} color={L.field} w={3.5} />
      <Lbl x={x + 24} y={FLOOR_Y - 60} text="F = 10 N" color={L.field} size={11} />
      <Arw x={x + 40} y={FLOOR_Y - 13} dx={26} dy={0} color={L.path} w={2.5} />
      <Lbl x={x + 44} y={FLOOR_Y - 20} text="進む向き" color={L.path} size={10} />
      <Lbl x={18} y={36} text="上向きの力は、右へ進ませる働きをしない" color={L.text} size={11.5} />
      <Lbl x={18} y={58} text="右向き成分 = 0 N" color={L.minus} size={11.5} />
      <Lbl x={18} y={80} text="W = 0 × 2 = 0 J" color={L.minus} size={12.5} bold />
      <Cap text="大きさ10 Nは同じでも、右向き成分が0なら仕事も0" />
    </LevelFig>
  );
}

/** 斜めの10 Nを6 Nと8 Nに分ける。 */
export function CompSplit() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(2.6 * t);
  const ox = 96, oy = FLOOR_Y - 13;
  const s = 7; // 1 N あたりの画素
  const ex = ox + 6 * s, ey = oy - 8 * s;
  return (
    <LevelFig label="斜めの力を右向きと上向きに分ける">
      <Floor4 />
      <Box4 x={ox - 17} />
      <line x1={ex} y1={ey} x2={ex} y2={oy} stroke={L.dim} strokeDasharray="4 3" />
      <line x1={ex} y1={ey} x2={ox} y2={ey} stroke={L.dim} strokeDasharray="4 3" />
      <Arw x={ox} y={oy} dx={ex - ox} dy={ey - oy} color={L.field} w={3} />
      <Lbl x={ex + 6} y={ey + 4} text="10 N" color={L.field} size={11.5} bold />
      <Arw x={ox} y={oy} dx={6 * s} dy={0} color={L.focus} w={4} />
      <Lbl x={ox + 6 * s + 6} y={oy + 14} text="右向き 6 N" color={L.focus} size={11} />
      <g opacity={glow}>
        <Arw x={ox} y={oy} dx={0} dy={-8 * s} color={L.normal} w={3} />
        <Lbl x={ox - 6} y={oy - 8 * s + 4} text="上向き 8 N" color={L.normal} size={11} anchor="end" />
      </g>
      <rect x={ex - 8} y={oy - 8} width={8} height={8} fill="none" stroke={L.dim} strokeWidth={1} />
      <Lbl x={156} y={40} text="6・8・10 の直角三角形" color={L.text} size={11.5} />
      <Lbl x={18} y={152} text="二つを合わせると、もとの矢印になる" color={L.dim} size={10.5} />
      <Cap text="斜めの矢印は、右向きと上向きの二つに置き換えられる" />
    </LevelFig>
  );
}

/** 右へ進めたのは右向き6 Nだけ: W = 12 J。 */
export function CompWork12() {
  const t = useT();
  const u = pingPong(t, 6);
  const s = 7;
  const x = 84 + 120 * u;
  const ox = x + 17, oy = FLOOR_Y - 13;
  return (
    <LevelFig label="右へ進めたのは右向き成分だけ">
      <Floor4 />
      <Box4 x={x} />
      <g opacity={0.3}>
        <Arw x={ox} y={oy} dx={0} dy={-8 * s} color={L.normal} w={2.5} />
        <Lbl x={ox - 6} y={oy - 8 * s + 4} text="8 N は右へ進めない" color={L.normal} size={10} anchor="end" />
      </g>
      <Arw x={ox} y={oy} dx={6 * s} dy={0} color={L.focus} w={4} />
      <Lbl x={ox + 6 * s + 5} y={oy - 6} text="6 N" color={L.focus} size={11} bold />
      <line x1={84 + 17} y1={152} x2={204 + 17} y2={152} stroke={L.path} strokeWidth={2} />
      <line x1={101} y1={146} x2={101} y2={158} stroke={L.path} strokeWidth={2} />
      <line x1={221} y1={146} x2={221} y2={158} stroke={L.path} strokeWidth={2} />
      <Lbl x={161} y={162} text="右へ 2 m" color={L.path} size={10.5} anchor="middle" />
      <Lbl x={18} y={36} text="効いたのは右向き 6 N のほうだけ" color={L.text} size={11.5} />
      <Lbl x={18} y={58} text={`W = 6 × ${fmt(2 * u, 1)} = ${fmt(12 * u, 1)} J`} color={L.focus} size={12.5} bold />
      <Cap text="効く成分だけを移動距離に掛ける" />
    </LevelFig>
  );
}

/** 10 Nをそのまま掛けるのは多すぎる。 */
export function CompWrong() {
  const t = useT();
  const blink = 0.5 + 0.35 * Math.sin(3.4 * t);
  const s = 5;
  return (
    <LevelFig label="矢印の長さをそのまま掛けるのは多すぎる">
      <g opacity={blink}>
        <rect x={16} y={30} width={288} height={52} rx={8} fill={L.minus} opacity={0.12} stroke={L.minus} strokeWidth={1.2} />
      </g>
      <Arw x={40} y={68} dx={6 * s} dy={-8 * s} color={L.minus} w={2.5} />
      <Lbl x={82} y={50} text="10 N × 2 m = 20 J" color={L.minus} size={12} bold />
      <Lbl x={82} y={70} text="矢印の長さをそのまま掛けた" color={L.dim} size={10.5} />
      <rect x={16} y={90} width={288} height={52} rx={8} fill={L.plus} opacity={0.12} stroke={L.plus} strokeWidth={1.2} />
      <Arw x={40} y={122} dx={6 * s} dy={0} color={L.plus} w={3} />
      <Lbl x={82} y={110} text="6 N × 2 m = 12 J" color={L.plus} size={12} bold />
      <Lbl x={82} y={130} text="右向き成分だけを掛けた" color={L.dim} size={10.5} />
      <Lbl x={160} y={160} text="上向き8 N分まで数えると、多く見積もりすぎる" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="20 Jは、力がまるごと右を向いていた場合の値" />
    </LevelFig>
  );
}

/** 角度を変えると効く成分が変わる。 */
export function CompAngle() {
  const [deg, setDeg] = useManual(time => 90 * pingPong(time, 9));
  const th = (deg * Math.PI) / 180;
  const ox = 92, oy = FLOOR_Y - 13, len = 62;
  const ex = ox + len * Math.cos(th), ey = oy - len * Math.sin(th);
  const eff = 10 * Math.cos(th);
  return (
    <>
      <LevelFig label="角度を変えると効く成分が変わる">
        <Floor4 />
        <Box4 x={ox - 17} />
        <line x1={ex} y1={ey} x2={ex} y2={oy} stroke={L.dim} strokeDasharray="4 3" />
        <Arw x={ox} y={oy} dx={ex - ox} dy={ey - oy} color={L.field} w={3} />
        <Lbl x={ex + 6} y={ey - 4} text="F = 10 N" color={L.field} size={11} />
        <Arw x={ox} y={oy} dx={len * Math.cos(th)} dy={0} color={L.focus} w={4.5} />
        <Lbl x={ox + len * Math.cos(th) + 8} y={oy + 14} text={`右向き ${fmt(eff, 1)} N`} color={L.focus} size={10.5} />
        <Lbl x={18} y={34} text={`角度 ${Math.round(deg)}°、移動は右へ 2 m`} color={L.text} size={11.5} />
        <Lbl x={18} y={156} text={`W = ${fmt(eff, 1)} × 2 = ${fmt(eff * 2, 1)} J`} color={L.focus} size={12.5} bold />
        <Lbl x={302} y={156} text="0°で20 J、90°で0 J" color={L.dim} size={10} anchor="end" />
        <Cap text="矢印の長さは同じでも、右向き成分が変われば仕事も変わる" />
      </LevelFig>
      <FigSlider label="力の角度 [度]" value={deg} min={0} max={90} step={1} onChange={setDeg} display={`${Math.round(deg)}°`} />
    </>
  );
}

/** 三つの向きを並べて比べる。 */
export function CompThree() {
  const t = useT();
  const which = step(t, 3, 1.5);
  const rows = [
    { tag: '右向き 10 N', comp: '右向き成分 10 N', w: 'W = 20 J', dx: 22, dy: 0 },
    { tag: '真上 10 N', comp: '右向き成分 0 N', w: 'W = 0 J', dx: 0, dy: -22 },
    { tag: '斜め 10 N', comp: '右向き成分 6 N', w: 'W = 12 J', dx: 13, dy: -18 },
  ];
  return (
    <LevelFig label="三つの向きで仕事を比べる">
      {rows.map((row, i) => {
        const cy = 52 + i * 36;
        return (
          <g key={row.tag} opacity={i === which ? 1 : 0.42}>
            <rect x={20} y={cy - 16} width={280} height={30} rx={7} fill={i === which ? L.focus : L.dim} opacity={i === which ? 0.2 : 0.08} />
            <Arw x={row.dx === 0 ? 40 : 32} y={row.dy === 0 ? cy : cy + 10} dx={row.dx} dy={row.dy}
              color={i === which ? L.focus : L.field} w={2.5} head={7} />
            <Lbl x={66} y={cy + 4} text={row.tag} color={L.text} size={10.5} />
            <Lbl x={150} y={cy + 4} text={row.comp} color={L.dim} size={10} />
            <Lbl x={294} y={cy + 4} text={row.w} color={i === which ? L.focus : L.dim} size={11.5} anchor="end" bold={i === which} />
          </g>
        );
      })}
      <Lbl x={160} y={30} text="力の大きさ10 Nも、移動2 mも共通" color={L.dim} size={10.5} anchor="middle" />
      <Lbl x={160} y={158} text="違うのは、進む向きに揃った量だけ" color={L.plus} size={11.5} anchor="middle" />
      <Cap text="同じ10 Nでも、向きが違えば仕事は20 J・0 J・12 J" />
    </LevelFig>
  );
}

/** 手順のまとめ: 分ける → 選ぶ → 掛ける。 */
export function CompRule() {
  const t = useT();
  const phase = step(t, 3, 1.4);
  const s = 4;
  return (
    <LevelFig label="分けて選んで掛ける三つの手順">
      <g opacity={phase >= 0 ? 1 : 0.3}>
        <rect x={14} y={38} width={90} height={72} rx={8} fill={phase === 0 ? L.focus : L.dim} opacity={phase === 0 ? 0.2 : 0.08} />
        <Arw x={30} y={98} dx={6 * s} dy={-8 * s} color={L.field} w={2.4} head={7} />
        <Arw x={30} y={98} dx={6 * s} dy={0} color={L.focus} w={2.4} head={7} />
        <Arw x={30} y={98} dx={0} dy={-8 * s} color={L.normal} w={2.4} head={7} />
        <Lbl x={59} y={126} text="① 分ける" color={L.text} size={11} anchor="middle" />
      </g>
      <g opacity={phase >= 1 ? 1 : 0.3}>
        <rect x={114} y={38} width={90} height={72} rx={8} fill={phase === 1 ? L.focus : L.dim} opacity={phase === 1 ? 0.2 : 0.08} />
        <Arw x={130} y={82} dx={6 * s} dy={0} color={L.focus} w={3.5} head={8} />
        <Lbl x={159} y={104} text="6 N を選ぶ" color={L.focus} size={10.5} anchor="middle" />
        <Lbl x={159} y={126} text="② 選ぶ" color={L.text} size={11} anchor="middle" />
      </g>
      <g opacity={phase >= 2 ? 1 : 0.3}>
        <rect x={214} y={38} width={92} height={72} rx={8} fill={phase === 2 ? L.focus : L.dim} opacity={phase === 2 ? 0.2 : 0.08} />
        <Lbl x={260} y={72} text="6 N × 2 m" color={L.text} size={11} anchor="middle" />
        <Lbl x={260} y={94} text="= 12 J" color={L.focus} size={12.5} anchor="middle" bold />
        <Lbl x={260} y={126} text="③ 掛ける" color={L.text} size={11} anchor="middle" />
      </g>
      <Lbl x={160} y={152} text="直角な成分は、どれだけ大きくても仕事に入らない" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="矢印を分け、進む向きの成分を選び、距離に掛ける" />
    </LevelFig>
  );
}

/** 予告: F cosθ と内積。 */
export function DotPreview() {
  const t = useT();
  const glow = 0.65 + 0.3 * Math.sin(2.4 * t);
  const ox = 52, oy = 124, s = 7;
  const ex = ox + 6 * s, ey = oy - 8 * s;
  return (
    <LevelFig label="力かけるコサインシータと内積の予告">
      <line x1={20} y1={oy} x2={160} y2={oy} stroke={L.dim} strokeWidth={1.4} />
      <line x1={ex} y1={ey} x2={ex} y2={oy} stroke={L.dim} strokeDasharray="4 3" />
      <Arw x={ox} y={oy} dx={ex - ox} dy={ey - oy} color={L.field} w={3} />
      <Lbl x={ex + 4} y={ey - 4} text="F" color={L.field} size={12} bold />
      <Arw x={ox} y={oy} dx={6 * s} dy={0} color={L.focus} w={4} />
      <Lbl x={ox + 3 * s} y={oy + 16} text="F cosθ" color={L.focus} size={11} anchor="middle" />
      <path d={`M ${ox + 20} ${oy} A 20 20 0 0 0 ${ox + 20 * 0.6} ${oy - 20 * 0.8}`} fill="none" stroke={L.plus} strokeWidth={1.6} />
      <Lbl x={ox + 26} y={oy - 8} text="θ" color={L.plus} size={11} />
      <Arw x={ox} y={146} dx={70} dy={0} color={L.path} w={2.5} />
      <Lbl x={ox + 36} y={162} text="Δr" color={L.path} size={11} anchor="middle" />
      <g opacity={glow}>
        <Lbl x={180} y={60} text="W = (F cosθ) L" color={L.text} size={12.5} />
        <Lbl x={180} y={86} text="= F · Δr" color={L.focus} size={13} bold />
      </g>
      <Lbl x={180} y={114} text="どちらも「進む向きに" color={L.dim} size={10.5} />
      <Lbl x={180} y={130} text="揃った分だけ取る」操作" color={L.dim} size={10.5} />
      <Cap text="成分を選ぶ操作に名前を付けたものが内積" />
    </LevelFig>
  );
}

// ===================== ui-vector-map =====================

/** 場所ごとに向きと強さが変わる矢印。 */
function fieldArrow(gx: number, gy: number, t: number) {
  const a = 0.55 * Math.sin(gx * 0.9 + gy * 0.6 + t * 0.5) - 0.25;
  const len = 13 + 7 * Math.sin(gx * 0.7 - gy * 0.9 + t * 0.4);
  return { dx: len * Math.cos(a), dy: len * Math.sin(a) };
}

/** 風の地図。 */
export function WindMap() {
  const t = useT();
  const cols = [58, 112, 166, 220, 274];
  const rows = [58, 92, 126];
  return (
    <LevelFig label="場所ごとに矢印を描いた風の地図">
      <rect x={34} y={38} width={256} height={106} rx={8} fill={L.dim} opacity={0.08} />
      {rows.map((y, j) => cols.map((x, i) => {
        const a = fieldArrow(i, j, t);
        return <Arw key={`${i}-${j}`} x={x - a.dx / 2} y={y - a.dy / 2} dx={a.dx} dy={a.dy} color={L.field} w={2} head={6} />;
      }))}
      <Lbl x={18} y={28} text="向き = 風の向き、長さ = 風の強さ" color={L.text} size={11} />
      <Lbl x={160} y={160} text="一つの数ではなく、場所ごとの値の表として読む" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="地図の各点に矢印を割り当てたものが「場」" />
    </LevelFig>
  );
}

/** ならして1本にすると、場所の情報が消える。 */
export function WindVary() {
  const t = useT();
  const blink = 0.6 + 0.3 * Math.sin(3.2 * t);
  return (
    <LevelFig label="ならして一本にすると場所の情報が消える">
      <rect x={18} y={34} width={176} height={104} rx={8} fill={L.dim} opacity={0.08} />
      <circle cx={62} cy={62} r={16} fill="none" stroke={L.focus} strokeWidth={1.6} />
      <Arw x={44} y={62} dx={36} dy={-6} color={L.field} w={2.6} />
      <Lbl x={62} y={92} text="海の上: 強い" color={L.focus} size={10} anchor="middle" />
      <circle cx={150} cy={112} r={16} fill="none" stroke={L.focus} strokeWidth={1.6} />
      <Arw x={142} y={112} dx={14} dy={-3} color={L.field} w={2.2} head={6} />
      <Lbl x={150} y={134} text="山陰: 弱い" color={L.focus} size={10} anchor="middle" />
      <g opacity={blink}>
        <rect x={204} y={52} width={100} height={64} rx={8} fill={L.minus} opacity={0.14} stroke={L.minus} strokeWidth={1.2} />
        <Arw x={218} y={84} dx={26} dy={-4} color={L.minus} w={2.4} />
        <Lbl x={254} y={106} text="ならして1本?" color={L.minus} size={10.5} anchor="middle" />
      </g>
      <Lbl x={160} y={30} text="場所が違えば、矢印も違う" color={L.text} size={11} anchor="middle" />
      <Lbl x={160} y={158} text="ならすと「どの場所か」が消えてしまう" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="どの場所かを言わずに、値だけを語ることはできない" />
    </LevelFig>
  );
}

/** 電場の定義: +1 Cが受ける力。 */
export function EFieldDef() {
  const t = useT();
  const u = pingPong(t, 5);
  const px = 96, py = 92;
  return (
    <LevelFig label="電場はプラス1クーロンが受ける力">
      <circle cx={px} cy={py} r={4} fill={L.dim} />
      <Lbl x={px} y={py - 12} text="この場所" color={L.dim} size={10} anchor="middle" />
      <g opacity={0.35 + 0.65 * u}>
        <circle cx={px} cy={py + 30} r={11} fill={L.plus} opacity={0.85} />
        <Lbl x={px} y={py + 34} text="+1" color="#10202a" size={10.5} anchor="middle" bold />
        <Arw x={px + 14} y={py + 30} dx={54} dy={0} color={L.field} w={3} />
        <Lbl x={px + 44} y={py + 22} text="3 N" color={L.field} size={11} anchor="middle" />
      </g>
      <Arw x={px + 14} y={py} dx={54} dy={0} color={L.field} w={3} />
      <Lbl x={px + 74} y={py + 4} text="E = 3 N/C" color={L.field} size={11.5} bold />
      <Lbl x={18} y={34} text="+1 C を置いたら受ける力の向きと強さ" color={L.text} size={11.5} />
      <Lbl x={18} y={54} text="これを、その場所の電場と決める" color={L.dim} size={10.5} />
      <Lbl x={18} y={152} text="電荷を置かなくても、置いたらどうなるかが書いてある" color={L.dim} size={10.5} />
      <Cap text="電場の単位はN/C。1 Cあたりの力を表している" />
    </LevelFig>
  );
}

/** 正電荷のまわり: 近いほど矢印が長い。 */
export function EFieldNearFar() {
  const t = useT();
  const glow = 0.7 + 0.3 * Math.sin(2.2 * t);
  const cx = 150, cy = 86;
  const dirs = [0, 45, 90, 135, 180, 225, 270, 315];
  const radii = [30, 54];
  return (
    <LevelFig label="正電荷のまわりは近いほど矢印が長い">
      {radii.map(rr => dirs.map(d => {
        const a = (d * Math.PI) / 180;
        const len = 24 * (30 / rr) ** 2;
        return (
          <Arw key={`${rr}-${d}`} x={cx + rr * Math.cos(a)} y={cy + rr * Math.sin(a)}
            dx={len * Math.cos(a)} dy={len * Math.sin(a)} color={L.field} w={2} head={Math.max(4, Math.min(7, len * 0.55))} />
        );
      }))}
      <circle cx={cx} cy={cy} r={12} fill={L.plus} opacity={glow} />
      <Lbl x={cx} y={cy + 4} text="+" color="#10202a" size={15} anchor="middle" bold />
      <Lbl x={18} y={30} text="矢印は外向き" color={L.text} size={11} />
      <Lbl x={18} y={158} text="近いほど長く、遠いほど短い" color={L.focus} size={11.5} />
      <Lbl x={302} y={158} text="長さの式は上級編" color={L.dim} size={10} anchor="end" />
      <Cap text="+1 Cを近くに置くほど、強い力を受ける" />
    </LevelFig>
  );
}

/** 負電荷のまわり: 向きが内向きになる。 */
export function EFieldNegative() {
  const t = useT();
  const glow = 0.7 + 0.3 * Math.sin(2.2 * t);
  const cx = 150, cy = 84;
  const dirs = [0, 45, 90, 135, 180, 225, 270, 315];
  const radii = [40, 64];
  return (
    <LevelFig label="負電荷のまわりは矢印が内向き">
      {radii.map(rr => dirs.map(d => {
        const a = (d * Math.PI) / 180;
        const len = 22 * (40 / rr) ** 2;
        return (
          <Arw key={`${rr}-${d}`} x={cx + rr * Math.cos(a)} y={cy + rr * Math.sin(a)}
            dx={-len * Math.cos(a)} dy={-len * Math.sin(a)} color={L.field} w={2} head={Math.max(4, Math.min(7, len * 0.55))} />
        );
      }))}
      <circle cx={cx} cy={cy} r={12} fill={L.minus} opacity={glow} />
      <Lbl x={cx} y={cy + 5} text="−" color="#ffffff" size={16} anchor="middle" bold />
      <Lbl x={18} y={30} text="矢印は内向き" color={L.text} size={11} />
      <Lbl x={18} y={158} text="+1 C を置くと、引き寄せられる向き" color={L.focus} size={11} />
      <Cap text="向きが反対になるだけで、読み方は変わらない" />
    </LevelFig>
  );
}

/** q 倍すると受ける力も q 倍。 */
export function EFieldForce() {
  const t = useT();
  const which = step(t, 2, 1.8);
  const q = which === 0 ? 1 : 2;
  const px = 70, py = 104;
  return (
    <LevelFig label="電荷をq倍すると受ける力もq倍">
      <Lbl x={18} y={32} text="この場所の電場は右向き 3 N/C" color={L.text} size={11.5} />
      <Arw x={44} y={54} dx={44} dy={0} color={L.field} w={2.4} />
      <Lbl x={94} y={58} text="E = 3 N/C（置く電荷によらない）" color={L.field} size={10.5} />
      <circle cx={px} cy={py} r={q === 1 ? 12 : 17} fill={L.plus} opacity={0.85} />
      <Lbl x={px} y={py + 4} text={`+${q}`} color="#10202a" size={q === 1 ? 11 : 13} anchor="middle" bold />
      <Arw x={px + 20} y={py} dx={q * 44} dy={0} color={L.focus} w={3.5} />
      <Lbl x={px + 20 + q * 44 + 6} y={py + 4} text={`${3 * q} N`} color={L.focus} size={12} bold />
      <Lbl x={18} y={148} text={`F = qE = ${q} C × 3 N/C = ${3 * q} N`} color={L.focus} size={12} bold />
      <Cap text="矢印の地図は変わらず、受ける力だけが比例して変わる" />
    </LevelFig>
  );
}

/** 進む向きに揃った成分だけが効く。 */
export function EFieldComponent() {
  const t = useT();
  const glow = 0.55 + 0.35 * Math.sin(2.8 * t);
  const ox = 82, oy = 104, len = 66, th = (38 * Math.PI) / 180;
  const ex = ox + len * Math.cos(th), ey = oy - len * Math.sin(th);
  return (
    <LevelFig label="進む向きに揃った成分だけが効く">
      <line x1={30} y1={oy} x2={290} y2={oy} stroke={L.path} strokeWidth={2.5} />
      <circle cx={ox} cy={oy} r={8} fill={L.plus} opacity={0.85} />
      <line x1={ex} y1={ey} x2={ex} y2={oy} stroke={L.dim} strokeDasharray="4 3" />
      <Arw x={ox} y={oy} dx={ex - ox} dy={ey - oy} color={L.field} w={3} />
      <Lbl x={ex + 6} y={ey - 2} text="この場所の電場" color={L.field} size={10.5} />
      <g opacity={glow}>
        <Arw x={ox} y={oy} dx={len * Math.cos(th)} dy={0} color={L.focus} w={4.5} />
      </g>
      <Lbl x={ox + len * Math.cos(th) / 2} y={oy + 18} text="右向き成分" color={L.focus} size={11} anchor="middle" />
      <g opacity={0.35}>
        <Arw x={ox} y={oy} dx={0} dy={-len * Math.sin(th)} color={L.normal} w={2.5} />
      </g>
      <Lbl x={18} y={158} text="薄い縦の矢印（直角な成分）は効かない" color={L.normal} size={10.5} />
      <Arw x={200} y={oy + 22} dx={54} dy={0} color={L.path} w={2.5} />
      <Lbl x={227} y={oy + 38} text="右へ 1 m 動く" color={L.path} size={10.5} anchor="middle" />
      <Lbl x={18} y={32} text="仕事に関わるのは、道の向きに揃った成分だけ" color={L.text} size={11} />
      <Cap text="斜めの矢印から、右向きの部分だけを取り出す" />
    </LevelFig>
  );
}

/** 道を小区間に分け、区間ごとに成分を取る。 */
export function PathSum() {
  const t = useT();
  const n = 5;
  const active = step(t, n, 1);
  const x0 = 38, x1 = 288, y = 104;
  const seg = (x1 - x0) / n;
  const angleAt = (i: number) => (58 - i * 16) * Math.PI / 180;
  return (
    <LevelFig label="道を小区間に分けて区間ごとに成分を取る">
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={L.path} strokeWidth={2.5} />
      {Array.from({ length: n + 1 }, (_, i) => (
        <line key={i} x1={x0 + i * seg} y1={y - 6} x2={x0 + i * seg} y2={y + 6} stroke={L.path} strokeWidth={1.6} />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const cx = x0 + (i + 0.5) * seg;
        const a = angleAt(i);
        const len = 36;
        return (
          <g key={i} opacity={i === active ? 1 : 0.4}>
            <Arw x={cx} y={y} dx={len * Math.cos(a)} dy={-len * Math.sin(a)} color={L.field} w={2.2} head={7} />
            {i === active && (
              <>
                <rect x={x0 + i * seg} y={y - 5} width={seg} height={10} fill={L.focus} opacity={0.35} />
                <Arw x={cx} y={y} dx={len * Math.cos(a)} dy={0} color={L.focus} w={3.5} head={7} />
              </>
            )}
          </g>
        );
      })}
      <Lbl x={18} y={32} text="区間の中では、矢印がほぼ一定とみなせる" color={L.text} size={11} />
      <Lbl x={18} y={148} text="（その場所の道向き成分）×（区間の長さ）を全部足す" color={L.focus} size={10.5} />
      <Lbl x={302} y={32} text={`区間 ${active + 1} / ${n}`} color={L.dim} size={10} anchor="end" />
      <Cap text="金色の区間で、道の向きに揃った成分だけを取り出している" />
    </LevelFig>
  );
}

/** 読み方のまとめ。 */
export function MapSummary() {
  const t = useT();
  const phase = step(t, 3, 1.4);
  return (
    <LevelFig label="矢印の地図の読み方のまとめ">
      <g opacity={phase >= 0 ? 1 : 0.3}>
        <rect x={14} y={40} width={90} height={70} rx={8} fill={phase === 0 ? L.focus : L.dim} opacity={phase === 0 ? 0.2 : 0.08} />
        <Arw x={30} y={62} dx={24} dy={-8} color={L.field} w={2} head={6} />
        <Arw x={30} y={84} dx={18} dy={6} color={L.field} w={2} head={6} />
        <Lbl x={59} y={104} text="場所ごとの矢印" color={L.text} size={10} anchor="middle" />
      </g>
      <g opacity={phase >= 1 ? 1 : 0.3}>
        <rect x={114} y={40} width={90} height={70} rx={8} fill={phase === 1 ? L.focus : L.dim} opacity={phase === 1 ? 0.2 : 0.08} />
        <Arw x={128} y={78} dx={30} dy={-22} color={L.field} w={2} head={6} />
        <Arw x={128} y={78} dx={30} dy={0} color={L.focus} w={3} head={7} />
        <Lbl x={159} y={104} text="進む向きの成分" color={L.text} size={10} anchor="middle" />
      </g>
      <g opacity={phase >= 2 ? 1 : 0.3}>
        <rect x={214} y={40} width={92} height={70} rx={8} fill={phase === 2 ? L.focus : L.dim} opacity={phase === 2 ? 0.2 : 0.08} />
        {[0, 1, 2, 3].map(i => (
          <rect key={i} x={228 + i * 16} y={64} width={12} height={20} fill={L.focus} opacity={0.6} />
        ))}
        <Lbl x={260} y={104} text="区間ごとに足す" color={L.text} size={10} anchor="middle" />
      </g>
      <Lbl x={160} y={134} text="電場 = その場所で +1 C が受ける力 [N/C]" color={L.plus} size={11.5} anchor="middle" />
      <Lbl x={160} y={156} text="動く向きが決まれば、取り出す成分も決まる" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="地図を読む、成分を取る、区間ごとに足す" />
    </LevelFig>
  );
}

// ===================== ui-through-a-surface =====================

/** 斜め上へ奥行きを取った、面の平行四辺形。 */
const FACE = { cx: 168, cy: 88, hh: 30, ox: 40, oy: -24 };
function facePt(s: number, u: number): [number, number] {
  return [FACE.cx + s * FACE.ox, FACE.cy + s * FACE.oy + u * FACE.hh];
}
function faceQuad(s0: number, s1: number, u0: number, u1: number): string {
  return [facePt(s0, u0), facePt(s1, u0), facePt(s1, u1), facePt(s0, u1)].map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
}
/** 面を貫く磁場の矢印（面の後ろに描く）。 */
function BArrows({ ys, color = L.field }: { ys: number[]; color?: string }) {
  return (
    <g>
      {ys.map(y => <Arw key={y} x={40} y={y} dx={244} dy={0} color={color} w={2.2} head={8} />)}
    </g>
  );
}

/** 一様な磁場の中に、磁場と垂直な面を置く。 */
export function FluxSetup() {
  const t = useT();
  const glow = 0.7 + 0.25 * Math.sin(2.2 * t);
  return (
    <LevelFig label="一様な磁場の中に垂直な面を置く">
      <BArrows ys={[62, 88, 114]} />
      <polygon points={faceQuad(-1, 1, -1, 1)} fill={L.normal} opacity={0.16} stroke={L.normal} strokeWidth={1.6} />
      <g opacity={glow}>
        <Arw x={FACE.cx} y={FACE.cy} dx={40} dy={0} color={L.normal} w={3} />
      </g>
      <Lbl x={FACE.cx + 46} y={FACE.cy - 6} text="面に垂直な向き" color={L.normal} size={10} />
      <Lbl x={18} y={32} text="B = 2 T の一様な磁場（どこでも同じ向き・強さ）" color={L.text} size={10.5} />
      <Lbl x={18} y={52} text="面は磁場と垂直" color={L.field} size={11} />
      <Lbl x={18} y={152} text="この面をどれだけ通り抜けているかを数えたい" color={L.dim} size={10.5} />
      <Cap text="矢印は磁場、薄い四角は磁場の中に置いた平らな面" />
    </LevelFig>
  );
}

/** 面を4枚のタイルに分ける。 */
export function FluxTiles() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(2.4 * t);
  const cuts: [number, number][] = [[-1, 0], [0, 1]];
  return (
    <LevelFig label="面を4枚のタイルに分ける">
      <BArrows ys={[62, 88, 114]} />
      {cuts.map(([s0, s1]) => cuts.map(([u0, u1]) => (
        <polygon key={`${s0}-${u0}`} points={faceQuad(s0, s1, u0, u1)} fill={L.normal} opacity={0.14} stroke={L.normal} strokeWidth={1.3} />
      )))}
      <g opacity={glow}>
        <polygon points={faceQuad(-1, 0, -1, 0)} fill={L.focus} opacity={0.3} stroke={L.focus} strokeWidth={1.6} />
      </g>
      <Lbl x={18} y={32} text="同じ大きさのタイル4枚に分ける" color={L.text} size={11} />
      <Lbl x={18} y={146} text="タイル1枚 ΔA = 0.5 m²" color={L.focus} size={11.5} bold />
      <Lbl x={302} y={146} text="面全体 2 m²" color={L.dim} size={10.5} anchor="end" />
      <Cap text="小さく分けて1枚ずつ数え、最後に足す作戦" />
    </LevelFig>
  );
}

/** タイル1枚を通る量。 */
export function FluxOneTile() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(3 * t);
  const cuts: [number, number][] = [[-1, 0], [0, 1]];
  return (
    <LevelFig label="タイル1枚を通り抜ける量">
      <BArrows ys={[62, 88, 114]} />
      {cuts.map(([s0, s1]) => cuts.map(([u0, u1]) => (
        <polygon key={`${s0}-${u0}`} points={faceQuad(s0, s1, u0, u1)} fill={L.normal} opacity={0.08} stroke={L.normal} strokeWidth={1.1} />
      )))}
      <polygon points={faceQuad(0, 1, -1, 0)} fill={L.focus} opacity={0.38} stroke={L.focus} strokeWidth={2} />
      <g opacity={glow}>
        <Arw x={150} y={106} dx={90} dy={0} color={L.focus} w={2.8} />
      </g>
      <Lbl x={18} y={32} text="磁場が面に垂直なら、強さ × 面積でよい" color={L.text} size={11} />
      <Lbl x={18} y={140} text="ΔΦ = 2 T × 0.5 m² = 1 Wb" color={L.focus} size={12.5} bold />
      <Lbl x={18} y={158} text="単位は T·m²。これに付けた別名が Wb" color={L.dim} size={10.5} />
      <Cap text="金色の1枚だけを見て、その1枚分を数えている" />
    </LevelFig>
  );
}

/** T·m² に付けた別名が Wb。 */
export function FluxUnits() {
  const t = useT();
  const phase = step(t, 3, 1.3);
  const chips = [
    { x: 14, w: 96, text: '2 T × 0.5 m²', color: L.field },
    { x: 128, w: 74, text: '1 T·m²', color: L.focus },
    { x: 220, w: 84, text: '1 Wb', color: L.plus },
  ];
  return (
    <LevelFig label="テスラかける平方メートルの別名がウェーバ">
      {chips.map((chip, i) => (
        <g key={chip.text} opacity={i <= phase ? 1 : 0.2}>
          <rect x={chip.x} y={58} width={chip.w} height={40} rx={7}
            fill={chip.color} opacity={i === phase ? 0.24 : 0.1} stroke={chip.color} strokeWidth={1.2} />
          <Lbl x={chip.x + chip.w / 2} y={83} text={chip.text} color={chip.color} size={11.5} anchor="middle" bold={i === 2} />
        </g>
      ))}
      <Arw x={112} y={78} dx={14} dy={0} color={L.dim} w={2} head={6} />
      <Arw x={204} y={78} dx={14} dy={0} color={L.dim} w={2} head={6} />
      <Lbl x={18} y={32} text="掛けるのは、磁場の強さとタイルの面積" color={L.text} size={11.5} />
      <Lbl x={160} y={128} text="T·m² に付けた別名が Wb（ウェーバ）" color={L.plus} size={12} anchor="middle" bold />
      <Lbl x={160} y={152} text="この 1 Wb が、タイル1枚が通す量" color={L.dim} size={10.5} anchor="middle" />
      <Cap text="数だけでなく単位も掛ける。答えの単位がWbなら磁束" />
    </LevelFig>
  );
}

/** 4枚を足して4 Wb。 */
export function FluxSum4() {
  const t = useT();
  const shown = Math.min(step(t, 5, 0.9) + 1, 4);
  const tiles: [number, number][] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
  return (
    <LevelFig label="4枚のタイルの寄与を足す">
      <BArrows ys={[62, 88, 114]} />
      {tiles.map(([s0, u0], i) => (
        <polygon key={i} points={faceQuad(s0, s0 + 1, u0, u0 + 1)}
          fill={i < shown ? L.focus : L.normal} opacity={i < shown ? (i === shown - 1 ? 0.45 : 0.28) : 0.08}
          stroke={i < shown ? L.focus : L.normal} strokeWidth={1.3} />
      ))}
      <Lbl x={18} y={32} text="どのタイルも同じ 1 Wb" color={L.text} size={11} />
      <Lbl x={18} y={140} text={`足した分 = ${shown} Wb`} color={L.focus} size={12.5} bold />
      <Lbl x={302} y={140} text={`${shown} / 4 枚`} color={L.dim} size={10.5} anchor="end" />
      <Lbl x={18} y={158} text={shown === 4 ? 'Φ = 1 + 1 + 1 + 1 = 4 Wb' : ''} color={L.plus} size={11.5} />
      <Cap text="タイルが1枚ずつ増えるたび、合計が1 Wbずつ増える" />
    </LevelFig>
  );
}

/** 真横から見た図の部品: 面を線分として描く。 */
function SideFace({ cx, cy, half, deg, color = L.normal }: { cx: number; cy: number; half: number; deg: number; color?: string }) {
  const th = (deg * Math.PI) / 180;
  const dx = half * Math.sin(th), dy = half * Math.cos(th);
  return <line x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy} stroke={color} strokeWidth={4} strokeLinecap="round" />;
}

/** 面を磁場と平行に寝かせると0 Wb。 */
export function FluxParallel() {
  const t = useT();
  const blink = 0.62 + 0.3 * Math.sin(3.2 * t);
  const cx = 160, cy = 96;
  return (
    <LevelFig label="面を磁場と平行にすると通る量は0">
      <Arw x={36} y={66} dx={244} dy={0} color={L.field} w={2.2} />
      <Arw x={36} y={96} dx={244} dy={0} color={L.field} w={2.2} />
      <Arw x={36} y={126} dx={244} dy={0} color={L.field} w={2.2} />
      <SideFace cx={cx} cy={cy - 2} half={62} deg={90} />
      <Arw x={cx} y={cy - 4} dx={0} dy={-34} color={L.normal} w={2.6} />
      <Lbl x={cx + 6} y={cy - 40} text="面に垂直な向き" color={L.normal} size={10} />
      <Lbl x={18} y={30} text="真横から見た図。太い線が面（磁場と平行）" color={L.text} size={10.5} />
      <g opacity={blink}>
        <Lbl x={160} y={150} text="磁場は面をかすめるだけ → Φ = 0 Wb" color={L.minus} size={12} anchor="middle" bold />
      </g>
      <Cap text="面に垂直な成分が0なので、通り抜ける量も0" />
    </LevelFig>
  );
}

/** 斜めにすると、正面から見た面積が縮む。 */
export function FluxTilt() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(2.4 * t);
  const cx = 150, cy = 92, half = 60, deg = 60;
  const th = (deg * Math.PI) / 180;
  const dx = half * Math.sin(th), dy = half * Math.cos(th);
  return (
    <LevelFig label="面を傾けると正面から見た面積が縮む">
      <Arw x={30} y={56} dx={120} dy={0} color={L.field} w={2.2} />
      <Arw x={30} y={92} dx={120} dy={0} color={L.field} w={2.2} />
      <Arw x={30} y={128} dx={120} dy={0} color={L.field} w={2.2} />
      <SideFace cx={cx} cy={cy} half={half} deg={deg} />
      <line x1={cx - dx} y1={cy - dy} x2={266} y2={cy - dy} stroke={L.dim} strokeDasharray="4 3" />
      <line x1={cx + dx} y1={cy + dy} x2={266} y2={cy + dy} stroke={L.dim} strokeDasharray="4 3" />
      <g opacity={glow}>
        <line x1={258} y1={cy - dy} x2={258} y2={cy + dy} stroke={L.focus} strokeWidth={3.5} />
      </g>
      <Lbl x={264} y={cy + 4} text="正面から" color={L.focus} size={10} />
      <Lbl x={264} y={cy + 18} text="見た広さ" color={L.focus} size={10} />
      <Lbl x={18} y={28} text="真横から見た図。面を傾けた場合" color={L.text} size={10.5} />
      <Lbl x={18} y={152} text="正面から見た面積が半分 → Φ = 2 × 1 = 2 Wb" color={L.focus} size={11} />
      <Cap text="縮んだのは、磁場の側から見た面の広さ" />
    </LevelFig>
  );
}

/** 磁場を、面に垂直な成分と面に沿う成分に分ける。 */
export function FluxNormalComp() {
  const t = useT();
  const glow = 0.6 + 0.3 * Math.sin(2.6 * t);
  const cx = 140, cy = 96, half = 58, deg = 60;
  const th = (deg * Math.PI) / 180;
  const nx = Math.cos(th), ny = -Math.sin(th);
  const sx = Math.sin(th), sy = Math.cos(th);
  const s = 34; // 1 T あたりの画素
  const bx = 2 * s;
  const px = cx, py = cy;
  return (
    <LevelFig label="磁場を面に垂直な成分と面に沿う成分に分ける">
      <SideFace cx={cx} cy={cy} half={half} deg={deg} />
      <Arw x={px} y={py} dx={bx} dy={0} color={L.field} w={3} />
      <Lbl x={px + bx + 6} y={py + 4} text="B = 2 T" color={L.field} size={11} />
      <g opacity={glow}>
        <Arw x={px} y={py} dx={1 * s * nx} dy={1 * s * ny} color={L.normal} w={3.5} />
      </g>
      <Lbl x={px + s * nx + 4} y={py + s * ny - 6} text="垂直成分 1 T" color={L.normal} size={10.5} />
      <Arw x={px} y={py} dx={Math.sqrt(3) * s * sx} dy={Math.sqrt(3) * s * sy} color={L.dim} w={2.4} />
      <Lbl x={px + Math.sqrt(3) * s * sx + 4} y={py + Math.sqrt(3) * s * sy + 10} text="面に沿う成分" color={L.dim} size={10} />
      <Lbl x={18} y={28} text="真横から見た図。通り抜けるのは垂直成分だけ" color={L.text} size={10.5} />
      <Lbl x={18} y={152} text="Φ = 1 T × 2 m² = 2 Wb（傾けた図と同じ値）" color={L.focus} size={11} />
      <Cap text="面に沿う成分は、面を通り抜けていない" />
    </LevelFig>
  );
}

/** 本数という言い方と、その注意。 */
export function FluxLines() {
  const t = useT();
  const shift = (t * 14) % 26;
  const cuts: [number, number][] = [[-1, 0], [0, 1]];
  return (
    <LevelFig label="磁束を線の本数として数える言い方">
      {[0, 1, 2, 3].map(i => (
        <Arw key={i} x={40 + ((shift + i * 6) % 20)} y={54 + i * 22} dx={224} dy={0} color={L.field} w={1.8} head={7} />
      ))}
      {cuts.map(([s0, s1]) => cuts.map(([u0, u1]) => (
        <polygon key={`${s0}-${u0}`} points={faceQuad(s0, s1, u0, u1)} fill={L.normal} opacity={0.12} stroke={L.normal} strokeWidth={1.2} />
      )))}
      <Lbl x={18} y={30} text="面を通る線の本数として数える言い方" color={L.text} size={11} />
      <Lbl x={18} y={148} text="磁力線は、向きと強さを描くために引いた線" color={L.minus} size={10.5} />
      <Lbl x={18} y={162} text="空間に張られた実物のひもではない" color={L.minus} size={10} />
      <Cap text="本数の比喩は便利。ただし実体があるわけではない" />
    </LevelFig>
  );
}

/** 垂直成分×小面積の和としてまとめる。 */
export function FluxSigma() {
  const t = useT();
  const glow = 0.65 + 0.3 * Math.sin(2.2 * t);
  const tiles: [number, number][] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
  return (
    <LevelFig label="垂直成分かける小面積の和">
      <BArrows ys={[62, 88, 114]} />
      {tiles.map(([s0, u0], i) => {
        const c = facePt(s0 + 0.5, u0 + 0.5);
        return (
          <g key={i}>
            <polygon points={faceQuad(s0, s0 + 1, u0, u0 + 1)} fill={L.focus} opacity={0.3} stroke={L.focus} strokeWidth={1.4} />
            <text x={c[0]} y={c[1] + 4} fontSize={9.5} fill={L.text} textAnchor="middle">{`ΔΦ${'₁₂₃₄'[i]}`}</text>
          </g>
        );
      })}
      <g opacity={glow}>
        <Lbl x={18} y={144} text="Φ ≈ Σ（垂直成分）×（そのタイルの面積）" color={L.focus} size={11.5} bold />
      </g>
      <Lbl x={18} y={30} text="タイルごとの寄与を作って、全部足す" color={L.text} size={11} />
      <Lbl x={18} y={160} text="ここでは 1 + 1 + 1 + 1 = 4 Wb" color={L.dim} size={10.5} />
      <Cap text="この章で作った数え方を、一つの形にまとめたもの" />
    </LevelFig>
  );
}

/** 予告: タイルを細かくすると Σ が ∫ に変わる。 */
export function FluxIntegralPreview() {
  const t = useT();
  const u = pingPong(t, 7);
  const n = 2 + Math.round(4 * u);
  const cells = Array.from({ length: n }, (_, i) => i);
  return (
    <LevelFig label="タイルを細かくするとシグマがインテグラルになる">
      <BArrows ys={[62, 88, 114]} />
      {cells.map(i => cells.map(j => (
        <polygon key={`${i}-${j}`}
          points={faceQuad(-1 + (2 * i) / n, -1 + (2 * (i + 1)) / n, -1 + (2 * j) / n, -1 + (2 * (j + 1)) / n)}
          fill={L.focus} opacity={0.26} stroke={L.focus} strokeWidth={0.8} />
      )))}
      <Lbl x={18} y={30} text={`タイル ${n * n} 枚`} color={L.text} size={11} />
      <Lbl x={18} y={144} text="Σ B⊥ ΔA  →  ∫ B · dA" color={L.plus} size={13} bold />
      <Lbl x={18} y={162} text="曲がった面まで扱えるようにすると、記号が変わる" color={L.dim} size={10} />
      <Cap text="足しているものは、どの段階でも同じ" />
    </LevelFig>
  );
}

export const ui_mathFigures: Record<string, () => JSX.Element> = {
  'uix-avg-run': AvgRun,
  'uix-avg-real': AvgReal,
  'uix-quad-path': QuadPath,
  'uix-avg-1s': Avg1s,
  'uix-avg-half': AvgHalf,
  'uix-avg-table': AvgTable,
  'uix-secant-zoom': SecantZoom,
  'uix-zero-divide': ZeroDivide,
  'uix-limit-arrow': LimitArrow,
  'uix-h-general': HGeneral,
  'uix-dxdt-preview': DxDtPreview,
  'uix-vt-rect': VtRect,
  'uix-vt-multiply': VtMultiply,
  'uix-vt-area': VtArea,
  'uix-vt-steps': VtSteps,
  'uix-vt-piece1': VtPiece1,
  'uix-vt-piece23': VtPiece23,
  'uix-vt-total': VtTotal,
  'uix-sigma-def': SigmaDef,
  'uix-sigma-words': SigmaWords,
  'uix-area-is-distance': AreaIsDistance,
  'uix-tiles-recall': TilesRecall,
  'uix-curve-gap': CurveGap,
  'uix-lower-4': Lower4,
  'uix-upper-4': Upper4,
  'uix-sandwich-4': Sandwich4,
  'uix-tiles-switch': TilesSwitch,
  'uix-gap-table': GapTable,
  'uix-squeeze': Squeeze,
  'uix-integral-symbol': IntegralSymbol,
  'uix-comp-along': CompAlong,
  'uix-comp-work20': CompWork20,
  'uix-comp-up': CompUp,
  'uix-comp-split': CompSplit,
  'uix-comp-work12': CompWork12,
  'uix-comp-wrong': CompWrong,
  'uix-comp-angle': CompAngle,
  'uix-comp-three': CompThree,
  'uix-comp-rule': CompRule,
  'uix-dot-preview': DotPreview,
  'uix-wind-map': WindMap,
  'uix-wind-vary': WindVary,
  'uix-efield-def': EFieldDef,
  'uix-efield-near-far': EFieldNearFar,
  'uix-efield-negative': EFieldNegative,
  'uix-efield-force': EFieldForce,
  'uix-efield-component': EFieldComponent,
  'uix-path-sum': PathSum,
  'uix-map-summary': MapSummary,
  'uix-flux-setup': FluxSetup,
  'uix-flux-tiles': FluxTiles,
  'uix-flux-one-tile': FluxOneTile,
  'uix-flux-units': FluxUnits,
  'uix-flux-sum4': FluxSum4,
  'uix-flux-parallel': FluxParallel,
  'uix-flux-tilt': FluxTilt,
  'uix-flux-normal-comp': FluxNormalComp,
  'uix-flux-lines': FluxLines,
  'uix-flux-sigma': FluxSigma,
  'uix-flux-integral-preview': FluxIntegralPreview,
};

export const ui_mathReadings: Record<string, string> = {
  'uix-avg-run': '道の端から端までが100 m、下に出る経過時間が20 sです。この二つを割った一つの値が平均の速さであることを確かめてください。',
  'uix-avg-real': '棒の高さがその区間の速さです。点線の平均5 m/sに対して、0 m/sの区間と8 m/sの区間があることを見てください。',
  'uix-quad-path': '横軸が時刻、縦軸が位置です。同じ1秒でも、後の1秒のほうが位置の増え方が大きいことを見てください。',
  'uix-avg-1s': '2点を結ぶ金色の直線の傾きが、その区間の平均の速さです。点線の縦がΔx、横がΔtにあたります。',
  'uix-avg-half': '灰色の点線が幅1 sのとき、金色が幅0.5 sのときの直線です。幅を縮めると傾きが小さくなることを見てください。',
  'uix-avg-table': '上から順に区間の幅が狭くなります。右の平均の値が、10 m/sへ近づいていく様子に注目してください。',
  'uix-secant-zoom': '金色が2点を結ぶ直線、緑の点線が落ち着き先の直線です。スライダーで幅を変えると、傾きの数値も変わります。',
  'uix-zero-divide': '左は幅を0にした場合、右は0へ近づけた場合です。左が決まらないのに対し、右は値が一つに寄ることを見比べてください。',
  'uix-limit-arrow': '数直線の上に、幅を縮めた順に平均の値が並びます。点が10 m/sの目盛りへ寄っていくことを見てください。',
  'uix-h-general': '上から順に、位置の展開・差・約分の三行が出ます。三行目で h が消えず 10 + 5h の形に残ることを確かめてください。',
  'uix-dxdt-preview': '曲線に沿った三角形の横がdt、縦がdxです。三角形が小さくなっても、斜めの線の傾きが変わらないことを見てください。',
  'uix-vt-rect': '点の進む速さは一定です。下の表示で、経過時間と進んだ距離が同じ割合で増えていくことを確かめてください。',
  'uix-vt-multiply': '1 sぶんの3 mの箱が、左から4個並びます。同じ3 mを4回足すことと、3×4の掛け算が同じであることを見てください。',
  'uix-vt-area': '縦軸が速さ、横軸が時刻です。塗られた長方形の面積が距離で、単位は (m/s)×s = mになります。',
  'uix-vt-steps': '区間ごとに棒の高さが違います。掛けるべき高さが一つに決まらないことを確かめてください。',
  'uix-vt-piece1': '金色に囲まれた区間だけを見ています。その区間の中では速さが一定なので、長方形1個で数えられます。',
  'uix-vt-piece23': '2本目と3本目の棒が順に金色になります。幅は同じ1 sでも、高さが違えば面積が違うことを見てください。',
  'uix-vt-total': '棒が1本ずつ増えるたび、左上の合計が増えます。足しているのが面積であることを確かめてください。',
  'uix-sigma-def': '並んだ三つの箱が a₁、a₂、a₃です。下の式が、その全部を足すという指示であることを見てください。',
  'uix-sigma-words': '左の棒の2・3・4と、下の式の2+3+4が同じ金色です。日本語の言い方と記号が同じものを指していることを見てください。',
  'uix-area-is-distance': '緑の線が順に太くなり、縦が速さ、横が時間、その積が距離であることを示します。面積の合計が距離になる理由を確かめてください。',
  'uix-tiles-recall': '緑の折れ線と、長方形の上端がぴったり重なっています。すき間がないので、この合計は近似ではありません。',
  'uix-curve-gap': '金色の帯の高さが、1〜1.5 sの区間の中で速さが動く幅です。代表の値を一つ選べないことを見てください。',
  'uix-lower-4': '棒の高さは各区間の左端の速さです。どの棒も曲線の下に収まっていることを確かめてください。',
  'uix-upper-4': '棒の高さは各区間の右端の速さです。どの棒も曲線を上にはみ出していることを確かめてください。',
  'uix-sandwich-4': '点線が上端の和、塗りが下端の和です。真の距離が必ずこの二つの間に入ることを見てください。',
  'uix-tiles-switch': 'スライダーで区間の数を4・8・16と切り替えられます。下端と上端の差の数値が半分ずつになることを見てください。',
  'uix-gap-table': '区間の数が増えるほど、右端の差が小さくなります。2.00、1.00、0.50という縮み方に注目してください。',
  'uix-squeeze': '横棒の左端が下端の和、右端が上端の和です。棒が短くなり、緑の線の位置へ挟み込まれることを見てください。',
  'uix-integral-symbol': '細い棒が左から順に足されていきます。1本1本が「その場所の速さ×小さな幅」であることを確かめてください。',
  'uix-comp-along': '力の矢印の向きと、箱が動く向きが同じです。動いた距離に比例して仕事が増えることを見てください。',
  'uix-comp-work20': '上から力・距離・仕事の順に行が出ます。数と一緒に単位も掛かり、N×mがJになる対応を確かめてください。',
  'uix-comp-up': '力の矢印は真上、箱は右へ動いています。右向きの成分がないので仕事が0になることを確かめてください。',
  'uix-comp-split': '斜めの矢印から下ろした点線が、右向き6 Nと上向き8 Nの二つの矢印を作ります。三辺が6・8・10になっています。',
  'uix-comp-work12': '上向き8 Nは薄く描いてあります。箱を右へ動かしているのは金色の6 Nだけであることを見てください。',
  'uix-comp-wrong': '上の枠が矢印の長さをそのまま掛けた場合、下の枠が右向き成分を掛けた場合です。差の8 N分がどこから来たかを見てください。',
  'uix-comp-angle': 'スライダーで力の角度を変えられます。矢印の長さは変わらないのに、床に沿った金色の矢印だけが短くなることを見てください。',
  'uix-comp-three': '三つの行で、力の大きさ10 Nと移動2 mは共通です。右向き成分の欄だけが違い、それが仕事の違いになっています。',
  'uix-comp-rule': '左から順に、矢印を分ける・進む向きの成分を選ぶ・距離に掛ける、の三つの手順が示されます。',
  'uix-dot-preview': '床に沿った金色の矢印がF cosθです。右の二つの式が、同じ操作の別の書き方であることを見てください。',
  'uix-wind-map': '格子の各点に矢印が置かれています。場所によって向きも長さも違うことを確かめてください。',
  'uix-wind-vary': '左の二つの丸で、矢印の長さが大きく違います。右の枠のように1本へならすと、場所の情報が消えてしまいます。',
  'uix-efield-def': '上の矢印が電場、下は+1 Cを置いたときに受ける力です。二つが同じ向き・同じ長さであることを見てください。',
  'uix-efield-near-far': '内側の矢印ほど長く描かれています。矢印はすべて外向きで、近いほど強いことを確かめてください。',
  'uix-efield-negative': '矢印がすべて中心を向いています。正電荷のときと向きだけが反対で、近いほど長いことは同じです。',
  'uix-efield-force': '上の電場の矢印は変わりません。置く電荷が1 Cから2 Cに変わると、受ける力の矢印だけが2倍になります。',
  'uix-efield-component': '斜めの矢印から下ろした成分のうち、道に沿った金色の矢印だけが仕事に関わります。薄い縦の矢印は効きません。',
  'uix-path-sum': '道が5つの区間に区切られ、区間ごとに矢印の向きが違います。金色の区間で、道の向きの成分が取り出されています。',
  'uix-map-summary': '左から、場所ごとの矢印・進む向きの成分・区間ごとの和、の三つが順に光ります。読み方の手順を確かめてください。',
  'uix-flux-setup': '横向きの矢印が一様な磁場、薄い四角がその中に置いた面です。白い矢印が面に垂直な向きを表します。',
  'uix-flux-tiles': '面が4枚のタイルに分かれています。1枚が0.5 m²、全体が2 m²であることを確かめてください。',
  'uix-flux-one-tile': '金色の1枚だけに注目しています。この1枚を通る量が、磁場の強さ×そのタイルの面積で出ます。',
  'uix-flux-units': '左から、掛ける前・掛けた単位・その別名の三つが並びます。T·m²とWbが同じ単位であることを確かめてください。',
  'uix-flux-sum4': 'タイルが1枚ずつ金色になり、そのたび合計が1 Wbずつ増えます。4枚で4 Wbになることを確かめてください。',
  'uix-flux-parallel': '真横から見た図です。太い横線が面で、磁場の矢印は面をかすめるだけで通り抜けていません。',
  'uix-flux-tilt': '真横から見た図です。傾いた面を右端へ写した金色の線が、正面から見たときの広さにあたります。',
  'uix-flux-normal-comp': '真横から見た図です。磁場の矢印が、面に垂直な白い成分と、面に沿う灰色の成分に分かれています。',
  'uix-flux-lines': '面を通る線の本数として数えています。この線は向きと強さを描くための線で、実物のひもではありません。',
  'uix-flux-sigma': '4枚のタイルそれぞれにΔΦの番号が付いています。この四つを足したものが、面全体の磁束です。',
  'uix-flux-integral-preview': 'タイルの数が増えたり減ったりします。細かくしても、足しているものが変わらないことを確かめてください。',
};
