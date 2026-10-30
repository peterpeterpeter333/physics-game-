import { useT, useSweep, C } from "./anim";
import { FigSvg, Caption } from "./mechanics";

// 大学編の図解。
// 方針: 記号(∫, ×, ∂)を「絵」として先に体験させ、数式への恐怖を消す。

/** 割線→接線: Qを近づけると平均の傾きが瞬間の傾きになる */
export function DerivSlope() {
  const t = useT();
  const p = 1 - Math.pow((t % 3.5) / 3.5, 0.7); // 1→0 (Qが近づく)
  const f = (x: number) => 150 - 0.004 * (x - 45) * (x - 45); // 下に凸→上がる曲線
  const px = 110;
  const qx = px + 8 + 160 * p;
  const py = f(px);
  const qy = f(qx);
  const slope = (qy - py) / (qx - px);
  const x1 = 50, x2 = 300;
  const curve: string[] = [];
  for (let x = 45; x <= 300; x += 5) curve.push(`${x},${f(x).toFixed(1)}`);
  return (
    <FigSvg>
      <polyline points={curve.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <line
        x1={x1} y1={py + slope * (x1 - px)}
        x2={x2} y2={py + slope * (x2 - px)}
        stroke={C.gold} strokeWidth={2}
      />
      <circle cx={px} cy={py} r={6} fill={C.gold} />
      <circle cx={qx} cy={qy} r={5} fill={C.purple} />
      <text x={px - 14} y={py + 18} fontSize={11} fill={C.gold}>P</text>
      <text x={qx + 6} y={qy - 8} fontSize={11} fill={C.purple}>Q</text>
      <text x={55} y={40} fontSize={11} fill={C.gold}>
        {p > 0.12 ? "PとQを結ぶ平均の傾き" : "Qが重なる寸前 = 瞬間の傾き(微分)!"}
      </text>
      <Caption text="Qを限りなくPに近づける — それが dx/dt の正体" />
    </FigSvg>
  );
}

/** 積分 = 短冊の合計。短冊を細かくすると面積にぴったり */
export function IntegralSum() {
  const t = useT();
  const Ns = [4, 8, 16, 40];
  const N = Ns[Math.floor(t / 1.4) % Ns.length];
  const f = (x: number) => 145 - 55 * Math.sqrt((x - 45) / 235) - 25 * ((x - 45) / 235);
  const rects = [];
  const w = 235 / N;
  for (let i = 0; i < N; i++) {
    const x = 45 + i * w;
    const y = f(x + w / 2);
    rects.push(<rect key={i} x={x} y={y} width={Math.max(w - 1, 1)} height={150 - y} fill={C.cyan} opacity={0.45} />);
  }
  const curve: string[] = [];
  for (let x = 45; x <= 280; x += 4) curve.push(`${x},${f(x).toFixed(1)}`);
  return (
    <FigSvg>
      <g stroke={C.dim} strokeWidth={1.5}>
        <line x1={45} y1={150} x2={295} y2={150} />
        <line x1={45} y1={150} x2={45} y2={25} />
      </g>
      <text x={288} y={165} fontSize={11} fill={C.dim}>t</text>
      <text x={24} y={35} fontSize={11} fill={C.dim}>v</text>
      {rects}
      <polyline points={curve.join(" ")} fill="none" stroke={C.green} strokeWidth={2.5} />
      <text x={190} y={45} fontSize={12} fill={C.gold}>短冊 {N} 本</text>
      <text x={60} y={45} fontSize={11} fill={C.cyan}>v×Δt の合計</text>
      <Caption text="短冊を細く・大量に → 面積そのもの。これが ∫v dt" />
    </FigSvg>
  );
}

/** sinθ ≈ θ: 原点付近では2本の曲線が区別できない */
export function SmallAngle() {
  const t = useT();
  const zoom = 1 - 0.75 * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 5)); // 1→0.25→1
  const xMax = 3.1 * zoom; // 表示する θ の範囲 [rad]
  const sx = (th: number) => 45 + (235 * th) / xMax;
  const sy = (y: number) => 150 - 118 * y * (zoom < 0.5 ? 1 / (2 * zoom) : 1) * 0.4;
  const sinPts: string[] = [];
  const linPts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const th = (xMax * i) / 60;
    sinPts.push(`${sx(th)},${Math.max(sy(Math.sin(th)), 20).toFixed(1)}`);
    linPts.push(`${sx(th)},${Math.max(sy(th), 20).toFixed(1)}`);
  }
  return (
    <FigSvg>
      <g stroke={C.dim} strokeWidth={1.5}>
        <line x1={45} y1={150} x2={295} y2={150} />
        <line x1={45} y1={150} x2={45} y2={25} />
      </g>
      <polyline points={linPts.join(" ")} fill="none" stroke={C.gold} strokeWidth={2} />
      <polyline points={sinPts.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <text x={215} y={140} fontSize={11} fill={C.cyan}>y = sinθ</text>
      <text x={215} y={45} fontSize={11} fill={C.gold}>y = θ</text>
      <text x={55} y={35} fontSize={11} fill={C.green}>
        {zoom < 0.45 ? "原点付近: 2本が完全に重なる!" : "θが大きいと差が見える"}
      </text>
      <Caption text="原点にズームするほど sinθ と θ は区別できない (微小角近似)" />
    </FigSvg>
  );
}

/** 内積: 仕事に効くのは移動方向の成分だけ (スライダーで角度を変える) */
export function DotProduct() {
  const [deg, setDeg] = useSweep(35, 0, 90);
  const th = (deg * Math.PI) / 180;
  const ox = 55, oy = 125;
  const dLen = 150;
  const fLen = 85;
  const fx = ox + fLen * Math.cos(th);
  const fy = oy - fLen * Math.sin(th);
  const proj = fLen * Math.cos(th);
  return (
    <div>
      <FigSvg>
        <line x1={ox} y1={oy} x2={ox + dLen} y2={oy} stroke={C.dim} strokeWidth={3} />
        <polygon points={`${ox + dLen + 8},${oy} ${ox + dLen - 4},${oy - 6} ${ox + dLen - 4},${oy + 6}`} fill={C.dim} />
        <text x={ox + dLen - 30} y={oy + 18} fontSize={11} fill={C.dim}>移動 d</text>
        <line x1={ox} y1={oy} x2={fx} y2={fy} stroke={C.purple} strokeWidth={3} />
        <polygon
          points={`${ox + (fLen + 9) * Math.cos(th)},${oy - (fLen + 9) * Math.sin(th)} ${ox + (fLen - 3) * Math.cos(th) + 6 * Math.sin(th)},${oy - (fLen - 3) * Math.sin(th) + 6 * Math.cos(th)} ${ox + (fLen - 3) * Math.cos(th) - 6 * Math.sin(th)},${oy - (fLen - 3) * Math.sin(th) - 6 * Math.cos(th)}`}
          fill={C.purple}
        />
        <text x={fx + 6} y={fy - 4} fontSize={11} fill={C.purple}>力 F</text>
        <line x1={fx} y1={fy} x2={ox + proj} y2={oy} stroke={C.dim} strokeDasharray="4 3" />
        <line x1={ox} y1={oy} x2={ox + proj} y2={oy} stroke={C.gold} strokeWidth={5} />
        <text x={ox + Math.max(proj - 55, 2)} y={oy - 8} fontSize={11} fill={C.gold}>Fcosθ (移動方向の成分)</text>
        <rect x={280} y={150 - 100 * Math.cos(th)} width={16} height={100 * Math.cos(th)} fill={C.gold} opacity={0.85} />
        <text x={268} y={165} fontSize={10} fill={C.gold}>仕事W</text>
        <text x={60} y={40} fontSize={12} fill="#fff">θ = {deg}°　W = Fd cosθ</text>
        <Caption text="F·d = 「移動方向を向いた成分」×「移動距離」" />
      </FigSvg>
      <input className="fig-slider" type="range" min={0} max={90} value={deg}
        onChange={(e) => setDeg(Number(e.target.value))} />
    </div>
  );
}

/** 外積: 平行四辺形の面積 ABsinθ + 右ねじで紙面手前 */
export function CrossProduct() {
  const [deg, setDeg] = useSweep(60, 5, 175);
  const th = (deg * Math.PI) / 180;
  const ox = 70, oy = 140;
  const aLen = 105, bLen = 75;
  const bx = ox + bLen * Math.cos(th);
  const by = oy - bLen * Math.sin(th);
  const area = Math.sin(th);
  return (
    <div>
      <FigSvg>
        <polygon
          points={`${ox},${oy} ${ox + aLen},${oy} ${ox + aLen + bLen * Math.cos(th)},${by} ${bx},${by}`}
          fill={C.green} opacity={0.22}
        />
        <line x1={ox} y1={oy} x2={ox + aLen} y2={oy} stroke={C.cyan} strokeWidth={3} />
        <polygon points={`${ox + aLen + 8},${oy} ${ox + aLen - 4},${oy - 6} ${ox + aLen - 4},${oy + 6}`} fill={C.cyan} />
        <text x={ox + aLen - 14} y={oy + 16} fontSize={11} fill={C.cyan}>A</text>
        <line x1={ox} y1={oy} x2={bx} y2={by} stroke={C.purple} strokeWidth={3} />
        <text x={bx - 16} y={by - 6} fontSize={11} fill={C.purple}>B</text>
        <circle cx={262} cy={60} r={15} fill="none" stroke={C.gold} strokeWidth={2.5} />
        <circle cx={262} cy={60} r={3.5} fill={C.gold} />
        <text x={228} y={92} fontSize={10.5} fill={C.gold}>A×B は紙面の手前向き</text>
        <text x={230} y={106} fontSize={10.5} fill={C.gold}>(右ねじ: A→Bに回す)</text>
        <rect x={60} y={38} width={110 * area} height={10} fill={C.green} opacity={0.9} rx={3} />
        <text x={60} y={32} fontSize={11} fill={C.green}>大きさ |A×B| = ABsinθ = 面積</text>
        <text x={60} y={62} fontSize={11} fill="#fff">θ = {deg}°</text>
        <Caption text="平行なら面積0、直角で最大 — 「どれだけ直交しているか」を測る積" />
      </FigSvg>
      <input className="fig-slider" type="range" min={5} max={175} value={deg}
        onChange={(e) => setDeg(Number(e.target.value))} />
    </div>
  );
}

/** 単振動 = 等速円運動の影。円上の点の高さが sin カーブを描く */
export function ShmCircle() {
  const t = useT();
  const om = 1.5;
  const A = 44;
  const cx = 82, cy = 92;
  const ang = om * t;
  const px = cx + A * Math.cos(ang);
  const py = cy - A * Math.sin(ang);
  const T = (2 * Math.PI) / om;
  const phase = (t % T) / T;
  const gx = 150 + 145 * phase;
  const curve: string[] = [];
  for (let i = 0; i <= 72; i++) {
    const th = (2 * Math.PI * i) / 72;
    curve.push(`${150 + (145 * i) / 72},${(cy - A * Math.sin(th)).toFixed(1)}`);
  }
  return (
    <FigSvg>
      <circle cx={cx} cy={cy} r={A} fill="none" stroke={C.dim} strokeWidth={1.5} />
      <line x1={cx} y1={cy} x2={px} y2={py} stroke={C.dim} strokeWidth={1} />
      <circle cx={px} cy={py} r={7} fill={C.purple} />
      <line x1={px} y1={py} x2={gx} y2={cy - A * Math.sin(ang)} stroke={C.gold} strokeDasharray="3 3" opacity={0.7} />
      <polyline points={curve.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2} opacity={0.85} />
      <circle cx={gx} cy={cy - A * Math.sin((2 * Math.PI * phase * T * om) / (2 * Math.PI))} r={6} fill={C.cyan} />
      <line x1={150} y1={cy} x2={295} y2={cy} stroke={C.dim} strokeWidth={1} />
      <text x={56} y={30} fontSize={11} fill={C.purple}>等速円運動</text>
      <text x={196} y={30} fontSize={11} fill={C.cyan}>高さ = A sin(ωt)</text>
      <Caption text="単振動は円運動の「影」— だから解が sin になる" />
    </FigSvg>
  );
}

/** 空気抵抗: v-t曲線が終端速度に張り付く */
export function TerminalV() {
  const t = useT();
  const p = (t % 4.5) / 4.5;
  const tau = 0.22;
  const vOf = (q: number) => 1 - Math.exp(-q / tau);
  const X = 60 + 210 * p;
  const curve: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const q = i / 60;
    if (60 + 210 * q > X) break;
    curve.push(`${60 + 210 * q},${(145 - 95 * vOf(q)).toFixed(1)}`);
  }
  const v = vOf(p);
  const by = 40 + 85 * p;
  return (
    <FigSvg>
      <g stroke={C.dim} strokeWidth={1.5}>
        <line x1={60} y1={145} x2={295} y2={145} />
        <line x1={60} y1={145} x2={60} y2={25} />
      </g>
      <line x1={60} y1={50} x2={295} y2={50} stroke={C.gold} strokeDasharray="5 4" />
      <text x={172} y={42} fontSize={11} fill={C.gold}>終端速度 v = mg/k</text>
      <polyline points={curve.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <text x={230} y={165} fontSize={11} fill={C.dim}>時間 t</text>
      <text x={30} y={35} fontSize={11} fill={C.dim}>速さv</text>
      <circle cx={30} cy={by} r={9} fill={C.purple} />
      <line x1={30} y1={by + 11} x2={30} y2={by + 34} stroke={C.red} strokeWidth={2.5} />
      <polygon points={`30,${by + 40} 25,${by + 30} 35,${by + 30}`} fill={C.red} />
      <line x1={30} y1={by - 11} x2={30} y2={by - 11 - 26 * v} stroke={C.green} strokeWidth={2.5} />
      <polygon points={`30,${by - 17 - 26 * v} 25,${by - 7 - 26 * v} 35,${by - 7 - 26 * v}`} fill={C.green} />
      <text x={8} y={172} fontSize={10} fill={C.dim}>重力↓は一定、抵抗↑は速いほど大</text>
      <Caption text="抵抗が重力に釣り合ったら加速終了 — 曲線は水平に張り付く" />
    </FigSvg>
  );
}

/** F = −dU/dx: ポテンシャルの谷で、力は坂を下る向き */
export function PotentialSlope() {
  const [s, setS] = useSweep(22, 0, 100);
  const u = s / 100;
  const U = (q: number) => 135 - 80 * Math.pow(2 * q - 1, 2);
  const dU = (q: number) => 320 * (2 * q - 1) / 100; // px単位の傾き
  const px = 45 + 230 * u;
  const py = U(u);
  const slope = dU(u);
  const fLen = Math.min(Math.abs(slope) * 26, 70) * (slope > 0 ? -1 : 1);
  const curve: string[] = [];
  for (let i = 0; i <= 46; i++) curve.push(`${45 + (230 * i) / 46},${U(i / 46).toFixed(1)}`);
  return (
    <div>
      <FigSvg>
        <polyline points={curve.join(" ")} fill="none" stroke={C.dim} strokeWidth={2.5} />
        <circle cx={px} cy={py - 9} r={9} fill={C.gold} />
        {Math.abs(fLen) > 4 && (
          <g>
            <line x1={px} y1={py - 30} x2={px + fLen} y2={py - 30} stroke={C.red} strokeWidth={3} />
            <polygon
              points={`${px + fLen + (fLen > 0 ? 8 : -8)},${py - 30} ${px + fLen - (fLen > 0 ? 4 : -4)},${py - 36} ${px + fLen - (fLen > 0 ? 4 : -4)},${py - 24}`}
              fill={C.red}
            />
            <text x={px + (fLen > 0 ? 4 : -66)} y={py - 40} fontSize={11} fill={C.red}>力 F</text>
          </g>
        )}
        {Math.abs(fLen) <= 4 && <text x={px - 42} y={py - 36} fontSize={11} fill={C.green}>谷底: 傾き0 → 力0 (つり合い)</text>}
        <text x={54} y={40} fontSize={11} fill="#fff">U(x) のグラフ (エネルギーの地形)</text>
        <Caption text="F = −dU/dx: 力は「坂を下る向き」に、傾きの分だけはたらく" />
      </FigSvg>
      <input className="fig-slider" type="range" min={0} max={100} value={s}
        onChange={(e) => setS(Number(e.target.value))} />
    </div>
  );
}

/** 慣性モーメント: 同じ質量でも遠くにあるほど回しにくい */
export function MomentInertia() {
  const t = useT();
  const a1 = 2.4 * t;
  const a2 = 0.75 * t;
  const rotor = (cx: number, r: number, ang: number, color: string) => (
    <g>
      <circle cx={cx} cy={90} r={r + 12} fill="none" stroke={C.dim} strokeWidth={1} strokeDasharray="3 4" />
      <line
        x1={cx - r * Math.cos(ang)} y1={90 - r * Math.sin(ang)}
        x2={cx + r * Math.cos(ang)} y2={90 + r * Math.sin(ang)}
        stroke={C.dim} strokeWidth={2}
      />
      <circle cx={cx + r * Math.cos(ang)} cy={90 + r * Math.sin(ang)} r={9} fill={color} />
      <circle cx={cx - r * Math.cos(ang)} cy={90 - r * Math.sin(ang)} r={9} fill={color} />
      <circle cx={cx} cy={90} r={4} fill="#fff" />
    </g>
  );
  return (
    <FigSvg>
      {rotor(95, 26, a1, C.cyan)}
      {rotor(230, 60, a2, C.purple)}
      <text x={58} y={28} fontSize={11} fill={C.cyan}>質量が近い: I 小 → 速く回る</text>
      <text x={178} y={170} fontSize={11} fill={C.purple}>質量が遠い: I 大 → ゆっくり</text>
      <Caption text="同じ質量・同じトルクでも、遠さの2乗 (I = Σmr²) が効く" />
    </FigSvg>
  );
}

/** 転がる車輪: 接地点は止まり、頂上は2倍速 */
export function Rolling() {
  const t = useT();
  const r = 34;
  const cx = 50 + ((t * 55) % 230);
  const ang = cx / r;
  const arrow = (x: number, y: number, len: number, color: string) =>
    len > 2 ? (
      <g>
        <line x1={x} y1={y} x2={x + len} y2={y} stroke={color} strokeWidth={3} />
        <polygon points={`${x + len + 7},${y} ${x + len - 3},${y - 5} ${x + len - 3},${y + 5}`} fill={color} />
      </g>
    ) : (
      <circle cx={x} cy={y} r={3.5} fill={color} />
    );
  return (
    <FigSvg>
      <line x1={10} y1={134} x2={310} y2={134} stroke={C.dim} strokeWidth={2} />
      <circle cx={cx} cy={100} r={r} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <line
        x1={cx + r * Math.cos(ang)} y1={100 + r * Math.sin(ang)}
        x2={cx - r * Math.cos(ang)} y2={100 - r * Math.sin(ang)}
        stroke={C.cyan} strokeWidth={1.5} opacity={0.6}
      />
      {arrow(cx, 100 - r, 56, C.gold)}
      {arrow(cx, 100, 28, C.green)}
      {arrow(cx, 100 + r - 1, 0, C.red)}
      <text x={cx + 40} y={100 - r - 8} fontSize={11} fill={C.gold}>頂上: 2v</text>
      <text x={cx + 34} y={96} fontSize={11} fill={C.green}>中心: v</text>
      <text x={cx - 66} y={152} fontSize={11} fill={C.red}>接地点: 速度0 (一瞬止まる)</text>
      <Caption text="転がり = 並進 v + 回転 rω。滑らない条件は v = rω" />
    </FigSvg>
  );
}

/** 角運動量保存: 腕を縮めると回転が速くなる */
export function Skater() {
  const t = useT();
  const seg = 2.6;
  const n = Math.floor(t / seg);
  const within = t - n * seg;
  const wOut = 0.9, wIn = 3.6; // I大→ω小 / I小→ω大 (Iω 一定)
  const isIn = n % 2 === 1;
  const pairs = Math.floor(n / 2);
  const base = pairs * seg * (wOut + wIn) + (n % 2 === 1 ? seg * wOut : 0);
  const ang = base + within * (isIn ? wIn : wOut);
  const r = isIn ? 22 : 62;
  const cx = 160, cy = 92;
  return (
    <FigSvg>
      <circle cx={cx} cy={cy} r={66} fill="none" stroke={C.dim} strokeWidth={1} strokeDasharray="3 5" opacity={0.5} />
      <line
        x1={cx - r * Math.cos(ang)} y1={cy - r * Math.sin(ang)}
        x2={cx + r * Math.cos(ang)} y2={cy + r * Math.sin(ang)}
        stroke={C.dim} strokeWidth={2.5}
      />
      <circle cx={cx + r * Math.cos(ang)} cy={cy + r * Math.sin(ang)} r={10} fill={isIn ? C.gold : C.purple} />
      <circle cx={cx - r * Math.cos(ang)} cy={cy - r * Math.sin(ang)} r={10} fill={isIn ? C.gold : C.purple} />
      <circle cx={cx} cy={cy} r={9} fill="#fff" />
      <text x={56} y={30} fontSize={11.5} fill={isIn ? C.gold : C.purple}>
        {isIn ? "腕を縮める: I小 → ω大 (高速回転!)" : "腕を広げる: I大 → ωは小さい"}
      </text>
      <Caption text="外からトルクが無ければ L = Iω は一定 — スケーターのスピン" />
    </FigSvg>
  );
}

/** ガウスの法則: どの球面を貫く本数も同じ */
export function GaussSphere() {
  const t = useT();
  const pulse = 20 + ((t * 55) % 105);
  const cx = 160, cy = 92;
  const lines = [];
  for (let i = 0; i < 12; i++) {
    const th = (2 * Math.PI * i) / 12;
    lines.push(
      <g key={i}>
        <line
          x1={cx + 12 * Math.cos(th)} y1={cy + 12 * Math.sin(th)}
          x2={cx + 82 * Math.cos(th)} y2={cy + 82 * Math.sin(th)}
          stroke={C.gold} strokeWidth={1.5} opacity={0.75}
        />
        <circle cx={cx + pulse * Math.cos(th)} cy={cy + pulse * Math.sin(th)} r={2.4} fill={C.gold} />
      </g>
    );
  }
  return (
    <FigSvg>
      {lines}
      <circle cx={cx} cy={cy} r={40} fill="none" stroke={C.cyan} strokeWidth={2} strokeDasharray="5 4" />
      <circle cx={cx} cy={cy} r={74} fill="none" stroke={C.purple} strokeWidth={2} strokeDasharray="5 4" />
      <circle cx={cx} cy={cy} r={11} fill={C.red} />
      <text x={cx - 5} y={cy + 4} fontSize={11} fill="#fff">+</text>
      <text x={16} y={36} fontSize={11} fill={C.cyan}>内側の球面: 12本</text>
      <text x={210} y={170} fontSize={11} fill={C.purple}>外側の球面: 12本</text>
      <Caption text="中心の点電荷と同心球：E×4πr²は一定。線は流束の目印" />
    </FigSvg>
  );
}

/** 磁束: 面(横から見た線)を傾けると、貫く本数がcosθで減る */
export function FluxTilt() {
  const [deg, setDeg] = useSweep(20, 0, 90);
  const th = (deg * Math.PI) / 180;
  const cx = 168, cy = 95, L = 60;
  // 面は横から見ると線分。法線 n=(cosθ, −sinθ) が矢印(+x)とθをなす。
  // 面の向きは法線に垂直: f=(sinθ, cosθ) (画面座標はy下向き。f·n = 0 を満たす)
  const fx = Math.sin(th), fy = Math.cos(th);
  const rows = [45, 70, 95, 120, 145];
  const halfH = L * Math.abs(Math.cos(th));
  const arrows = rows.map((y) => {
    const hit = Math.abs(y - cy) <= halfH + 0.5 && Math.cos(th) > 0.02;
    let ix = cx;
    if (hit) {
      const s2 = (y - cy) / Math.cos(th);
      ix = cx + s2 * Math.sin(th);
    }
    return (
      <g key={y} opacity={hit ? 1 : 0.3}>
        <line x1={30} y1={y} x2={286} y2={y} stroke={hit ? C.cyan : C.dim} strokeWidth={2} />
        <polygon points={`294,${y} 282,${y - 5} 282,${y + 5}`} fill={hit ? C.cyan : C.dim} />
        {hit && <circle cx={ix} cy={y} r={4} fill={C.gold} />}
      </g>
    );
  });
  const n = Math.round(5 * Math.max(Math.cos(th), 0));
  return (
    <div>
      <FigSvg>
        {arrows}
        <line x1={cx - L * fx} y1={cy - L * fy} x2={cx + L * fx} y2={cy + L * fy} stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={cx + 34 * Math.cos(th)} y2={cy - 34 * Math.sin(th)} stroke={C.purple} strokeWidth={2.5} />
        <polygon
          points={`${cx + 42 * Math.cos(th)},${cy - 42 * Math.sin(th)} ${cx + 31 * Math.cos(th) + 5 * Math.sin(th)},${cy - 31 * Math.sin(th) + 5 * Math.cos(th)} ${cx + 31 * Math.cos(th) - 5 * Math.sin(th)},${cy - 31 * Math.sin(th) - 5 * Math.cos(th)}`}
          fill={C.purple}
        />
        <text x={cx + 46 * Math.cos(th)} y={cy - 46 * Math.sin(th) + 4} fontSize={10.5} fill={C.purple}>法線</text>
        <text x={14} y={26} fontSize={11} fill={C.dim}>面を横から見た図 (金の線 = 面)</text>
        <text x={14} y={172} fontSize={11.5} fill="#fff">θ = {deg}°　貫く本数: {n}/5 本　Φ = BAcosθ</text>
        <Caption text="" />
      </FigSvg>
      <input className="fig-slider" type="range" min={0} max={90} value={deg}
        onChange={(e) => setDeg(Number(e.target.value))} />
    </div>
  );
}

/** アンペールの法則: 電流の周りを磁場が回る */
export function AmpereWire() {
  const t = useT();
  const cx = 160, cy = 92;
  const rings = [26, 46, 66];
  return (
    <FigSvg>
      {rings.map((r, i) => {
        const op = 1 - i * 0.3;
        const ang = t * (1.6 - i * 0.4);
        return (
          <g key={r} opacity={op}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.cyan} strokeWidth={2.2} />
            {[0, 1, 2, 3].map((k) => {
              const a = ang + (k * Math.PI) / 2;
              const x = cx + r * Math.cos(a);
              const y = cy - r * Math.sin(a);
              return (
                <polygon
                  key={k}
                  points={`${x - 6 * Math.sin(a)},${y - 6 * Math.cos(a)} ${x + 4 * Math.sin(a) + 4 * Math.cos(a)},${y + 4 * Math.cos(a) - 4 * Math.sin(a)} ${x + 4 * Math.sin(a) - 4 * Math.cos(a)},${y + 4 * Math.cos(a) + 4 * Math.sin(a)}`}
                  fill={C.cyan}
                />
              );
            })}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={12} fill="#0b1026" stroke={C.gold} strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={3.5} fill={C.gold} />
      <text x={cx + 16} y={cy - 12} fontSize={11} fill={C.gold}>電流 (手前向き⊙)</text>
      <text x={228} y={40} fontSize={11} fill={C.cyan}>遠いほど弱い</text>
      <text x={228} y={54} fontSize={11} fill={C.cyan}>B = μ₀I/2πr</text>
      <Caption text="右手の親指を電流に — 残り4本の指が磁場の回る向き" />
    </FigSvg>
  );
}

/** ローレンツ力: 磁場の中で荷電粒子が円を描く */
export function LorentzCircle() {
  const t = useT();
  const cx = 160, cy = 95, R = 52;
  const ang = 1.6 * t;
  const px = cx + R * Math.cos(ang);
  const py = cy - R * Math.sin(ang);
  const vx = -Math.sin(ang), vy = -Math.cos(ang);
  const dots = [];
  for (let i = 0; i < 5; i++)
    for (let j = 0; j < 3; j++) {
      dots.push(
        <g key={`${i}-${j}`} opacity={0.5}>
          <circle cx={45 + i * 58} cy={35 + j * 60} r={6} fill="none" stroke={C.dim} strokeWidth={1.2} />
          <circle cx={45 + i * 58} cy={35 + j * 60} r={1.6} fill={C.dim} />
        </g>
      );
    }
  return (
    <FigSvg>
      {dots}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={C.dim} strokeWidth={1} strokeDasharray="4 4" />
      <circle cx={px} cy={py} r={8} fill={C.gold} />
      <line x1={px} y1={py} x2={px + 34 * vx} y2={py + 34 * vy} stroke={C.cyan} strokeWidth={2.5} />
      <text x={px + 38 * vx - 4} y={py + 38 * vy} fontSize={11} fill={C.cyan}>v</text>
      <line x1={px} y1={py} x2={px + (cx - px) * 0.5} y2={py + (cy - py) * 0.5} stroke={C.red} strokeWidth={2.5} />
      <text x={px + (cx - px) * 0.56} y={py + (cy - py) * 0.56} fontSize={11} fill={C.red}>F</text>
      <text x={16} y={20} fontSize={10.5} fill={C.dim}>⊙ = 磁場B (紙面の手前向き)</text>
      <Caption text="一様な磁場に速度が垂直、電場なし：磁気力で円運動" />
    </FigSvg>
  );
}

/** RC回路: コンデンサの充電曲線 (指数関数の緩和) */
export function RcCharge() {
  const t = useT();
  const p = (t % 5) / 5;
  const q = (x: number) => 1 - Math.exp(-x / 0.25);
  const X = 60 + 200 * p;
  const curve: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const xx = i / 80;
    if (60 + 200 * xx > X) break;
    curve.push(`${60 + 200 * xx},${(145 - 95 * q(xx)).toFixed(1)}`);
  }
  const now = q(p);
  return (
    <FigSvg>
      <g stroke={C.dim} strokeWidth={1.5}>
        <line x1={60} y1={145} x2={270} y2={145} />
        <line x1={60} y1={145} x2={60} y2={25} />
      </g>
      <line x1={60} y1={50} x2={270} y2={50} stroke={C.gold} strokeDasharray="5 4" />
      <text x={100} y={42} fontSize={11} fill={C.gold}>満タン Q = CV</text>
      <polyline points={curve.join(" ")} fill="none" stroke={C.cyan} strokeWidth={2.5} />
      <text x={218} y={165} fontSize={11} fill={C.dim}>時間 t</text>
      <text x={22} y={35} fontSize={11} fill={C.dim}>電荷q</text>
      <rect x={286} y={60} width={22} height={85} fill="none" stroke={C.dim} strokeWidth={1.5} />
      <rect x={286} y={145 - 85 * now} width={22} height={85 * now} fill={C.cyan} opacity={0.8} />
      <text x={282} y={165} fontSize={10} fill={C.cyan}>充電中</text>
      <Caption text="はじめ勢いよく、満タンに近づくほどゆっくり — 目安の時間が τ = RC" />
    </FigSvg>
  );
}
