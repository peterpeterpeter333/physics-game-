import { useT, C } from "./anim";
import { FigSvg, Caption } from "./mechanics";

// 大学力学: 「全ステップに図解」体制のための追加図解 (19種)

const Axes = ({ xl, yl }: { xl: string; yl: string }) => (
  <g stroke={C.dim} strokeWidth={1.5} fill={C.dim}>
    <line x1={45} y1={150} x2={295} y2={150} />
    <line x1={45} y1={150} x2={45} y2={25} />
    <text x={288} y={165} fontSize={11} stroke="none">{xl}</text>
    <text x={20} y={35} fontSize={11} stroke="none">{yl}</text>
  </g>
);

const Arrow = ({ x, y, dx, dy, color, w = 3 }: { x: number; y: number; dx: number; dy: number; color: string; w?: number }) => {
  const l = Math.hypot(dx, dy) || 1;
  const ux = dx / l, uy = dy / l;
  const ex = x + dx, ey = y + dy;
  return (
    <g>
      <line x1={x} y1={y} x2={ex} y2={ey} stroke={color} strokeWidth={w} />
      <polygon points={`${ex + 8 * ux},${ey + 8 * uy} ${ex - 4 * uy},${ey + 4 * ux} ${ex + 4 * uy},${ey - 4 * ux}`} fill={color} />
    </g>
  );
};

/** 落下する雨粒に働く2つの力: 重力は一定、抵抗は速いほど大きい */
export function DragForces() {
  const t = useT();
  const u = (t % 5) / 5;
  const v = 1 - Math.exp(-u / 0.3);
  const y = 40 + 60 * u;
  return (
    <FigSvg>
      <circle cx={110} cy={y} r={12} fill={C.cyan} />
      <Arrow x={110} y={y + 14} dx={0} dy={40} color={C.red} />
      <text x={122} y={y + 42} fontSize={11} fill={C.red}>重力 mg (一定)</text>
      <Arrow x={110} y={y - 14} dx={0} dy={-40 * v - 2} color={C.green} />
      <text x={122} y={y - 30 * v - 18} fontSize={11} fill={C.green}>空気抵抗 kv (速いほど大)</text>
      <text x={172} y={150} fontSize={11.5} fill="#fff">{v > 0.95 ? "つり合った → 加速終了" : "まだ重力の勝ち → 加速中"}</text>
      <Caption text="m(dv/dt) = mg − kv: 右辺は「重力 − 抵抗」の残り" />
    </FigSvg>
  );
}

/** 抵抗のモデルが変わると解の形も変わる (kv と cv²) */
export function DragModels() {
  const t = useT();
  const u = (t % 5) / 5;
  const X = 45 + 240 * u;
  const v1 = (x: number) => 1 - Math.exp(-x / 0.28);
  const v2 = (x: number) => Math.tanh(x / 0.28);
  const pts = (f: (x: number) => number, scale: number) => {
    const a: string[] = [];
    for (let x = 45; x <= X; x += 4) a.push(`${x},${(150 - 100 * scale * f((x - 45) / 240)).toFixed(1)}`);
    return a.join(" ");
  };
  return (
    <FigSvg>
      <Axes xl="t" yl="v" />
      <polyline points={pts(v1, 1)} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <polyline points={pts(v2, 0.72)} fill="none" stroke={C.purple} strokeWidth={2.5} />
      <text x={150} y={40} fontSize={11} fill={C.cyan}>抵抗 ∝ v: 終端速度 mg/k</text>
      <text x={150} y={56} fontSize={11} fill={C.purple}>抵抗 ∝ v²: 終端速度 √(mg/c)</text>
      <Caption text="モデルを替えても手順は同じ: 力を書く → ma=F → 解く" />
    </FigSvg>
  );
}

/** ½mv² は「された仕事の貯金箱」: 押すほど貯まる */
export function KeBank() {
  const t = useT();
  const u = (t % 4) / 4;
  const x = 40 + 150 * u * u;
  const v = u;
  return (
    <FigSvg>
      <line x1={20} y1={120} x2={230} y2={120} stroke={C.dim} strokeWidth={2} />
      <rect x={x} y={92} width={40} height={28} rx={5} fill={C.cyan} />
      <Arrow x={x - 30} y={106} dx={24} dy={0} color={C.red} />
      <text x={x - 34} y={96} fontSize={10.5} fill={C.red}>F</text>
      <text x={x + 46} y={100} fontSize={10.5} fill={C.cyan}>v</text>
      <rect x={262} y={150 - 110 * v * v} width={22} height={110 * v * v} fill={C.gold} opacity={0.9} />
      <rect x={262} y={40} width={22} height={110} fill="none" stroke={C.dim} strokeWidth={1.2} />
      <text x={246} y={166} fontSize={10.5} fill={C.gold}>½mv²</text>
      <text x={30} y={40} fontSize={11} fill="#fff">力が仕事をする → 貯金箱 ½mv² が増える</text>
      <text x={30} y={56} fontSize={10.5} fill={C.dim}>d/dt(½mv²) = F·v (毎秒の入金)</text>
      <Caption text="運動エネルギー = ma=F から現れる「仕事の貯金箱」" />
    </FigSvg>
  );
}

/** 仕事率: 入る出力と出ていく重力の仕事率の差し引きで速度が変わる */
export function PowerFlow() {
  const t = useT();
  const ph = Math.floor(t / 2) % 2; // 0: 平地 1: 急坂
  const pin = 60, pout = ph === 0 ? 20 : 85;
  return (
    <FigSvg>
      <line x1={20} y1={130} x2={150} y2={130 - (ph === 0 ? 0 : 60)} stroke={C.dim} strokeWidth={3} />
      <rect x={70} y={ph === 0 ? 104 : 80} width={40} height={22} rx={5} fill={C.cyan} transform={ph === 0 ? "" : "rotate(-25 90 90)"} />
      <text x={24} y={160} fontSize={11} fill="#fff">{ph === 0 ? "平地" : "急な上り坂"}</text>
      <rect x={190} y={150 - pin} width={26} height={pin} fill={C.green} opacity={0.85} />
      <text x={180} y={165} fontSize={10.5} fill={C.green}>入る P</text>
      <rect x={240} y={150 - pout} width={26} height={pout} fill={C.red} opacity={0.85} />
      <text x={224} y={165} fontSize={10.5} fill={C.red}>重力へ出る</text>
      <text x={170} y={40} fontSize={11.5} fill={pin >= pout ? C.green : C.red}>{pin >= pout ? "入る > 出る → 加速" : "入る < 出る → 減速"}</text>
      <text x={170} y={58} fontSize={10.5} fill={C.dim}>P = F·v [W]</text>
      <Caption text="運動エネルギーの変化率 = 正味の仕事率" />
    </FigSvg>
  );
}

/** 保存力: 階段でもスロープでも、同じ高さまで運ぶ仕事は同じ mgh */
export function PathIndependent() {
  const t = useT();
  const u = (t % 4) / 4;
  const stairs = [[40, 150], [80, 150], [80, 120], [120, 120], [120, 90], [160, 90], [160, 60], [200, 60]];
  const sPath = stairs.map((p) => p.join(",")).join(" ");
  const idx = Math.max(0, Math.min(Math.floor(u * 7), 6));
  const f = u * 7 - idx;
  const bx = stairs[idx][0] + (stairs[idx + 1][0] - stairs[idx][0]) * f;
  const by = stairs[idx][1] + (stairs[idx + 1][1] - stairs[idx][1]) * f;
  return (
    <FigSvg>
      <polyline points={sPath} fill="none" stroke={C.dim} strokeWidth={2.5} />
      <line x1={40} y1={150} x2={200} y2={60} stroke={C.purple} strokeWidth={2.5} strokeDasharray="6 4" />
      <circle cx={bx} cy={by - 8} r={8} fill={C.gold} />
      <circle cx={40 + 160 * u} cy={150 - 90 * u - 8} r={8} fill={C.purple} opacity={0.8} />
      <line x1={215} y1={60} x2={215} y2={150} stroke={C.cyan} strokeWidth={2} />
      <text x={222} y={110} fontSize={11.5} fill={C.cyan}>高さ h</text>
      <text x={30} y={36} fontSize={11.5} fill="#fff">階段でも斜面でも、重力に逆らう仕事は同じ mgh</text>
      <text x={30} y={52} fontSize={10.5} fill={C.dim}>道によらない = 保存力 → 貯金 U が定義できる</text>
      <Caption text="摩擦は道が長いほど損する(道による)ので、保存力ではない" />
    </FigSvg>
  );
}

/** エネルギーの地形図: Eの線より低い所しか動けない */
export function EnergyLandscape() {
  const t = useT();
  const U = (x: number) => 0.5 * Math.pow(x, 2) - 0.12 * Math.pow(x, 4) + 0.02 * Math.pow(x, 6);
  const sx = (x: number) => 160 + 42 * x;
  const sy = (y: number) => 140 - 70 * y;
  const E = 0.55;
  const pts: string[] = [];
  for (let i = -70; i <= 70; i++) {
    const x = i / 25;
    const y = U(x);
    if (y < 1.6) pts.push(`${sx(x).toFixed(1)},${sy(y).toFixed(1)}`);
  }
  // 転回点 (U = E) を数値で
  let xt = 0.1;
  while (U(xt) < E && xt < 3) xt += 0.01;
  const bx = xt * Math.sin(1.4 * t);
  return (
    <FigSvg>
      <polyline points={pts.join(" ")} fill="none" stroke={C.dim} strokeWidth={2.5} />
      <line x1={40} y1={sy(E)} x2={290} y2={sy(E)} stroke={C.gold} strokeWidth={2} strokeDasharray="6 4" />
      <rect x={sx(-xt)} y={sy(E)} width={sx(xt) - sx(-xt)} height={sy(0) - sy(E) + 2} fill={C.green} opacity={0.12} />
      <circle cx={sx(bx)} cy={sy(U(bx)) - 8} r={8} fill={C.cyan} />
      <text x={44} y={sy(E) - 8} fontSize={11} fill={C.gold}>力学的エネルギー E</text>
      <text x={sx(-xt) - 4} y={165} fontSize={10.5} fill={C.green}>動ける範囲 (E − U = 運動エネルギー ≥ 0)</text>
      <text x={200} y={40} fontSize={10.5} fill={C.dim}>丘の頂上 = 不安定</text>
      <Caption text="U(x) に水平線 E を引くと、行ける場所が読める" />
    </FigSvg>
  );
}

/** 力積: 同じ運動量変化(面積)でも、時間を伸ばせば力のピークは下がる */
export function ImpulseArea() {
  const t = useT();
  const soft = Math.floor(t / 2) % 2 === 1;
  const w = soft ? 160 : 40;
  const h = soft ? 30 : 120;
  const x0 = 60;
  return (
    <FigSvg>
      <Axes xl="t" yl="F" />
      <rect x={x0} y={150 - h} width={w} height={h} rx={w / 2 > 20 ? 20 : w / 2} fill={soft ? C.green : C.red} opacity={0.6} />
      <text x={x0 + 8} y={150 - h - 8} fontSize={11.5} fill={soft ? C.green : C.red}>{soft ? "エアバッグ: 長く・弱く" : "壁: 短く・強く"}</text>
      <text x={170} y={60} fontSize={11.5} fill={C.gold}>面積 ∫F dt = Δp は同じ</text>
      <text x={170} y={78} fontSize={10.5} fill={C.dim}>Δp は変えられない</text>
      <text x={170} y={94} fontSize={10.5} fill={C.dim}>→ 時間を伸ばして力を下げる</text>
      <Caption text="力積 = 力×時間の蓄積 = 運動量の変化。安全設計の基礎式" />
    </FigSvg>
  );
}

/** 反発係数: e=1 は同じ高さまで、e=0 はくっつく */
export function Restitution() {
  const t = useT();
  const u = (t % 2.4) / 2.4;
  const ball = (x: number, e: number, label: string, color: string) => {
    const hUp = 100 * e * e;
    const y = u < 0.5 ? 40 + 100 * Math.pow(u / 0.5, 2) : 140 - hUp * (1 - Math.pow((u - 0.5) / 0.5 - 1, 2));
    return (
      <g>
        <line x1={x - 30} y1={142} x2={x + 30} y2={142} stroke={C.dim} strokeWidth={2} />
        <circle cx={x} cy={Math.min(y, 132)} r={10} fill={color} />
        <text x={x - 22} y={166} fontSize={11} fill={color}>{label}</text>
      </g>
    );
  };
  return (
    <FigSvg>
      {ball(70, 1, "e = 1", C.green)}
      {ball(160, 0.6, "e = 0.6", C.gold)}
      {ball(250, 0, "e = 0", C.red)}
      <text x={40} y={26} fontSize={11.5} fill="#fff">e = 離れる速さ ÷ 近づく速さ</text>
      <Caption text="運動量は常に保存、運動エネルギーは e=1 のときだけ" />
    </FigSvg>
  );
}

/** 角運動量 L = r × p: 遠くを・重い物が・速く回るほど大きい */
export function AngularMomentum() {
  const t = useT();
  const cx = 130, cy = 95, R = 55;
  const a = 1.3 * t;
  const px = cx + R * Math.cos(a), py = cy + R * Math.sin(a);
  return (
    <FigSvg>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.dim} strokeDasharray="4 4" />
      <circle cx={cx} cy={cy} r={4} fill="#fff" />
      <Arrow x={cx} y={cy} dx={(px - cx) * 0.85} dy={(py - cy) * 0.85} color={C.gold} w={2} />
      <text x={(cx + px) / 2 + 6} y={(cy + py) / 2} fontSize={11} fill={C.gold}>r</text>
      <circle cx={px} cy={py} r={8} fill={C.cyan} />
      <Arrow x={px} y={py} dx={-30 * Math.sin(a)} dy={30 * Math.cos(a)} color={C.purple} />
      <text x={px - 30 * Math.sin(a) + 6} y={py + 30 * Math.cos(a)} fontSize={11} fill={C.purple}>p = mv</text>
      <circle cx={240} cy={70} r={16} fill="none" stroke={C.green} strokeWidth={2.5} />
      <g stroke={C.green} strokeWidth={2.5}>
        <line x1={232} y1={62} x2={248} y2={78} />
        <line x1={248} y1={62} x2={232} y2={78} />
      </g>
      <text x={216} y={104} fontSize={11} fill={C.green}>L = r × p (奥向き⊗)</text>
      <text x={216} y={120} fontSize={11} fill={C.green}>大きさ mvr</text>
      <Caption text="回転の勢い。運動量pの「回転版」" />
    </FigSvg>
  );
}

/** トルクをかけ続けると角速度が増えていく: I(dω/dt) = N */
export function TorqueSpinup() {
  const t = useT();
  const u = t % 4;
  const ang = 0.35 * u * u; // 等角加速度
  const cx = 120, cy = 95, R = 48;
  return (
    <FigSvg>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.cyan} strokeWidth={3} />
      {[0, 1, 2, 3].map((k) => {
        const a = ang + (k * Math.PI) / 2;
        return <line key={k} x1={cx} y1={cy} x2={cx + R * Math.cos(a)} y2={cy + R * Math.sin(a)} stroke={C.cyan} strokeWidth={2} />;
      })}
      <Arrow x={cx + R + 4} y={cy - 26} dx={0} dy={40} color={C.red} />
      <text x={cx + R + 12} y={cy - 30} fontSize={11} fill={C.red}>接線方向の力 → トルク N</text>
      <rect x={250} y={150 - 25 * u} width={20} height={25 * u} fill={C.gold} opacity={0.9} />
      <text x={236} y={166} fontSize={10.5} fill={C.gold}>角速度 ω</text>
      <text x={30} y={30} fontSize={11.5} fill="#fff">トルクをかけ続けると ω が増え続ける</text>
      <Caption text="I(dω/dt) = N — ma=F の回転版 (m→I、a→dω/dt、F→N)" />
    </FigSvg>
  );
}

/** ケプラー第2法則: 太陽に近いほど速い。同じ時間に掃く面積は等しい */
export function KeplerSweep() {
  const t = useT();
  const a = 110, b = 62, c = Math.sqrt(a * a - b * b);
  const cx = 160, cy = 95;
  const sunx = cx - c;
  // 面積速度一定に近い動き: 角度パラメータを非一様に進める
  const M = 0.8 * t;
  let E = M;
  for (let i = 0; i < 5; i++) E = E - (E - 0.8 * Math.sin(E) - M) / (1 - 0.8 * Math.cos(E));
  const px = cx + a * Math.cos(E), py = cy + b * Math.sin(E);
  const E2 = E + 0.35;
  const qx = cx + a * Math.cos(E2), qy = cy + b * Math.sin(E2);
  return (
    <FigSvg>
      <ellipse cx={cx} cy={cy} rx={a} ry={b} fill="none" stroke={C.dim} strokeWidth={2} />
      <polygon points={`${sunx},${cy} ${px},${py} ${qx},${qy}`} fill={C.gold} opacity={0.3} />
      <circle cx={sunx} cy={cy} r={10} fill={C.gold} />
      <circle cx={px} cy={py} r={7} fill={C.cyan} />
      <text x={sunx - 14} y={cy + 24} fontSize={10.5} fill={C.gold}>太陽</text>
      <text x={24} y={30} fontSize={11} fill="#fff">重力は常に太陽向き → トルク r×F = 0 → L 一定</text>
      <text x={24} y={46} fontSize={10.5} fill={C.dim}>L = mvr 一定: r が小さいほど v が大きい</text>
      <Caption text="同じ時間に掃く面積(金)は等しい — 角運動量保存の絵姿" />
    </FigSvg>
  );
}

/** 振り子: 重力を「糸方向」と「弧に沿う方向」に分けると、戻す力は mg sinθ */
export function PendulumForce() {
  const t = useT();
  const th = 0.55 * Math.sin(1.6 * t);
  const ox = 160, oy = 30, L = 105;
  const bx = ox + L * Math.sin(th), by = oy + L * Math.cos(th);
  const g = 46;
  return (
    <FigSvg>
      <line x1={110} y1={oy} x2={210} y2={oy} stroke={C.dim} strokeWidth={3} />
      <line x1={ox} y1={oy} x2={bx} y2={by} stroke={C.dim} strokeWidth={1.5} />
      <circle cx={bx} cy={by} r={11} fill={C.cyan} />
      <Arrow x={bx} y={by} dx={0} dy={g} color={C.red} w={2} />
      <text x={bx + 6} y={by + g + 10} fontSize={10.5} fill={C.red}>mg</text>
      <Arrow x={bx} y={by} dx={-g * Math.sin(th) * Math.cos(th)} dy={g * Math.sin(th) * Math.sin(th)} color={C.gold} />
      <text x={bx - 80 * Math.sign(th || 1) - 20} y={by - 6} fontSize={10.5} fill={C.gold}>戻す力 mg sinθ</text>
      <text x={20} y={160} fontSize={11} fill="#fff">弧に沿う運動方程式: ml(d²θ/dt²) = −mg sinθ</text>
      <Caption text="sinθ ≈ θ とすれば単振動の方程式と同じ形になる" />
    </FigSvg>
  );
}

/** 質量が違っても長さが同じなら、振り子は同じ周期で揺れる */
export function PendulumSync() {
  const t = useT();
  const th = 0.5 * Math.sin(1.8 * t);
  const pend = (ox: number, r: number, color: string, label: string) => {
    const L = 100;
    const bx = ox + L * Math.sin(th), by = 32 + L * Math.cos(th);
    return (
      <g>
        <line x1={ox} y1={32} x2={bx} y2={by} stroke={C.dim} strokeWidth={1.5} />
        <circle cx={bx} cy={by} r={r} fill={color} />
        <text x={ox - 26} y={168} fontSize={11} fill={color}>{label}</text>
      </g>
    );
  };
  return (
    <FigSvg>
      <line x1={40} y1={32} x2={280} y2={32} stroke={C.dim} strokeWidth={3} />
      {pend(100, 8, C.cyan, "軽いおもり")}
      {pend(220, 16, C.purple, "重いおもり")}
      <text x={96} y={20} fontSize={11} fill="#fff">同じ長さ → 同じ周期 (mは式から消える)</text>
      <Caption text="T = 2π√(l/g): 質量も振幅も入らない。長さとgだけ" />
    </FigSvg>
  );
}

/** 現実の振動: 減衰(左)と共振(右) */
export function DampedResonance() {
  const t = useT();
  const u = (t % 5) / 5;
  const damped: string[] = [];
  for (let x = 20; x <= 20 + 130 * u; x += 2) {
    const s = (x - 20) / 130;
    damped.push(`${x},${(90 - 45 * Math.exp(-2.2 * s) * Math.cos(28 * s)).toFixed(1)}`);
  }
  const res: string[] = [];
  for (let x = 175; x <= 300; x += 2) {
    const w = (x - 175) / 125;
    const A = 1 / Math.sqrt(Math.pow(1 - Math.pow(w / 0.55, 2), 2) + 0.05);
    res.push(`${x},${(150 - 20 * A).toFixed(1)}`);
  }
  return (
    <FigSvg>
      <line x1={20} y1={90} x2={150} y2={90} stroke={C.dim} strokeWidth={1} />
      <polyline points={damped.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2} />
      <text x={22} y={30} fontSize={11} fill={C.cyan}>減衰: 振幅が指数的に縮む</text>
      <line x1={175} y1={150} x2={300} y2={150} stroke={C.dim} strokeWidth={1} />
      <polyline points={res.join(" ")} fill="none" stroke={C.gold} strokeWidth={2.5} />
      <text x={176} y={30} fontSize={11} fill={C.gold}>共振: 外力の振動数が</text>
      <text x={176} y={44} fontSize={11} fill={C.gold}>固有振動数に一致で振幅最大</text>
      <text x={230} y={166} fontSize={10} fill={C.dim}>外力の振動数 →</text>
      <Caption text="ブランコ・地震のビル・電子レンジ・ラジオはすべて共振" />
    </FigSvg>
  );
}

/** 慣性モーメントの代表値: 質量が外側にあるほど大きい */
export function InertiaShapes() {
  const t = useT();
  const ang = 0.8 * t;
  const shape = (cx: number, dots: [number, number][], label: string, val: string) => (
    <g>
      <circle cx={cx} cy={90} r={36} fill="none" stroke={C.dim} strokeWidth={1} strokeDasharray="3 3" />
      {dots.map(([r, a], i) => (
        <circle key={i} cx={cx + r * Math.cos(a + ang)} cy={90 + r * Math.sin(a + ang)} r={3.2} fill={C.cyan} />
      ))}
      <text x={cx - 22} y={146} fontSize={11} fill="#fff">{label}</text>
      <text x={cx - 26} y={162} fontSize={11} fill={C.gold}>{val}</text>
    </g>
  );
  const ring: [number, number][] = Array.from({ length: 12 }, (_, i) => [34, (i * Math.PI) / 6]);
  const disk: [number, number][] = [
    ...Array.from({ length: 4 }, (_, i) => [11, (i * Math.PI) / 2] as [number, number]),
    ...Array.from({ length: 8 }, (_, i) => [23, (i * Math.PI) / 4] as [number, number]),
    ...Array.from({ length: 12 }, (_, i) => [34, (i * Math.PI) / 6] as [number, number]),
  ];
  const sphere: [number, number][] = [
    [0, 0],
    ...Array.from({ length: 6 }, (_, i) => [12, (i * Math.PI) / 3] as [number, number]),
    ...Array.from({ length: 8 }, (_, i) => [22, (i * Math.PI) / 4] as [number, number]),
    ...Array.from({ length: 6 }, (_, i) => [32, (i * Math.PI) / 3 + 0.3] as [number, number]),
  ];
  return (
    <FigSvg>
      {shape(60, ring, "薄い輪", "I = MR²")}
      {shape(160, disk, "円板", "I = ½MR²")}
      {shape(260, sphere, "球", "I = ⅖MR²")}
      <text x={40} y={30} fontSize={11} fill={C.dim}>同じ質量M・同じ半径R。点=質量の分布</text>
      <Caption text="質量が外側にあるほど回しにくい" />
    </FigSvg>
  );
}

/** 平行軸の定理: 端で持つと、重心を回す分だけ回しにくくなる */
export function ParallelAxis() {
  const t = useT();
  const a1 = 1.6 * t, a2 = 0.8 * t;
  const L = 70;
  return (
    <FigSvg>
      <g>
        <line x1={80 - L / 2 * Math.cos(a1)} y1={92 - L / 2 * Math.sin(a1)} x2={80 + L / 2 * Math.cos(a1)} y2={92 + L / 2 * Math.sin(a1)} stroke={C.cyan} strokeWidth={6} strokeLinecap="round" />
        <circle cx={80} cy={92} r={4} fill="#fff" />
        <text x={40} y={150} fontSize={11} fill={C.cyan}>中心で回す</text>
        <text x={36} y={166} fontSize={11} fill={C.gold}>I_G = Ml²/12</text>
      </g>
      <g>
        <line x1={200} y1={92} x2={200 + L * Math.cos(a2)} y2={92 + L * Math.sin(a2)} stroke={C.purple} strokeWidth={6} strokeLinecap="round" />
        <circle cx={200} cy={92} r={4} fill="#fff" />
        <circle cx={200 + (L / 2) * Math.cos(a2)} cy={92 + (L / 2) * Math.sin(a2)} r={4} fill={C.gold} />
        <text x={176} y={150} fontSize={11} fill={C.purple}>端で回す: 重心も回る</text>
        <text x={176} y={166} fontSize={11} fill={C.gold}>I = I_G + M(l/2)² = Ml²/3</text>
      </g>
      <text x={40} y={30} fontSize={11} fill="#fff">同じトルクでも端持ちは4倍回しにくい</text>
      <Caption text="I = I_G + Md²: 「重心まわり」+「重心自体を回す分」" />
    </FigSvg>
  );
}

/** 剛体の運動 = 重心の並進 + 重心まわりの回転 (投げたハンマー) */
export function TranslateRotate() {
  const t = useT();
  const u = (t % 3) / 3;
  const gx = 40 + 240 * u;
  const gy = 140 - 260 * u * (1 - u);
  const ang = 5 * u;
  const trail: string[] = [];
  for (let s = 0; s <= u; s += 0.03) trail.push(`${40 + 240 * s},${140 - 260 * s * (1 - s)}`);
  return (
    <FigSvg>
      <line x1={20} y1={150} x2={300} y2={150} stroke={C.dim} strokeWidth={2} />
      {trail.length > 1 && <polyline points={trail.join(" ")} fill="none" stroke={C.gold} strokeWidth={1.5} strokeDasharray="4 3" />}
      <line x1={gx - 28 * Math.cos(ang)} y1={gy - 28 * Math.sin(ang)} x2={gx + 28 * Math.cos(ang)} y2={gy + 28 * Math.sin(ang)} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
      <circle cx={gx + 28 * Math.cos(ang)} cy={gy + 28 * Math.sin(ang)} r={9} fill={C.purple} />
      <circle cx={gx} cy={gy} r={4} fill={C.gold} />
      <text x={30} y={30} fontSize={11} fill={C.gold}>重心は綺麗な放物線 (並進: M r̈_G = F)</text>
      <text x={30} y={46} fontSize={11} fill={C.cyan}>その周りで回転 (回転: I ω̇ = N)</text>
      <Caption text="どんな複雑な動きも「並進+回転」の2本立てで解ける" />
    </FigSvg>
  );
}

/** 慣性力: 加速する電車の中では「見かけの力」が現れる */
export function TrainInertia() {
  const t = useT();
  const u = (t % 4) / 4;
  const accel = u < 0.6;
  const tx = 40 + 30 * u;
  const lean = accel ? 18 : 0;
  return (
    <FigSvg>
      <rect x={tx} y={70} width={200} height={70} rx={8} fill="none" stroke={C.dim} strokeWidth={2.5} />
      <line x1={20} y1={150} x2={300} y2={150} stroke={C.dim} strokeWidth={2} />
      {accel && <Arrow x={tx + 205} y={105} dx={40} dy={0} color={C.red} />}
      {accel && <text x={tx + 200} y={95} fontSize={10.5} fill={C.red}>電車が加速</text>}
      <line x1={tx + 90} y1={135} x2={tx + 90 - lean} y2={90} stroke={C.cyan} strokeWidth={4} strokeLinecap="round" />
      <circle cx={tx + 90 - lean} cy={82} r={8} fill={C.cyan} />
      {accel && <Arrow x={tx + 90 - lean} y={100} dx={-30} dy={0} color={C.gold} w={2} />}
      {accel && <text x={tx + 40 - lean} y={64} fontSize={10.5} fill={C.gold}>車内の視点: 後ろへ押す「慣性力」</text>}
      <text x={24} y={30} fontSize={11} fill="#fff">地上の視点: 乗客は慣性で止まったまま、床が前へ加速しただけ</text>
      <Caption text="加速する座標系では −ma の見かけの力を加えると辻褄が合う" />
    </FigSvg>
  );
}

/** ニュートンの大砲: 速く撃つほど遠くへ落ち、ついに「落ち続ける」= 軌道 */
export function MoonFall() {
  const t = useT();
  const ph = Math.floor(t / 1.6) % 3;
  const cx = 160, cy = 130, R = 60;
  const paths: string[][] = [[], [], []];
  const speeds = [0.5, 0.8, 1];
  speeds.forEach((sp, k) => {
    for (let i = 0; i <= 60; i++) {
      const s = i / 60;
      if (k === 2) {
        const a = -Math.PI / 2 + s * 2 * Math.PI;
        paths[k].push(`${cx + (R + 14) * Math.cos(a)},${cy + (R + 14) * Math.sin(a)}`);
      } else {
        const x = cx + 140 * sp * s;
        const drop = 0.012 * Math.pow(140 * sp * s, 2) / sp;
        const y = cy - R - 14 + drop;
        const rr = Math.hypot(x - cx, y - cy);
        if (rr < R) break;
        paths[k].push(`${x},${y}`);
      }
    }
  });
  return (
    <FigSvg>
      <circle cx={cx} cy={cy} r={R} fill="rgba(78,225,255,0.12)" stroke={C.cyan} strokeWidth={2} />
      <text x={cx - 12} y={cy + 4} fontSize={11} fill={C.cyan}>地球</text>
      {paths.map((p, k) => (
        <polyline key={k} points={p.join(" ")} fill="none" stroke={k === ph ? C.gold : C.dim} strokeWidth={k === ph ? 2.5 : 1.2} opacity={k <= ph ? 1 : 0.25} />
      ))}
      <text x={20} y={30} fontSize={11.5} fill={C.gold}>{["ゆっくり撃つ → 近くに落ちる", "速く撃つ → 遠くに落ちる", "十分速い → 落ち続けて一周 = 軌道!"][ph]}</text>
      <Caption text="月も衛星も「落ち続けている」— 横に速いので着地しない" />
    </FigSvg>
  );
}
