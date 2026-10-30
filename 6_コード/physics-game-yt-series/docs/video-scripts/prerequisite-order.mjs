// Concept links, not stage locks. One media file may support several lessons.
export const prerequisites={
 'graph-slope':['position'], 'acceleration':['graph-slope'], 'area-distance':['position'],
 'force':['acceleration'], 'vector-difference':['position'], 'trig':['position'],
 'work-energy':['force','initial-values'], 'potential-conservation':['work-energy'],
 'difference-limit':['graph-slope'], 'sum':['area-distance'],
 'integral-compute':['difference-limit','sum'], 'sin-wave':['trig','radian'],
 'vector-length':['vector-difference'], 'dot-work':['trig','work-energy'],
 'chain':['difference-limit'], 'partial':['chain'], 'exponential':['chain'], 'log':['exponential'],
 'melting':['heat-units'], 'mole':['pressure'], 'gas-work':['pressure','work-energy'],
 'superposition':['wave'], 'doppler':['wave'], 'refraction':['wave','trig'],
 'circuit-power':['charge-current'], 'field-flux':['charge-current','trig'],
 'capacitor':['charge-current'], 'photon-atom':['wave','charge-current'],
 'initial-values':['acceleration'], 'impulse':['force'], 'system':['force'],
 'circular':['vector-difference','difference-limit'], 'spring':['force'],
 'ode-initial':['force','difference-limit'], 'center-mass':['force'],
 'rotation-inertia':['center-mass','radian','integral-compute'],
 'torque':['vector-length','trig'], 'rolling':['radian','center-mass','rotation-inertia'],
 'reference':['vector-difference','difference-limit'],
 'algebra-projectile':['trig','initial-values'], 'power-derivative':['difference-limit'],
 'taylor':['power-derivative'], 'cosine-dot':['dot-work'], 'work-path':['dot-work','sum'],
 'oscillation-equation':['spring','sin-motion','chain'], 'polar':['radian','chain','torque'],
 'ellipse':['polar','oscillation-equation'], 'sin-derivative':['sin-wave','difference-limit'],
 'bohr-energy':['electric-work','circular'], 'gas-particles':['mole','impulse'],
 'heat-cycle':['gas-work'], 'traveling-wave':['wave','sin-wave'],
 'sound-boundary':['superposition'], 'light-geometry':['refraction','superposition'],
 'electric-work':['charge-current','work-energy'], 'charge-calculation':['charge-current'],
 'quantum-units':['photon-atom','impulse'], 'nuclear-energy':['nucleus'],
 'absolute':['difference-limit'], 'pendulum':['trig','radian','spring'],
 'collision':['impulse'], 'mass-integration':['rotation-inertia','integral-compute'],
 'derivative-rules':['difference-limit'], 'energy-chain':['chain','dot-work','integral-compute'],
 'inverse-potential':['potential-conservation','integral-compute'],
 'cross-components':['torque'], 'drag-solve':['ode-initial','log'],
 'oscillation-coefficients':['oscillation-equation'], 'sin-motion':['sin-derivative','chain']
};
export function orderLessons(lessons){
 const byId=new Map(lessons.map(l=>[l.id,{...l,before:[...l.before]}]));
 const done=new Set(),visiting=new Set(),result=[];
 function visit(id){
  if(done.has(id))return;
  if(visiting.has(id))throw Error(`Prerequisite cycle: ${id}`);
  const item=byId.get(id);if(!item)throw Error(`Missing prerequisite: ${id}`);
  visiting.add(id);
  for(const dep of prerequisites[id.replace(/^prep-/,'')]??[])visit(`prep-${dep}`);
  visiting.delete(id);done.add(id);result.push(item);
 }
 lessons.forEach(l=>visit(l.id));
 for(const item of [...result].reverse())for(const dep of prerequisites[item.id.replace(/^prep-/,'')]??[]){
  const prior=byId.get(`prep-${dep}`);
  prior.before=[...new Set([...prior.before,...item.before])];
 }
 return result;
}
