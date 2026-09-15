import { useT, useSweep, C } from "./anim";

const W = 320;
const H = 190;

export function FigSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg className="fig" viewBox={`0 0 ${W} ${H}`} role="img">
      {children}
    </svg>
  );
}

// おおよその描画幅 (全角 ≈ fontSize, 半角 ≈ 0.56×fontSize)
function estWidth(s: string, fs: number): number {
  let w = 0;
  for (const ch of s) w += ch.charCodeAt(0) > 0x2e7f ? fs * 1.08 : fs * 0.6;
  return w;
}

// 長いキャプションは (1) 文字を少し縮め、(2) それでも入らなければ2行に折り返す
export function Caption({ text }: { text: string }) {
  const maxW = W - 16;
  let fs = 11;
  while (fs > 9.5 && estWidth(text, fs) > maxW) fs -= 0.5;
  if (estWidth(text, fs) <= maxW) {
    return (
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={fs} fill={C.dim}>
        {text}
      </text>
    );
  }
  const chars = [...text];
  const mid = Math.floor(chars.length / 2);
  const sep = /[、。，,;；:：—→=)）」]/;
  let cut = mid;
  for (let d = 0; d < mid; d++) {
    if (sep.test(chars[mid + d] ?? "")) { cut = mid + d + 1; break; }
    if (sep.test(chars[mid - d] ?? "")) { cut = mid - d + 1; break; }
  }
  const l1 = chars.slice(0, cut).join("");
  const l2 = chars.slice(cut).join("");
  return (
    <g fontSize={9.5} fill={C.dim} textAnchor="middle">
      <text x={W / 2} y={H - 18}>{l1}</text>
      <text x={W / 2} y={H - 6}>{l2}</text>
    </g>
  );
}

function Axes({ xLabel, yLabel }: { xLabel: string; yLabel: string }) {
  return (
    <g stroke={C.dim} strokeWidth={1.5} fill={C.dim}>
      <line x1={45} y1={150} x2={295} y2={150} />
      <line x1={45} y1={150} x2={45} y2={25} />
      <text x={290} y={165} fontSize={11} stroke="none">{xLabel}</text>
      <text x={22} y={35} fontSize={11} stroke="none">{yLabel}</text>
    </g>
  );
}

/** x-tグラフ: 傾き = 速度 */
export function XtSlope() {
  const t = useT();
  const p = (t % 3) / 3;
  const fx = 45 + 235 * p;
  return (
    <FigSvg>
      <Axes xLabel="時間 t" yLabel="位置 x" />
      <line x1={45} y1={150} x2={280} y2={45} stroke={C.cyan} strokeWidth={2.5} />
      <line x1={45} y1={150} x2={280} y2={115} stroke={C.gold} strokeWidth={2.5} />
      <circle cx={fx} cy={150 - (105 / 235) * (fx - 45)} r={6} fill={C.cyan} />
      <circle cx={fx} cy={150 - (35 / 235) * (fx - 45)} r={6} fill={C.gold} />
      <text x={200} y={62} fontSize={11} fill={C.cyan}>速い = 傾きが急</text>
      <text x={205} y={140} fontSize={11} fill={C.gold}>遅い = 傾きゆるやか</text>
      <Caption text="グラフの傾きがそのまま速度" />
    </FigSvg>
  );
}

/** ストロボ写真風: 加速して間隔が広がる */
export function StrobeAccel() {
  const t = useT();
  const p = (t % 2.5) / 2.5;
  const x = 40 + 240 * p * p;
  const ghosts = [0, 0.25, 0.5, 0.75, 1];
  return (
    <FigSvg>
      <line x1={20} y1={110} x2={300} y2={110} stroke={C.dim} strokeWidth={1.5} />
      {ghosts.map((g) => (
        <g key={g}>
          <circle cx={40 + 240 * g * g} cy={95} r={10} fill={C.purple} opacity={0.22} />
          <line x1={40 + 240 * g * g} y1={108} x2={40 + 240 * g * g} y2={116} stroke={C.dim} />
        </g>
      ))}
      <circle cx={x} cy={95} r={11} fill={C.purple} />
      <line x1={x} y1={65} x2={x + 20 + 70 * p} y2={65} stroke={C.gold} strokeWidth={3} />
      <polygon points={`${x + 26 + 70 * p},65 ${x + 14 + 70 * p},59 ${x + 14 + 70 * p},71`} fill={C.gold} />
      <text x={40} y={50} fontSize={11} fill={C.gold}>速度がどんどん増える</text>
      <text x={40} y={140} fontSize={11} fill={C.dim}>目盛り = 同じ時間間隔ごとの位置</text>
      <Caption text="同じ時間で進む距離が増えていく = 加速度" />
    </FigSvg>
  );
}

/** v-tグラフ: 面積 = 距離 (長方形 + 三角形) */
export function VtArea() {
  const t = useT();
  const p = (t % 3.2) / 3.2;
  const X = 45 + 225 * p;
  const yAt = (x: number) => 110 - (65 / 225) * (x - 45);
  return (
    <FigSvg>
      <Axes xLabel="時間 t" yLabel="速度 v" />
      <rect x={45} y={110} width={X - 45} height={40} fill={C.cyan} opacity={0.3} />
      <polygon points={`45,110 ${X},${yAt(X)} ${X},110`} fill={C.gold} opacity={0.35} />
      <line x1={45} y1={110} x2={270} y2={45} stroke={C.green} strokeWidth={2.5} />
      <line x1={45} y1={110} x2={270} y2={110} stroke={C.dim} strokeDasharray="4 4" />
      <line x1={X} y1={150} x2={X} y2={yAt(X)} stroke="#fff" opacity={0.5} />
      <text x={26} y={114} fontSize={11} fill={C.cyan}>v₀</text>
      <text x={110} y={137} fontSize={12} fill={C.cyan}>v₀t</text>
      <text x={175} y={100} fontSize={12} fill={C.gold}>½at²</text>
      <text x={225} y={38} fontSize={11} fill={C.green}>v = v₀ + at</text>
      <Caption text="グラフの下の面積 = 移動距離 (長方形+三角形)" />
    </FigSvg>
  );
}

/** 自由落下: 重い球と軽い球が同時に落ちる */
export function FreeFall() {
  const t = useT();
  const p = (t % 2.2) / 2.2;
  const y = 25 + 118 * p * p;
  return (
    <FigSvg>
      <line x1={30} y1={152} x2={290} y2={152} stroke={C.dim} strokeWidth={2} />
      {[0, 0.33, 0.66, 1].map((g) => (
        <line key={g} x1={80} y1={25 + 118 * g * g} x2={250} y2={25 + 118 * g * g} stroke={C.dim} strokeDasharray="3 5" opacity={0.35} />
      ))}
      <circle cx={110} cy={y} r={14} fill="#b6c2e2" />
      <circle cx={215} cy={y} r={7} fill={C.gold} />
      <text x={90} y={y + 30} fontSize={10} fill="#b6c2e2">重い</text>
      <text x={202} y={y + 25} fontSize={10} fill={C.gold}>軽い</text>
      <Caption text="質量によらず同じ加速度 g で落ちる → 同時に着地" />
    </FigSvg>
  );
}

/** 運動方程式: 同じ力、質量ちがい */
export function NewtonCarts() {
  const t = useT();
  const p = (t % 2.6) / 2.6;
  const x1 = 60 + 190 * p * p;
  const x2 = 60 + 95 * p * p;
  return (
    <FigSvg>
      <line x1={20} y1={80} x2={300} y2={80} stroke={C.dim} opacity={0.5} />
      <line x1={20} y1={150} x2={300} y2={150} stroke={C.dim} opacity={0.5} />
      <rect x={x1} y={56} width={24} height={24} rx={4} fill={C.cyan} />
      <text x={x1 + 6} y={72} fontSize={11} fill="#0b1026" fontWeight="bold">m</text>
      <rect x={x2} y={116} width={34} height={34} rx={4} fill={C.purple} />
      <text x={x2 + 8} y={138} fontSize={11} fill="#0b1026" fontWeight="bold">2m</text>
      <g stroke={C.gold} strokeWidth={3}>
        <line x1={x1 - 30} y1={68} x2={x1 - 4} y2={68} />
        <line x1={x2 - 30} y1={133} x2={x2 - 4} y2={133} />
      </g>
      <polygon points={`${x1 - 2},68 ${x1 - 12},62 ${x1 - 12},74`} fill={C.gold} />
      <polygon points={`${x2 - 2},133 ${x2 - 12},127 ${x2 - 12},139`} fill={C.gold} />
      <text x={24} y={45} fontSize={11} fill={C.gold}>同じ力 F でも…</text>
      <Caption text="質量2倍 → 加速度は半分 (a = F/m)" />
    </FigSvg>
  );
}

/** エネルギー保存: スライダーで玉を動かす (インタラクティブ) */
export function EnergySlide() {
  const [s, setS] = useSweep(15, 0, 100);
  const sx = s / 100;
  const px = 40 + 200 * sx;
  const py = 135 - 95 * Math.pow(2 * sx - 1, 2);
  const uRatio = (135 - py) / 95; // screen y increases downward
  const kRatio = 1 - uRatio;
  const curve: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const cx = 40 + (200 * i) / 40;
    const cy = 135 - 95 * Math.pow((2 * i) / 40 - 1, 2);
    curve.push(`${cx},${cy}`);
  }
  return (
    <div>
      <FigSvg>
        <polyline points={curve.join(" ")} fill="none" stroke={C.dim} strokeWidth={2.5} />
        <circle cx={px} cy={py - 9} r={9} fill={C.gold} />
        <rect x={262} y={135 - 95 * uRatio} width={18} height={95 * uRatio} fill={C.gold} opacity={0.85} />
        <rect x={286} y={135 - 95 * kRatio} width={18} height={95 * kRatio} fill={C.cyan} opacity={0.85} />
        <text x={258} y={150} fontSize={10} fill={C.gold}>位置U</text>
        <text x={284} y={150} fontSize={10} fill={C.cyan}>運動K</text>
        <line x1={255} y1={40} x2={308} y2={40} stroke={C.green} strokeDasharray="3 3" />
        <text x={218} y={32} fontSize={10} fill={C.green}>合計はいつも一定</text>
        <Caption text="玉を動かしてみよう: U が減った分だけ K が増える" />
      </FigSvg>
      <input
        className="fig-slider"
        type="range"
        min={0}
        max={100}
        value={s}
        onChange={(e) => setS(Number(e.target.value))}
      />
    </div>
  );
}

/** 放物運動: 水平は等速、鉛直は落下 */
export function Projectile() {
  const t = useT();
  const p = (t % 2.6) / 2.6;
  const x = 40 + 220 * p;
  const y = 145 - 300 * p * (1 - p);
  const vy = (1 - 2 * p) * 38;
  const path: string[] = [];
  for (let i = 0; i <= 30; i++) {
    const q = i / 30;
    path.push(`${40 + 220 * q},${145 - 300 * q * (1 - q)}`);
  }
  return (
    <FigSvg>
      <line x1={20} y1={148} x2={300} y2={148} stroke={C.dim} strokeWidth={2} />
      <polyline points={path.join(" ")} fill="none" stroke={C.dim} strokeDasharray="3 5" opacity={0.5} />
      <circle cx={x} cy={y} r={8} fill={C.gold} />
      <line x1={x} y1={y} x2={x + 32} y2={y} stroke={C.cyan} strokeWidth={2.5} />
      <polygon points={`${x + 36},${y} ${x + 27},${y - 5} ${x + 27},${y + 5}`} fill={C.cyan} />
      {Math.abs(vy) > 4 && (
        <g>
          <line x1={x} y1={y} x2={x} y2={y - vy} stroke={C.red} strokeWidth={2.5} />
          <polygon
            points={`${x},${y - vy - Math.sign(vy) * 4} ${x - 5},${y - vy + Math.sign(vy) * 5} ${x + 5},${y - vy + Math.sign(vy) * 5}`}
            fill={C.red}
          />
        </g>
      )}
      <text x={38} y={30} fontSize={11} fill={C.cyan}>ヨコ: ずっと同じ速さ</text>
      <text x={38} y={46} fontSize={11} fill={C.red}>タテ: 投げ上げと同じ</text>
      <Caption text="ナナメの運動 = ヨコ(等速) + タテ(落体) の重ね合わせ" />
    </FigSvg>
  );
}

/** 運動量: 衝突で受け渡される */
export function Collision() {
  const t = useT();
  const p = (t % 3) / 3;
  const ax = p < 0.5 ? 60 + 250 * p : 185;
  const bx = p < 0.5 ? 205 : 205 + 250 * (p - 0.5);
  const movingA = p < 0.5;
  return (
    <FigSvg>
      <line x1={20} y1={112} x2={300} y2={112} stroke={C.dim} opacity={0.5} />
      <circle cx={ax} cy={100} r={11} fill={C.cyan} />
      <circle cx={bx} cy={100} r={11} fill={C.gold} />
      {movingA ? (
        <g>
          <line x1={ax} y1={72} x2={ax + 42} y2={72} stroke={C.cyan} strokeWidth={3.5} />
          <polygon points={`${ax + 48},72 ${ax + 37},66 ${ax + 37},78`} fill={C.cyan} />
        </g>
      ) : (
        <g>
          <line x1={bx} y1={72} x2={bx + 42} y2={72} stroke={C.gold} strokeWidth={3.5} />
          <polygon points={`${bx + 48},72 ${bx + 37},66 ${bx + 37},78`} fill={C.gold} />
        </g>
      )}
      <text x={40} y={45} fontSize={11} fill={C.dim}>矢印 = 運動量 p。衝突の前後で長さ(合計)は同じ</text>
      <Caption text="運動量は消えずに受け渡される (運動量保存則)" />
    </FigSvg>
  );
}

/** 円運動: 速度は接線、加速度は中心向き */
export function Circular() {
  const t = useT();
  const th = t * 1.4;
  const cx = 160;
  const cy = 92;
  const r = 55;
  const x = cx + r * Math.cos(th);
  const y = cy + r * Math.sin(th);
  const vx = -Math.sin(th);
  const vy = Math.cos(th);
  return (
    <FigSvg>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.dim} strokeDasharray="4 5" />
      <circle cx={cx} cy={cy} r={3.5} fill={C.dim} />
      <circle cx={x} cy={y} r={8} fill={C.gold} />
      <line x1={x} y1={y} x2={x + 34 * vx} y2={y + 34 * vy} stroke={C.cyan} strokeWidth={2.5} />
      <polygon
        points={`${x + 39 * vx},${y + 39 * vy} ${x + 30 * vx + 5 * vy},${y + 30 * vy - 5 * vx} ${x + 30 * vx - 5 * vy},${y + 30 * vy + 5 * vx}`}
        fill={C.cyan}
      />
      <line x1={x} y1={y} x2={x + (cx - x) * 0.45} y2={y + (cy - y) * 0.45} stroke={C.red} strokeWidth={2.5} />
      <text x={28} y={34} fontSize={11} fill={C.cyan}>v: 接線方向</text>
      <text x={28} y={50} fontSize={11} fill={C.red}>a: 中心向き</text>
      <Caption text="速さが同じでも向きが変わり続ける = 加速度がある" />
    </FigSvg>
  );
}

/** 単振動: ばね */
export function Spring() {
  const t = useT();
  const x = 175 + 62 * Math.sin(t * 2.2);
  const n = 9;
  const pts: string[] = [`52,95`];
  for (let i = 1; i < n; i++) {
    const px = 52 + ((x - 14 - 52) * i) / n;
    pts.push(`${px},${i % 2 === 1 ? 80 : 110}`);
  }
  pts.push(`${x - 14},95`);
  return (
    <FigSvg>
      <rect x={40} y={55} width={12} height={80} fill={C.dim} opacity={0.6} />
      <polyline points={pts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <rect x={x - 14} y={78} width={30} height={34} rx={5} fill={C.gold} />
      <line x1={175} y1={50} x2={175} y2={140} stroke={C.green} strokeDasharray="4 4" />
      <text x={182} y={48} fontSize={10} fill={C.green}>つり合いの位置</text>
      <text x={40} y={165} fontSize={11} fill={C.dim}>ずれた分に比例した力 F = −kx で引き戻される</text>
      <Caption text="単振動: 中心に戻ろうとして行き過ぎる、の繰り返し" />
    </FigSvg>
  );
}
