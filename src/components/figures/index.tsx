import {
  XtSlope,
  StrobeAccel,
  VtArea,
  FreeFall,
  NewtonCarts,
  EnergySlide,
  Projectile,
  Collision,
  Circular,
  Spring,
} from "./mechanics";
import {
  HeatFlow,
  GasBox,
  WaveTravel,
  Beats,
  Refraction,
  Doppler,
  Interference,
  Circuit,
  Induction,
  Coulomb,
  Capacitor,
  Photoelectric,
  HalfLife,
  Bohr,
} from "./fields";
import {
  DerivSlope,
  IntegralSum,
  SmallAngle,
  DotProduct,
  CrossProduct,
  ShmCircle,
  TerminalV,
  PotentialSlope,
  MomentInertia,
  Rolling,
  Skater,
  GaussSphere,
  FluxTilt,
  AmpereWire,
  LorentzCircle,
  RcCharge,
} from "./univ";
import {
  PowerRule,
  SlopeTrace,
  DxAnatomy,
  ChainGears,
  ProductRect,
  VectorComponents,
  Ftc,
  EulerE,
  LineIntegral,
  SurfaceTiles,
  XvaChain,
  TorqueDoor,
  ComSeesaw,
} from "./univ2";
import {
  PredictMachine,
  SolveRecipe,
  FieldMap,
  TwoWords,
  LoopIntegral,
  ParallelMiss,
  AreaVector,
} from "./univ3";

const REGISTRY: Record<string, () => JSX.Element> = {
  "xt-slope": XtSlope,
  "strobe-accel": StrobeAccel,
  "vt-area": VtArea,
  freefall: FreeFall,
  newton: NewtonCarts,
  "energy-slide": EnergySlide,
  projectile: Projectile,
  collision: Collision,
  circular: Circular,
  spring: Spring,
  "heat-flow": HeatFlow,
  "gas-box": GasBox,
  "wave-travel": WaveTravel,
  beats: Beats,
  refraction: Refraction,
  doppler: Doppler,
  interference: Interference,
  circuit: Circuit,
  induction: Induction,
  coulomb: Coulomb,
  capacitor: Capacitor,
  photoelectric: Photoelectric,
  halflife: HalfLife,
  bohr: Bohr,
  "deriv-slope": DerivSlope,
  "integral-sum": IntegralSum,
  "small-angle": SmallAngle,
  "dot-product": DotProduct,
  "cross-product": CrossProduct,
  "shm-circle": ShmCircle,
  "terminal-v": TerminalV,
  "potential-slope": PotentialSlope,
  "moment-inertia": MomentInertia,
  rolling: Rolling,
  skater: Skater,
  "gauss-sphere": GaussSphere,
  "flux-tilt": FluxTilt,
  "ampere-wire": AmpereWire,
  "lorentz-circle": LorentzCircle,
  "rc-charge": RcCharge,
  "power-rule": PowerRule,
  "slope-trace": SlopeTrace,
  "dx-anatomy": DxAnatomy,
  "chain-gears": ChainGears,
  "product-rect": ProductRect,
  "vector-components": VectorComponents,
  ftc: Ftc,
  "euler-e": EulerE,
  "line-integral": LineIntegral,
  "surface-tiles": SurfaceTiles,
  "xva-chain": XvaChain,
  "torque-door": TorqueDoor,
  "com-seesaw": ComSeesaw,
  "predict-machine": PredictMachine,
  "solve-recipe": SolveRecipe,
  "field-map": FieldMap,
  "two-words": TwoWords,
  "loop-integral": LoopIntegral,
  "parallel-miss": ParallelMiss,
  "area-vector": AreaVector,
};

export function Figure({ id }: { id: string }) {
  const Comp = REGISTRY[id];
  if (!Comp) return null;
  return (
    <div className="fig-wrap">
      <Comp />
    </div>
  );
}

/** 開発用: 全図解の一覧 (URLに #figs を付けると表示) */
export function FigureGallery() {
  return (
    <div className="screen">
      <h1>図解ギャラリー (dev)</h1>
      {Object.keys(REGISTRY).map((id) => (
        <div key={id} style={{ marginBottom: 20 }}>
          <div style={{ color: "#9aa3c7", fontSize: 12, marginBottom: 4 }}>{id}</div>
          <Figure id={id} />
        </div>
      ))}
    </div>
  );
}
