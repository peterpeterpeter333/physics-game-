import { useT, C } from "./anim";
import { FigSvg, Caption } from "./mechanics";

// 数学の武器庫: 「全ステップに図解」体制のための追加図解 (14種)

const Axes = ({ xl, yl }: { xl: string; yl: string }) => (
  <g stroke={C.dim} strokeWidth={1.5} fill={C.dim}>
    <line x1={45} y1={150} x2={295} y2={150} />
    <line x1={45} y1={150} x2={45} y2={25} />
    <text x={288} y={165} fontSize={11} stroke="none">{xl}</text>
    <text x={20} y={35} fontSize={11} stroke="none">{yl}</text>
  </g>
);

const arrowHead = (x: number, y: number, dx: number, dy: number, color: string) => {
  const l = Math.hypot(dx, dy) || 1;
  const ux = dx / l, uy = dy / l;
  return <polygon points={`${x + 8 * ux},${y + 8 * uy} ${x - 4 * uy},${y + 4 * ux} ${x + 4 * uy},${y - 4 * ux}`} fill={color} />;
};

/** 平均の速さ vs 速度メーター: 信号待ちも小走りも平均はならしてしまう */
export function AvgVsInstant() {
  const t = useT();
  const u = (t % 6) / 6;
  // 速さのプロファイル: 歩く→止まる→小走り→歩く
  const speedAt = (s: number) => (s < 0.3 ? 1 : s < 0.5 ? 0 : s < 0.75 ? 1.8 : 1);
  const pts: string[] = [];
  let dist = 0;
  for (let i = 0; i <= 100; i++) {
    const s = i / 100;
    pts.push(`${45 + 250 * s},${150 - 55 * speedAt(s)}`);
  }
  for (let i = 0; i < 100 * u; i++) dist += speedAt(i / 100) / 100;
  const avg = 0.3 * 1 + 0.2 * 0 + 0.25 * 1.8 + 0.25 * 1;
  return (
    <FigSvg>
      <Axes xl="時間" yl="速さ" />
      <polyline points={pts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <line x1={45} y1={150 - 55 * avg} x2={295} y2={150 - 55 * avg} stroke={C.gold} strokeDasharray="5 4" strokeWidth={2} />
      <circle cx={45 + 250 * u} cy={150 - 55 * speedAt(u)} r={6} fill={C.cyan} />
      <text x={200} y={150 - 55 * avg - 8} fontSize={11} fill={C.gold}>平均の速さ (割り算の答え)</text>
      <text x={52} y={40} fontSize={11} fill={C.cyan}>メーターの針 = その瞬間の速さ</text>
      <text x={130} y={140} fontSize={10} fill={C.dim}>信号待ち</text>
      <Caption text="割り算は区間全体をならしてしまう。瞬間を知るには区間を縮めるしかない" />
    </FigSvg>
  );
}

/** Δt を縮めると平均の速さが1つの数に吸い寄せられる (数値実験) */
export function DeltaToD() {
  const t = useT();
  const step = Math.floor(t / 1.1) % 5;
  const rows = [
    ["Δt = 1", "15"],
    ["Δt = 0.1", "10.5"],
    ["Δt = 0.01", "10.05"],
    ["Δt = 0.001", "10.005"],
    ["Δt → 0", "10 (行き先)"],
  ];
  return (
    <FigSvg>
      <text x={20} y={30} fontSize={11.5} fill="#fff">x = 5t² の、t=1 からの平均の速さ Δx/Δt</text>
      {rows.map((r, i) => (
        <g key={i} opacity={i <= step ? 1 : 0.18}>
          <text x={30} y={56 + i * 22} fontSize={12} fill={i === 4 ? C.gold : C.cyan}>{r[0]}</text>
          <text x={150} y={56 + i * 22} fontSize={12} fill={i === 4 ? C.gold : "#fff"}>{r[1]} m/s</text>
        </g>
      ))}
      <text x={200} y={130} fontSize={11} fill={C.dim}>Δ = 有限の差</text>
      <text x={200} y={146} fontSize={11} fill={C.gold}>d = 限りなく小さい差</text>
      <Caption text="区間を縮めるほど答えは10に落ち着く。その行き先を dx/dt と書く" />
    </FigSvg>
  );
}

/** 積分定数C: 傾きが同じ曲線は上下にずれた家族。初期条件が1本を選ぶ */
export function AntiderivativeFamily() {
  const t = useT();
  const pick = Math.floor(t / 1.5) % 4;
  const curves = [0, 1, 2, 3].map((k) => {
    const pts: string[] = [];
    for (let x = 45; x <= 280; x += 5) {
      const u = (x - 45) / 235;
      pts.push(`${x},${(145 - 70 * u * u - 22 * k).toFixed(1)}`);
    }
    return pts.join(" ");
  });
  return (
    <FigSvg>
      <Axes xl="t" yl="x" />
      {curves.map((c, k) => (
        <polyline key={k} points={c} fill="none" stroke={k === pick ? C.gold : C.cyan} strokeWidth={k === pick ? 3 : 1.5} opacity={k === pick ? 1 : 0.45} />
      ))}
      <circle cx={45} cy={145 - 22 * pick} r={6} fill={C.gold} />
      <text x={54} y={149 - 22 * pick} fontSize={10.5} fill={C.gold}>初期条件 x(0)</text>
      <text x={150} y={40} fontSize={11} fill="#fff">どの曲線も傾き(微分)は同じ</text>
      <text x={150} y={56} fontSize={11} fill={C.dim}>違いは上下のずれ = C</text>
      <Caption text="微分は出発点を忘れる。だから逆再生には C が付き、初期条件が1本を選ぶ" />
    </FigSvg>
  );
}

/** 偏微分: 山の高さh(x,y)。東向きの傾きと北向きの傾きを別々に測る */
export function PartialHill() {
  const t = useT();
  const east = Math.floor(t / 1.8) % 2 === 0;
  const cx = 150, cy = 92;
  const rings = [22, 44, 66, 88];
  return (
    <FigSvg>
      {rings.map((r, i) => (
        <ellipse key={r} cx={cx} cy={cy} rx={r * 1.25} ry={r * 0.7} fill="none" stroke={C.dim} strokeWidth={1.2} opacity={0.8 - i * 0.12} />
      ))}
      <text x={cx - 8} y={cy + 4} fontSize={10} fill={C.dim}>山頂</text>
      <circle cx={cx + 40} cy={cy + 30} r={6} fill={C.gold} />
      <g opacity={east ? 1 : 0.25}>
        <line x1={cx + 40} y1={cy + 30} x2={cx + 90} y2={cy + 30} stroke={C.cyan} strokeWidth={3} />
        {arrowHead(cx + 90, cy + 30, 1, 0, C.cyan)}
        <text x={cx + 44} y={cy + 52} fontSize={11} fill={C.cyan}>∂h/∂x: 東へ (北は凍結)</text>
      </g>
      <g opacity={east ? 0.25 : 1}>
        <line x1={cx + 40} y1={cy + 30} x2={cx + 40} y2={cy - 20} stroke={C.purple} strokeWidth={3} />
        {arrowHead(cx + 40, cy - 20, 0, -1, C.purple)}
        <text x={cx - 100} y={cy - 24} fontSize={11} fill={C.purple}>∂h/∂y: 北へ (東は凍結)</text>
      </g>
      <Caption text="∂ =「他の変数は凍結して」その方向の傾きだけ測る印" />
    </FigSvg>
  );
}

/** テイラー展開: 1次(直線)→2次(放物線)と近似が曲線に寄り添っていく */
export function TaylorApprox() {
  const t = useT();
  const order = Math.floor(t / 1.6) % 3; // 0:直線 1:2次 2:3次
  const f = (x: number) => Math.sin(x);
  const approx = (x: number) => (order === 0 ? x : order === 1 ? x : x - (x * x * x) / 6);
  const sx = (x: number) => 160 + 60 * x;
  const sy = (y: number) => 95 - 55 * y;
  const cur: string[] = [];
  const app: string[] = [];
  for (let i = -40; i <= 40; i++) {
    const x = i / 18;
    cur.push(`${sx(x)},${sy(f(x)).toFixed(1)}`);
    const ya = approx(x);
    if (Math.abs(ya) < 1.9) app.push(`${sx(x)},${sy(ya).toFixed(1)}`);
  }
  const labels = ["1次: f(0)+f′(0)x (直線)", "1次のまま (sinは2次の項が0)", "3次: x − x³/6 まで"];
  return (
    <FigSvg>
      <line x1={20} y1={95} x2={300} y2={95} stroke={C.dim} strokeWidth={1} />
      <line x1={160} y1={25} x2={160} y2={165} stroke={C.dim} strokeWidth={1} />
      <polyline points={cur.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <polyline points={app.join(" ")} fill="none" stroke={C.gold} strokeWidth={2} strokeDasharray={order === 2 ? "" : "6 4"} />
      <text x={26} y={36} fontSize={11} fill={C.cyan}>y = sin x</text>
      <text x={26} y={52} fontSize={11} fill={C.gold}>{labels[order]}</text>
      <Caption text="原点の近くでは、項を増やすほど遠くまで曲線に寄り添う" />
    </FigSvg>
  );
}

/** ベクトルの等式 = 成分ごとの等式の束 (F = ma を3本にほどく) */
export function VectorBundle() {
  const t = useT();
  const open = (t % 4) > 2;
  return (
    <FigSvg>
      <rect x={22} y={70} width={110} height={44} rx={10} fill="none" stroke={C.gold} strokeWidth={2.5} />
      <text x={44} y={98} fontSize={16} fill={C.gold}>F = m a</text>
      <text x={26} y={62} fontSize={10.5} fill={C.dim}>矢印付きの1本</text>
      <polygon points="150,92 164,84 164,100" fill={C.dim} />
      <g opacity={open ? 1 : 0.3}>
        {["Fx = m·ax", "Fy = m·ay", "Fz = m·az"].map((s, i) => (
          <g key={s}>
            <rect x={180} y={40 + i * 40} width={112} height={30} rx={8} fill="none" stroke={C.cyan} strokeWidth={1.8} />
            <text x={196} y={60 + i * 40} fontSize={13} fill={C.cyan}>{s}</text>
          </g>
        ))}
      </g>
      <text x={182} y={166} fontSize={10.5} fill={C.dim}>ほどくと3本の「ふつうの式」</text>
      <Caption text="ベクトルの等式は式の束。解くときは1本ずつほどく" />
    </FigSvg>
  );
}

/** 大きさは三平方: 成分が直角三角形の2辺、矢印が斜辺 */
export function PythagorasVec() {
  const t = useT();
  const ph = Math.floor(t / 1.3) % 3;
  const ox = 80, oy = 140, ax = 150, ay = 90;
  return (
    <FigSvg>
      <rect x={ox} y={oy} width={ax} height={26} fill={C.cyan} opacity={ph >= 0 ? 0.25 : 0} />
      <text x={ox + 40} y={oy + 18} fontSize={11} fill={C.cyan}>Ax² (=3²=9)</text>
      <rect x={ox + ax} y={oy - ay} width={26} height={ay} fill={C.purple} opacity={ph >= 1 ? 0.25 : 0.05} />
      <text x={ox + ax + 30} y={oy - ay / 2} fontSize={11} fill={C.purple} opacity={ph >= 1 ? 1 : 0.3}>Ay² (=16)</text>
      <line x1={ox} y1={oy} x2={ox + ax} y2={oy} stroke={C.cyan} strokeWidth={4} />
      <line x1={ox + ax} y1={oy} x2={ox + ax} y2={oy - ay} stroke={C.purple} strokeWidth={4} />
      <line x1={ox} y1={oy} x2={ox + ax} y2={oy - ay} stroke={C.gold} strokeWidth={4} />
      {arrowHead(ox + ax, oy - ay, ax, -ay, C.gold)}
      <text x={ox + 40} y={oy - 50} fontSize={12} fill={C.gold} opacity={ph >= 2 ? 1 : 0.4}>|A| = √(9+16) = 5</text>
      <text x={ox + ax / 2 - 10} y={oy - 4} fontSize={11} fill={C.cyan}>Ax = 3</text>
      <text x={ox + ax + 6} y={oy - ay - 6} fontSize={11} fill={C.purple}>Ay = 4</text>
      <Caption text="成分は直角三角形の2辺、矢印本体は斜辺 — 三平方の定理そのもの" />
    </FigSvg>
  );
}

/** 内積の成分計算: x̂·x̂=1、x̂·ŷ=0 で混ざり項が全滅する */
export function DotComponents() {
  const t = useT();
  const ph = Math.floor(t / 1.4) % 4;
  const terms = [
    { s: "Ax·Bx (x̂·x̂ = 1)", keep: true },
    { s: "Ax·By (x̂·ŷ = 0)", keep: false },
    { s: "Ay·Bx (ŷ·x̂ = 0)", keep: false },
    { s: "Ay·By (ŷ·ŷ = 1)", keep: true },
  ];
  return (
    <FigSvg>
      <text x={20} y={30} fontSize={11.5} fill="#fff">(Ax x̂ + Ay ŷ)·(Bx x̂ + By ŷ) を展開すると…</text>
      {terms.map((tm, i) => {
        const shown = i <= ph;
        return (
          <g key={i} opacity={shown ? 1 : 0.15}>
            <text x={40} y={60 + i * 24} fontSize={12.5} fill={tm.keep ? C.green : C.red}>{tm.s}</text>
            {shown && !tm.keep && <line x1={36} y1={56 + i * 24} x2={200} y2={56 + i * 24} stroke={C.red} strokeWidth={2} />}
            <text x={214} y={60 + i * 24} fontSize={11} fill={tm.keep ? C.green : C.red}>{tm.keep ? "生き残る" : "直角→消える"}</text>
          </g>
        );
      })}
      <text x={40} y={166} fontSize={12} fill={C.gold} opacity={ph === 3 ? 1 : 0.3}>残り = AxBx + AyBy</text>
      <Caption text="" />
    </FigSvg>
  );
}

/** レンチ: 柄に平行な力は回さない。直角な成分だけが回す */
export function Wrench() {
  const t = useT();
  const perp = Math.floor(t / 1.8) % 2 === 1;
  const wob = perp ? 0.12 * Math.sin(6 * t) : 0;
  const hx = 90, hy = 100;
  const L = 150;
  const ex = hx + L * Math.cos(wob), ey = hy + L * Math.sin(wob);
  return (
    <FigSvg>
      <circle cx={hx} cy={hy} r={16} fill="none" stroke={C.dim} strokeWidth={3} />
      <polygon points={`${hx - 9},${hy - 9} ${hx + 9},${hy - 9} ${hx + 9},${hy + 9} ${hx - 9},${hy + 9}`} fill={C.dim} opacity={0.6} transform={`rotate(${(wob * 180) / Math.PI} ${hx} ${hy})`} />
      <line x1={hx} y1={hy} x2={ex} y2={ey} stroke={C.gold} strokeWidth={7} strokeLinecap="round" />
      {perp ? (
        <g>
          <line x1={ex} y1={ey - 44} x2={ex} y2={ey - 12} stroke={C.green} strokeWidth={3.5} />
          {arrowHead(ex, ey - 8, 0, 1, C.green)}
          <text x={ex - 60} y={ey - 52} fontSize={11.5} fill={C.green}>直角に押す → 回る ✓</text>
        </g>
      ) : (
        <g>
          <line x1={ex + 44} y1={ey} x2={ex + 12} y2={ey} stroke={C.red} strokeWidth={3.5} />
          {arrowHead(ex + 8, ey, -1, 0, C.red)}
          <text x={ex - 90} y={ey - 22} fontSize={11.5} fill={C.red}>柄に平行に押す → 回らない ✗</text>
        </g>
      )}
      <Caption text="回転に効くのは直角な成分だけ — 内積(平行度)ではなく別の掛け算が要る" />
    </FigSvg>
  );
}

/** 右ねじの規則: 回転の向き ↔ 軸の向き(手前⊙ / 奥⊗) */
export function RightHand() {
  const t = useT();
  const ccw = Math.floor(t / 2) % 2 === 0;
  const sd = ccw ? -1 : 1; // 画面座標(y下向き)では角度増加=時計回り。反時計回りは角度を減らす
  const ang = sd * 1.8 * t;
  const cx = 110, cy = 92, R = 48;
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const a = ang + sd * (i / 40) * 4.5;
    pts.push(`${cx + R * Math.cos(a)},${cy + R * Math.sin(a)}`);
  }
  const aEnd = ang + sd * 4.5;
  return (
    <FigSvg>
      <polyline points={pts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={3} />
      {arrowHead(cx + R * Math.cos(aEnd), cy + R * Math.sin(aEnd), -sd * Math.sin(aEnd), sd * Math.cos(aEnd), C.cyan)}
      <circle cx={cx} cy={cy} r={17} fill="none" stroke={C.gold} strokeWidth={2.5} />
      {ccw ? (
        <circle cx={cx} cy={cy} r={4} fill={C.gold} />
      ) : (
        <g stroke={C.gold} strokeWidth={2.5}>
          <line x1={cx - 8} y1={cy - 8} x2={cx + 8} y2={cy + 8} />
          <line x1={cx + 8} y1={cy - 8} x2={cx - 8} y2={cy + 8} />
        </g>
      )}
      <text x={190} y={70} fontSize={12} fill={C.cyan}>{ccw ? "反時計回りに回す" : "時計回りに回す"}</text>
      <text x={190} y={92} fontSize={12} fill={C.gold}>{ccw ? "→ ねじは手前へ ⊙" : "→ ねじは奥へ ⊗"}</text>
      <text x={190} y={116} fontSize={10.5} fill={C.dim}>右手の4本指=回す向き</text>
      <text x={190} y={130} fontSize={10.5} fill={C.dim}>親指=軸(答え)の向き</text>
      <Caption text="回転の向きを1本の矢印(軸)で表す約束が右ねじの規則" />
    </FigSvg>
  );
}

/** 指数減衰: 接線の傾きが高さに比例して小さくなっていく */
export function DecaySlope() {
  const t = useT();
  const u = (t % 5) / 5;
  const X = 50 + 220 * u;
  const yOf = (x: number) => 150 - 110 * Math.exp(-(x - 50) / 80);
  const y = yOf(X);
  const h = 150 - y;
  const pts: string[] = [];
  for (let x = 50; x <= 290; x += 4) pts.push(`${x},${yOf(x).toFixed(1)}`);
  return (
    <FigSvg>
      <Axes xl="t" yl="量" />
      <polyline points={pts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <line x1={X} y1={y} x2={X} y2={150} stroke={C.gold} strokeWidth={3} />
      <line x1={X - 30} y1={y - (30 * h) / 80} x2={X + 30} y2={y + (30 * h) / 80} stroke={C.purple} strokeWidth={2.5} />
      <circle cx={X} cy={y} r={5} fill={C.cyan} />
      <text x={150} y={40} fontSize={11} fill={C.purple}>減る速さ(傾き) ∝ いまの量(高さ)</text>
      <text x={150} y={56} fontSize={11} fill={C.dim}>量が半分なら減り方も半分</text>
      <Caption text="「減り方 ∝ 現在量」の解は指数関数。放電・崩壊・冷却が同じ形" />
    </FigSvg>
  );
}

/** 初期条件の違い: 同じルール、違うスタート → 違う歴史 */
export function InitFamily() {
  const t = useT();
  const hi = Math.floor(t / 1.2) % 3;
  const starts = [110, 75, 40];
  return (
    <FigSvg>
      <Axes xl="t" yl="v" />
      {starts.map((s0, k) => {
        const pts: string[] = [];
        for (let x = 45; x <= 290; x += 4) pts.push(`${x},${(150 - s0 * Math.exp(-(x - 45) / 90)).toFixed(1)}`);
        return (
          <g key={k} opacity={k === hi ? 1 : 0.4}>
            <polyline points={pts.join(" ")} fill="none" stroke={k === hi ? C.gold : C.cyan} strokeWidth={k === hi ? 3 : 1.5} />
            <circle cx={45} cy={150 - s0} r={5} fill={k === hi ? C.gold : C.cyan} />
          </g>
        );
      })}
      <text x={120} y={40} fontSize={11} fill="#fff">ルール(微分方程式)は全部同じ</text>
      <text x={120} y={56} fontSize={11} fill={C.gold}>出発点(初期条件)だけが違う</text>
      <Caption text="法則 + 初期条件 → 唯一の未来" />
    </FigSvg>
  );
}

/** 周期と質量: 重いおもりはのっそり (T ∝ √m) */
export function PeriodMass() {
  const t = useT();
  const y1 = 95 + 40 * Math.sin(2.4 * t);
  const y2 = 95 + 40 * Math.sin(1.2 * t);
  const spring = (x: number, yEnd: number) => {
    const pts: string[] = [`${x},30`];
    for (let i = 1; i < 10; i++) pts.push(`${x + (i % 2 ? 9 : -9)},${30 + ((yEnd - 30) * i) / 10}`);
    pts.push(`${x},${yEnd}`);
    return <polyline points={pts.join(" ")} fill="none" stroke={C.dim} strokeWidth={2} />;
  };
  return (
    <FigSvg>
      <line x1={40} y1={30} x2={280} y2={30} stroke={C.dim} strokeWidth={3} />
      {spring(100, y1)}
      <circle cx={100} cy={y1 + 12} r={12} fill={C.cyan} />
      <text x={70} y={175} fontSize={11} fill={C.cyan}>質量 m: 速い振動</text>
      {spring(220, y2)}
      <circle cx={220} cy={y2 + 18} r={18} fill={C.purple} />
      <text x={176} y={175} fontSize={11} fill={C.purple}>質量 4m: 周期は2倍</text>
      <Caption text="T = 2π√(m/k): 重いほどのっそり、硬いほどせわしない。振幅は無関係" />
    </FigSvg>
  );
}

/** 谷底はどんな形でも放物線: ズームすると単振動のポテンシャルになる */
export function ValleyParabola() {
  const t = useT();
  const zoom = 1 + 2.2 * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 6));
  const U = (x: number) => 0.5 * x * x + 0.35 * x * x * x - 0.15 * x * x * x * x; // 谷底付近は 0.5x²
  const sx = (x: number) => 160 + 60 * zoom * x;
  const sy = (y: number) => 150 - 90 * zoom * y;
  const real: string[] = [];
  const para: string[] = [];
  for (let i = -60; i <= 60; i++) {
    const x = i / 40;
    const yr = U(x), yp = 0.5 * x * x;
    if (sy(yr) > 20 && sx(x) > 20 && sx(x) < 300) real.push(`${sx(x).toFixed(1)},${sy(yr).toFixed(1)}`);
    if (sy(yp) > 20 && sx(x) > 20 && sx(x) < 300) para.push(`${sx(x).toFixed(1)},${sy(yp).toFixed(1)}`);
  }
  return (
    <FigSvg>
      <polyline points={para.join(" ")} fill="none" stroke={C.gold} strokeWidth={2} strokeDasharray="6 4" />
      <polyline points={real.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <circle cx={160} cy={150} r={6} fill={C.green} />
      <text x={24} y={36} fontSize={11} fill={C.cyan}>本物のポテンシャル(でこぼこ)</text>
      <text x={24} y={52} fontSize={11} fill={C.gold}>点線: 放物線 ½kx²</text>
      <text x={200} y={168} fontSize={11} fill={C.green}>{zoom > 2.2 ? "谷底にズーム: 一致!" : "谷底(安定点)"}</text>
      <Caption text="安定点の近くはテイラー展開で必ず放物線 → 小さな揺れは何でも単振動" />
    </FigSvg>
  );
}
