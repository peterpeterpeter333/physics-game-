import { useState } from 'react';
import { figureReadings } from '../../content/figure-readings';
import { PotentialGradient } from './PotentialGradient';
import { HeatEngine } from './HeatEngine';
import { MotionContext } from './anim';
import { Flux3D, Cross3D, Helix3D, EmWave3D } from './spatial';
import { Longitudinal, StandingWave, YoungSlits, ChargeWork, Nuclide, MassEnergy } from './foundations';
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
import {
  AvgVsInstant,
  DeltaToD,
  AntiderivativeFamily,
  PartialHill,
  TaylorApprox,
  VectorBundle,
  PythagorasVec,
  DotComponents,
  DotProjection,
  Wrench,
  RightHand,
  DecaySlope,
  InitFamily,
  PeriodMass,
  ValleyParabola,
} from "./math2";
import {
  DragForces,
  DragModels,
  KeBank,
  PowerFlow,
  PathIndependent,
  EnergyLandscape,
  ImpulseArea,
  Restitution,
  AngularMomentum,
  TorqueSpinup,
  KeplerSweep,
  PendulumForce,
  PendulumSync,
  DampedResonance,
  InertiaShapes,
  ParallelAxis,
  TranslateRotate,
  TrainInertia,
  MoonFall,
} from "./mech2";
import {
  GaussRecipe,
  GaussCylPlane,
  ShellZero,
  ContourMap,
  ConductorPlateau,
  CapDerivation,
  FieldEnergy,
  Dielectric,
  Drift,
  DriftCollisions,
  Transmission,
  MotorForce,
  Helix,
  BiotSavart,
  AmpereCircle,
  Solenoid,
  Generator,
  InductorInertia,
  Transformer,
  TimeConstant,
  RlRise,
  LcOscillation,
  Impedance,
  MaxwellFour,
  EmWave,
  JourneyMap,
} from "./em2";

export const REGISTRY: Record<string, () => JSX.Element> = {
  'heat-engine': HeatEngine,
  'potential-gradient': PotentialGradient,
  'flux-3d': Flux3D, 'cross-3d': Cross3D, 'helix-3d': Helix3D, 'em-wave-3d': EmWave3D,
  'longitudinal': Longitudinal, 'standing-wave': StandingWave, 'young-slits': YoungSlits,
  'charge-work': ChargeWork, 'nuclide': Nuclide, 'mass-energy': MassEnergy,
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
  "avg-vs-instant": AvgVsInstant,
  "delta-to-d": DeltaToD,
  "antiderivative-family": AntiderivativeFamily,
  "partial-hill": PartialHill,
  "taylor-approx": TaylorApprox,
  "vector-bundle": VectorBundle,
  "pythagoras-vec": PythagorasVec,
  "dot-components": DotComponents,
  "dot-projection": DotProjection,
  "wrench": Wrench,
  "right-hand": RightHand,
  "decay-slope": DecaySlope,
  "init-family": InitFamily,
  "period-mass": PeriodMass,
  "valley-parabola": ValleyParabola,
  "drag-forces": DragForces,
  "drag-models": DragModels,
  "ke-bank": KeBank,
  "power-flow": PowerFlow,
  "path-independent": PathIndependent,
  "energy-landscape": EnergyLandscape,
  "impulse-area": ImpulseArea,
  "restitution": Restitution,
  "angular-momentum": AngularMomentum,
  "torque-spinup": TorqueSpinup,
  "kepler-sweep": KeplerSweep,
  "pendulum-force": PendulumForce,
  "pendulum-sync": PendulumSync,
  "damped-resonance": DampedResonance,
  "inertia-shapes": InertiaShapes,
  "parallel-axis": ParallelAxis,
  "translate-rotate": TranslateRotate,
  "train-inertia": TrainInertia,
  "moon-fall": MoonFall,
  "gauss-recipe": GaussRecipe,
  "gauss-cyl-plane": GaussCylPlane,
  "shell-zero": ShellZero,
  "contour-map": ContourMap,
  "conductor-plateau": ConductorPlateau,
  "cap-derivation": CapDerivation,
  "field-energy": FieldEnergy,
  "dielectric": Dielectric,
  "drift": Drift,
  "drift-collisions": DriftCollisions,
  "transmission": Transmission,
  "motor-force": MotorForce,
  "helix": Helix,
  "biot-savart": BiotSavart,
  "ampere-circle": AmpereCircle,
  "solenoid": Solenoid,
  "generator": Generator,
  "inductor-inertia": InductorInertia,
  "transformer": Transformer,
  "time-constant": TimeConstant,
  "rl-rise": RlRise,
  "lc-oscillation": LcOscillation,
  "impedance": Impedance,
  "maxwell-four": MaxwellFour,
  "em-wave": EmWave,
  "journey-map": JourneyMap,
};

export function Figure({ id }: { id: string }) {
  const [paused, setPaused] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [speed, setSpeed] = useState(1);
  const [replay, setReplay] = useState(0);
  const Comp = REGISTRY[id];
  if (!Comp) return <p role="alert">図を読み込めませんでした。</p>;
  return (
    <div className="fig-wrap" data-figure-id={id}>
      <p className="figure-reading"><strong>この図で見ること：</strong>{figureReadings[id]}</p>
      <MotionContext.Provider value={{paused, speed}}><Comp key={`${id}-${replay}`} /></MotionContext.Provider>
      {id!=='potential-gradient'&&<div className="figure-controls">
        <button className="btn btn-ghost" aria-label={paused?'アニメーションを再生':'アニメーションを一時停止'} onClick={()=>setPaused(p=>!p)}>{paused?'▶ 再生':'Ⅱ 一時停止'}</button>
        <button className="btn btn-ghost" onClick={()=>{setReplay(n=>n+1);setPaused(false);}}>↻ 最初から</button>
        <label>速度 <select aria-label="アニメーション速度" value={speed} onChange={e=>setSpeed(+e.target.value)}><option value={.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label>
      </div>}
      <details className="figure-reading-details"><summary>図の動きと尺度について</summary><p>「速度」は再生の速さです。物理量を変える操作は、角度・距離など名前を付けたスライダーで行います。視点を変えても物理量は変わりません。数値のない絵は模式図で、画面上の長さから物理量を測らないでください。</p></details>
    </div>
  );
}

/** 開発用: 全図解の一覧 (URLに #figs を付けると表示) */
export function FigureGallery() {
  // #figs=id1,id2 で絞り込み (全部同時に動かすと重いため)
  const only = typeof window !== "undefined" ? window.location.hash.split("=")[1] : "";
  const ids = only ? only.split(",").filter((k) => REGISTRY[k]) : Object.keys(REGISTRY);
  return (
    <div className="screen">
      <h1>図解ギャラリー (dev)</h1>
      {ids.map((id) => (
        <div key={id} style={{ marginBottom: 20 }}>
          <div style={{ color: "#9aa3c7", fontSize: 12, marginBottom: 4 }}>{id}</div>
          <Figure id={id} />
        </div>
      ))}
    </div>
  );
}
