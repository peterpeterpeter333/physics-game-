"""Numerical E1 proof using the actual frozen source functions, without Blender.

This is not a rendered-image, material, collision or final quality-gate check.
Only scene handles/visibility are stubbed; vector/time equations are original.
"""
import ast,hashlib,json,math,os
from types import SimpleNamespace as N
import numpy as np
class V(np.ndarray):
    def __new__(cls,value):return np.asarray(value,dtype=float).view(cls)
    @property
    def length(self):return float(np.linalg.norm(self))
    def normalized(self):return V(self/self.length) if self.length else V(self)
    def lerp(self,other,u):return V(self+(other-self)*u)
W=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
C='/private/tmp/ys/ys-chain-e1v1';D=json.load(open(C+'/blender/data.json'));cues={q['key']:q for q in D['cues']}
paths={n:W+'/scripts/blender/'+n for n in ['desk_lib.py','desk_lib_e1.py','desk_e1v1.py']}
def load_functions(path,names,g):
    nodes=[n for n in ast.parse(open(path).read(),path).body if isinstance(n,ast.FunctionDef) and n.name in names]
    assert len(nodes)==len(names),(names,[n.name for n in nodes]);exec(compile(ast.Module(body=nodes,type_ignores=[]),path,'exec'),g)
dg={};load_functions(paths['desk_lib.py'],{'clamp','sm','seg'},dg)
d=N(**dg);d.set_emit=lambda *a:None;d.show_tree=lambda *a:None;shown={};d.show=lambda o,v:shown.__setitem__(id(o),v)
eg={'math':math,'PI':math.pi,'Vector':V};load_functions(paths['desk_lib_e1.py'],{'surface'},eg);ext=N(surface=eg['surface'],place_globe_doll=lambda *a:None)
T=lambda k,w,occ=0:[q['time'] for q in cues[k]['wordEvents'] if w in q['word']][occ]
ray=lambda:N(data=N(splines=[N(points=[N(co=None),N(co=None)])]))
rays=[ray(),ray()];rot=N(rotation_euler=N(z=0));globe={'root':N(),'rot':rot,'latmat':None,'lonmat':None}
parts={'dolls':[None,None,None],'torch':{'light':N(energy=0)},'ship':{'root':N()},'shipclock':{'root':N()},'sun':N()}
g={'math':math,'PI':math.pi,'Vector':V,'gc':V([0,.2,.19]),'ext':ext,'d':d,'globe':globe,'PARTS':parts,'visible':lambda *a:None,'T':T,'E':lambda k:cues[k]['end'],'S':lambda k:cues[k]['start'],'southern':{'rays':rays},'sight':{'dots':[N() for _ in range(18)],'horizon':N(),'sector':N(data=N(vertices=[N() for _ in range(18)]))}}
load_functions(paths['desk_e1v1.py'],{'equatorial_star_position','globe_state','ship_state','latitude_state'},g)
latitude=[]
for t,want in [(71.85,0),(73.3,0),(73.55,0),(73.85,45),(74.15,90),(84.5,30),(87.45,30),(87.85,40),(88.25,50),(89.23,50)]:
    actual=g['latitude_state'](t);assert abs(actual-want)<1e-8,(t,actual,want)
    latitude.append({'time':t,'latitude':actual,'expected':want})
star=[];a=T('lon:time','回って');b=cues['lon:time']['end']
for longitude in [28,-28]:
    progress=(60-longitude)/120;lo=a;hi=b
    for _ in range(60):
        mid=(lo+hi)/2
        if d.seg(mid,a,b)<progress:lo=mid
        else:hi=mid
    t=(lo+hi)/2;g['globe_state'](t,{'group':'star','row':13});i=0 if longitude==28 else 1
    eye,end=[np.array(p.co[:3]) for p in rays[i].data.splines[0].points];v=end-eye;normal=(eye-g['gc'])/np.linalg.norm(eye-g['gc']);alt=math.degrees(math.asin(float(np.dot(v/np.linalg.norm(v),normal))))
    assert abs(alt-40)<1e-8 and np.linalg.norm(v-np.array([0,-.12,0]))<1e-10 and shown[id(rays[i])]
    star.append({'longitude':longitude,'rotationProgress':progress,'transitTime':t,'altitudeDegrees':alt,'direction':list(v/np.linalg.norm(v))})
assert star[0]['transitTime']<star[1]['transitTime']
sun=[];a=T('ship:sun','太陽');b=T('ship:sun','なった時');O=np.array([.25,-.05,.04])
for fraction in [0,.25,.5,.75,1]:
    t=a+(b-a)*fraction;g['ship_state'](t,{'group':'ship','row':21});p=parts['sun'].location
    theta=math.pi-math.pi/2*d.seg(t,a,b);original=np.array([.25+.11*math.cos(theta),-.05,.14+.11*math.sin(theta)])
    assert np.linalg.norm((p-O)-.65*(original-O))<1e-10 and parts['sun'].scale==(.65,)*3
    sun.append({'time':t,'position':list(p),'lengthRatio':float(np.linalg.norm(p-O)/np.linalg.norm(original-O))})
sha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
tag=os.environ.get('E1_FREEZE_TAG','r6');assert tag.startswith('r') and tag[1:].isdigit()
freeze=json.load(open(C+'/e1v1-'+tag+'-source-freeze.json'))
for name in ['desk_e1v1.py','desk_lib_e1.py']:assert sha(paths[name])==freeze['files']['scripts/blender/'+name]
out={'scope':'actual frozen source numerical equations with mocked scene handles; NOT render/final gate','freeze':tag,'sourceSha256':{n:sha(p) for n,p in paths.items()},'latitude':latitude,'star':star,'whiteGlyphPosition':list(g['equatorial_star_position']()),'sunHomothety':sun,'fog':{'worldSpeed':.01,'planeWidth':.41,'generatedSpeed':.01/.41,'layerPhaseDifference':.37},'status':'PASS'}
target=C+'/e1v1-'+tag+'-world-data-proof.json';json.dump(out,open(target,'w'),ensure_ascii=False,indent=2);print(json.dumps(out,ensure_ascii=False,indent=2))
