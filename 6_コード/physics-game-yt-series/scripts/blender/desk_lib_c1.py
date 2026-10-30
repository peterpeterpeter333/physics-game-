"""C-1 専用の机上模型。見本の材質・光・手の生成関数をそのまま使う。"""
import math,os
import bpy
from mathutils import Vector,Euler,Matrix
import desk_lib as d

def capture(fn):
    before=set(bpy.data.objects);p=fn();return p,list(set(bpy.data.objects)-before)
def writing_stroke():
    # 帳簿の数字の列に、羽根ペンの先と同じ軌跡の細いインクが伸びる。
    cu=bpy.data.curves.new('c1_writing_curve','CURVE');cu.dimensions='3D';cu.bevel_depth=.00020;cu.bevel_resolution=2
    sp=cu.splines.new('POLY');sp.points.add(31)
    for pt in sp.points:pt.co=(-.43,-.02,.023,1)
    ob=d.link(bpy.data.objects.new('c1_writing_ink',cu));d.put(ob,d.mat('c1_written_ink','#49331c',.8));return ob
def rootparts(name,center,fn):
    r=d.empty(name,center);before=set(bpy.data.objects);p=fn()
    for o in set(bpy.data.objects)-before:
        if o.parent is None:d.parent(o,r)
    return {'root':r,**p}
def gear(name,center=(0,0,.10),radius=.05):
    c=Vector(center);root=d.empty(name,c);sc=radius/.05
    brass=d.mat(name+'_brass','#c9a44e',.3,metal=.8)
    paper=d.mat('c1_dial_paper','#efe2c4',.7)
    pts=[];faces=[];N=80
    # 20本の歯を輪郭から作る。角は見本と同じ面取り。
    for y in [-.006,.006]:
        for i in range(N):
            a=2*math.pi*i/N;r=radius*(1 if i%4 in [1,2] else .87);pts.append((r*math.sin(a),y,r*math.cos(a)))
    faces.append(tuple(range(N-1,-1,-1)));faces.append(tuple(range(N,2*N)))
    for i in range(N):j=(i+1)%N;faces.append((i,j,j+N,i+N))
    me=bpy.data.meshes.new(name+'mesh');me.from_pydata(pts,[],faces);me.update();o=d.link(bpy.data.objects.new(name+'_teeth',me));o.location=c;d.put(o,brass);bv=o.modifiers.new('bv','BEVEL');bv.width=.0007;bv.segments=2;d.parent(o,root)
    face=d.cyl(name+'_face',radius*.80,.001,(c.x,c.y-.0068,c.z),paper,rot=(math.pi/2,0,0),verts=64);d.parent(face,root)
    for n in range(10):
        a=2*math.pi*n/10;p=c+Vector((radius*.63*math.sin(a),-.008,radius*.63*math.cos(a)))
        tx=d.text(name+'_digit'+str(n),str(n),.012*sc,d.M_INK,p)
        tx.rotation_euler=(Euler((0,a,0)).to_matrix()@Euler((math.pi/2,0,0)).to_matrix()).to_euler();d.parent(tx,root)
    cap=d.cyl(name+'_pin',.006*sc,.020*sc,(c.x,c.y-.009,c.z),brass,rot=(math.pi/2,0,0));d.parent(cap,root)
    bump=d.box(name+'_bump',(.018*sc,.012*sc,.009*sc),c+Vector((-.060*sc,-.013,0)),d.mat(name+'_red','#d6453d',.4,emit='#ffd23f',strength=0,unique=True),bevel=.002*sc);d.parent(bump,root)
    return {'root':root,'center':c,'bump':bump,'brass':brass}

def calculator():
    c=Vector((.05,.06,0));r=d.empty('c1_m1',c);wood=d.wood('c1_walnut','#5b3a22','#4b2f1b',(1,12,1));brass=d.mat('c1_brass','#c9a44e',.3,metal=.8)
    parts=[];parts.append(d.box('c1_case',(.36,.14,.060),c+Vector((0,0,.035)),wood,bevel=.006))
    parts.append(d.box('c1_faceplate',(.348,.132,.009),c+Vector((0,0,.069)),brass,bevel=.004))
    # 開くふた。盤・窓は箱側に残り、機構を見る面が奥へ起きる。
    hinge=d.empty('c1_lid_hinge',c+Vector((0,.070,.072)))
    lid=d.box('c1_lid',(.365,.14,.007),c+Vector((0,0,.076)),wood,bevel=.004);d.parent(lid,hinge)
    d.parent(hinge,r)
    dials=[];windows=[];centers=[];insides=[]
    for i in range(5):
        x=c.x+(i-2)*.064;p=Vector((x,c.y-.029,.076));rr=d.empty('c1_dial%d'%i,p);centers.append(p)
        a=d.cyl('c1_dialrim%d'%i,.028,.004,p,brass);d.parent(a,rr)
        a=d.cyl('c1_dialpaper%d'%i,.025,.004,p+Vector((0,0,.0025)),d.mat('c1_paper','#efe2c4',.7));d.parent(a,rr)
        for n in range(10):
            ang=math.pi/2-2*math.pi*n/10
            a=d.text('c1_dial%d_n%d'%(i,n),str(n),.009,d.M_INK,p+Vector((.020*math.cos(ang),.020*math.sin(ang),.005)),rot=(0,0,ang-math.pi/2));d.parent(a,rr)
            a=d.cyl('c1_hole%d_n%d'%(i,n),.0025,.001,p+Vector((.012*math.cos(ang),.012*math.sin(ang),.005)),d.M_INK,verts=16);d.parent(a,rr)
        d.parent(rr,r);dials.append(rr)
        wp=Vector((x,c.y+.033,.077));a=d.box('c1_windowframe%d'%i,(.038,.037,.003),wp,d.M_INK,bevel=.003);parts.append(a)
        a=d.box('c1_windowpaper%d'%i,(.030,.029,.003),wp+Vector((0,0,.002)),d.M_WHITE,bevel=.002);parts.append(a)
        a=d.text('c1_windowdigit%d'%i,'0',.020,d.M_INK,wp+Vector((0,0,.004)));parts.append(a);windows.append(a)
        gi=gear('c1_internal%d'%i,(x,c.y+.059,.094),.020);d.parent(gi['root'],r);d.show(gi['bump'],False);insides.append(gi)
    for o in parts:d.parent(o,r)
    tag=d.empty('c1_pricetag',c+Vector((.17,-.02,.08)));a=d.box('c1_pricepaper',(.040,.025,.001),tag.location,d.mat('c1_tag','#f4e8cc',.8),bevel=.002);d.parent(a,tag)
    string=d.torus('c1_pricestring',.016,.0007,c+Vector((.15,-.02,.08)),d.mat('c1_string','#e8d8b0',.8));d.parent(string,r);d.parent(tag,r)
    return {'root':r,'center':c,'hinge':hinge,'dials':dials,'windows':windows,'centers':centers,'tag':tag,'string':string,'insides':insides}

def carry_peg(g,spacing,radius):
    # 9 の位置（歯車の +36°）で、8mm の赤い突起が隣の歯先へ届く。
    # 固定された短い真鍮の張出しで自分の歯車へ接続。赤い部品を浮かせない。
    sc=radius/.05;phase=-math.pi/5;rot=Euler((0,phase,0)).to_matrix()
    tip=-spacing+radius+.004*sc-.001
    bump=g['bump'];bump.scale=(.008/.018,1,1);bump.matrix_parent_inverse=Matrix.Identity(4)
    bump.location=rot@Vector((tip,-.010,0));bump.rotation_euler=(0,phase,0)
    for mod in bump.modifiers:
        if mod.type=='BEVEL':mod.width=.0005*sc
    left=tip+.003*sc;right=-radius*.90
    carrier=d.box('c1_peg_carrier',(right-left,.010,.009*sc),(0,0,0),g['brass'],bevel=.0005*sc)
    carrier.parent=g['root'];carrier.matrix_parent_inverse=Matrix.Identity(4)
    carrier.location=rot@Vector(((left+right)/2,-.006,0));carrier.rotation_euler=(0,phase,0)
    g['carrier']=carrier;g['pegPhase']=phase;g['pegNominalSize']=[.008*sc,.012*sc,.009*sc]
    g['pegContactLocal']=[-spacing+radius,-.018,0]
    return carrier

def mechanism(name='c1_m2',count=5):
    c=Vector((0,.05,0));root=d.empty(name,c);N=count;spacing=.12 if N==5 else .10
    width=(N-1)*spacing+.12;wm=d.wood(name+'_wood','#8a5a32','#6f4526',(1,12,1));brass=d.mat('c1_brass','#c9a44e',.3,metal=.8)
    pieces=[d.box(name+'_base',(width,.18,.012),(c.x,c.y,.012),wm,bevel=.006)]
    for x in [-width/2+.018,width/2-.018]:pieces.append(d.box(name+'_post',(.022,.025,.18),(x,c.y+.035,.105),wm,bevel=.004))
    pieces.append(d.box(name+'_rail',(width,.025,.018),(0,c.y+.035,.196),wm,bevel=.004))
    wheels=[];arms=[];contacts=[]
    for i in range(N):
        x=(i-(N-1)/2)*spacing;radius=.05 if N==5 else .043;g=gear(name+'_g'+str(i),(x,c.y,.115),radius);carry_peg(g,spacing,radius);wheels.append(g);d.parent(g['root'],root)
        a=d.cyl(name+'_axle',.004,.060,(x,c.y+.016,.115),brass,rot=(math.pi/2,0,0));pieces.append(a)
        me=bpy.data.meshes.new(name+'_pointermesh');me.from_pydata([(x-.004,c.y-.015,.178),(x+.004,c.y-.015,.178),(x,c.y-.015,.168)],[],[(0,1,2)]);me.update();a=d.link(bpy.data.objects.new(name+'_pointer',me));d.put(a,d.M_INK);pieces.append(a)
        if i>0:
            # 水平時のおもりは隣の歯車の真上へ届き、歯先に接する。
            # .054 + .066 = 桁の間隔 .12。前後にも .001m 重なる。
            pivot=Vector((x-(spacing-.066),c.y-.012,.171));ar=d.empty(name+'_arm'+str(i),pivot)
            m=d.mat(name+'_armM'+str(i),'#c9a44e',.3,metal=.8,emit='#ffd23f',strength=0,unique=True)
            bar=d.box(name+'_armbar'+str(i),(.07,.006,.006),pivot+Vector((-.035,0,0)),m,bevel=.0015);d.parent(bar,ar)
            weight=d.box(name+'_weight'+str(i),(.014,.014,.014),pivot+Vector((-.066,0,0)),d.mat('c1_lead','#5f6368',.5,metal=.4),bevel=.003);d.parent(weight,ar)
            pin=d.cyl(name+'_armpin'+str(i),.005,.016,pivot,brass,rot=(math.pi/2,0,0));pieces.append(pin);d.parent(ar,root);arms.append({'root':ar,'weight':weight,'material':m,'index':i,'pivot':pivot})
            ct=d.sphere(name+'_contact'+str(i),.003,(x-spacing+radius,c.y-.018,.115),d.mat(name+'_contactM'+str(i),'#ffd23f',.3,emit='#ffd23f',strength=1.5));pieces.append(ct);contacts.append(ct)
    for o in pieces:d.parent(o,root)
    # この証拠は箱の当たり判定。角丸の歯先と重りが接する構図を試写でも確かめる。
    contact_proof=[]
    for a in arms:
        neighbor=wheels[a['index']-1]['center'];rest=a['pivot']+Vector((-.066,0,0));dx=abs(rest.x-neighbor.x);vertical_overlap=(neighbor.z+(.05 if N==5 else .043))-(rest.z-.007);depth_overlap=(rest.y+.007)-(neighbor.y-.006)
        if N==5:assert dx<1e-8 and 0<=vertical_overlap<=.002 and depth_overlap>0
        contact_proof.append({'index':a['index'],'weightCenterRest':list(rest),'nextGearCenter':list(neighbor),'horizontalError':dx,'verticalOverlap':vertical_overlap,'depthOverlap':depth_overlap})
    return {'root':root,'wheels':wheels,'arms':arms,'contacts':contacts,'center':c,'count':count,'contactProof':contact_proof}

def meter():
    c=Vector((.40,-.08,0));r=d.empty('c1_meter',c)
    b=d.box('c1_meterbody',(.14,.06,.045),c+Vector((0,0,.025)),d.mat('c1_meterblack','#252525',.4),bevel=.010);d.parent(b,r)
    windows=[]
    for i,ch in enumerate('0019'):
        p=c+Vector(((i-1.5)*.031,-.0308,.026));a=d.box('c1_meterwindow',(.027,.002,.029),p,d.M_INK,bevel=.002);d.parent(a,r)
        pivot=d.empty('c1_meterflip'+str(i),p);tx=d.text('c1_meternum'+str(i),ch,.023,d.M_INKW,p+Vector((0,-.0015,0)),rot=(math.pi/2,0,0));d.parent(tx,pivot);d.parent(pivot,r);windows.append((pivot,tx))
    return {'root':r,'windows':windows,'center':c}

def shishi():
    c=Vector((-.42,-.02,0));r=d.empty('c1_shishi',c);green=d.mat('c1_bamboo','#7c9a4a',.55);dark=d.mat('c1_bamboonode','#536b30',.6)
    for x in [-.025,.025]:a=d.cyl('c1_shishipost',.004,.10,c+Vector((x,0,.05)),green);d.parent(a,r)
    arm=d.empty('c1_bamboopivot',c+Vector((0,0,.078)))
    tube=d.cyl('c1_bambootube',.012,.12,c+Vector((0,0,.078)),green,rot=(0,math.pi/2,0));d.parent(tube,arm)
    for x in [-.045,0,.045]:a=d.torus('c1_bamboonode',.012,.001,c+Vector((x,0,.078)),dark,rot=(0,math.pi/2,0));d.parent(a,arm)
    opening=d.cyl('c1_bamboomouth',.010,.001,c+Vector((-.061,0,.078)),d.mat('c1_hollow','#25361b',.8),rot=(0,math.pi/2,0));d.parent(opening,arm)
    d.parent(arm,r)
    rock=d.sphere('c1_stone',.022,c+Vector((.050,0,.016)),d.mat('c1_stoneM','#8c8c89',.8),scale=(1.3,1,.7));d.parent(rock,r)
    a=d.cyl('c1_spoutstand',.004,.14,c+Vector((-.046,.070,.070)),green);d.parent(a,r)
    a=d.cyl('c1_spout',.006,.070,c+Vector((-.046,.035,.14)),green,rot=(math.pi/2,0,0));d.parent(a,r)
    drops=[]
    for i in range(14):a=d.sphere('c1_water'+str(i),.0028,c+Vector((-.05,0,.11)),d.mat('c1_waterM','#5b9bff',.25,metal=.15));d.parent(a,r);drops.append(a)
    return {'root':r,'arm':arm,'drops':drops,'center':c}

def domino():
    c=Vector((.42,-.12,0));r=d.empty('c1_domino',c);tiles=[]
    for i in range(8):
        p=c+Vector(((i-3.5)*.018,0,0));rr=d.empty('c1_domino'+str(i),p);b=d.box('c1_dominobody',(.012,.004,.025),p+Vector((0,0,.0125)),d.M_WHITE,bevel=.0015);d.parent(b,rr)
        for z in [.006,.019]:a=d.sphere('c1_dominodot',.0015,p+Vector((0,-.0023,z)),d.M_INK,seg_=12,ring=8);d.parent(a,rr)
        d.parent(rr,r);tiles.append(rr)
    return {'root':r,'tiles':tiles}

def pascal():
    c=Vector((.22,-.05,0));r=d.empty('c1_pascal',c);navy=d.mat('c1_pascalcoat','#1b2440',.55);hair=d.mat('c1_pascalhair','#4a2e1a',.6)
    parts=[d.cyl('c1_pascalbody',.027,.070,c+Vector((0,0,.035)),navy),d.sphere('c1_pascalhead',.025,c+Vector((0,0,.091)),d.M_SKIN),d.cyl('c1_pascalhair',.026,.055,c+Vector((0,.009,.090)),hair),d.box('c1_pascalcollar',(.047,.025,.008),c+Vector((0,-.012,.068)),d.M_WHITE,bevel=.003)]
    # 顔は描かず、肩までの髪と白い襟で見分ける。
    for sx in [-1,1]:parts.append(d.cyl('c1_pascalarm',.007,.045,c+Vector((sx*.012,-.023,.054)),navy,rot=(0,sx*math.pi/3,0)))
    for p in parts:d.parent(p,r)
    idea=gear('c1_idea',c+Vector((0,0,.154)),.020);d.parent(idea['root'],r)
    return {'root':r,'idea':idea}

def build(data,cache):
    d.catalog_stage();parts={};groups={}
    def add(k,fn):parts[k],groups[k]=capture(fn)
    add('m1',calculator);add('m2',mechanism);add('eight',lambda:mechanism('c1_eight',8));add('meter',meter);add('shishi',shishi);add('domino',domino);add('pascal',pascal)
    # 共通のろうそくと羽根ペンを再使用。位置だけC-1の机に合わせる。
    root=d.empty('c1_candlegroup',d.CD)
    originals=[bpy.data.objects[n] for n in ['dish','candle','wick','flame','candleL']]
    for o in originals:d.parent(o,root)
    root.location=Vector((-.51,.095,0));parts['candle']={'root':root};groups['candle']=[root]+originals
    groups['quill']=[d.quill]+list(d.quill.children_recursive)
    def papers():
        material=d.imgmat('c1_ledger',os.path.join(cache,'blender','tex','c1-ledger.png'));papers=[]
        for i in range(23):
            p=Vector((-.38+.004*math.sin(i*2.3),-.02+.004*math.cos(i*1.7),.002+i*.0038));r=d.empty('c1_paper'+str(i),p)
            b=d.box('c1_paperbody',(.21,.30,.0011),p,d.mat('c1_oldpaper','#efe2c4',.8),bevel=.0005);d.parent(b,r)
            a=d.plane('c1_paperprint',.209,.299,p+Vector((0,0,.0007)),material);d.parent(a,r);papers.append((r,p.copy()))
        ink=d.cyl('c1_inkwell',.015,.025,(-.25,-.08,.0125),d.M_INK);return {'papers':papers,'ink':ink,'stroke':writing_stroke()}
    add('papers',papers)
    add('paper',lambda:{'paper':d.box('c1_arithmeticpaper',(.21,.15,.001),(.05,-.22,.001),d.mat('c1_calc_paper','#f4e8cc',.8),bevel=.002)})
    for i in range(6):o=d.box('c1_rule%d'%i,(.19,.0005,.0002),(.05,-.28+i*.024,.0017),d.mat('c1_ruleM','#d8cbb6',.9));groups['paper'].append(o)
    def crowd():
        roots=[]
        for i in range(10):
            p=Vector((.1+(i%5-2)*.055,.4+(i//5)*.05,0));r=d.empty('c1_crowd'+str(i),p);m=d.mat('c1_crowdM'+str(i),'#695d50' if i%2 else '#77695c',.8,alpha=.5,unique=True)
            for o in [d.cyl('c1_crowdbody',.018,.045,p+Vector((0,0,.022)),m),d.sphere('c1_crowdhead',.016,p+Vector((0,0,.061)),d.mat('c1_crowdskin','#c9ac91',.8,alpha=.5))]:d.parent(o,r)
            for sx in [-1,1]:o=d.cyl('c1_crowdarm',.004,.038,p+Vector((sx*.025,0,.045)),m,rot=(0,sx*.5,0));d.parent(o,r)
            roots.append((r,p.copy()))
        return {'roots':roots}
    add('crowd',crowd)
    def hat():
        r=d.empty('c1_hat',(-.55,.12,0));a=d.cyl('c1_hatbrim',.05,.007,(-.55,.12,.006),d.M_NAVY);b=d.cyl('c1_hattop',.033,.040,(-.55,.12,.029),d.M_NAVY)
        for o in [a,b]:d.parent(o,r)
        return {'root':r}
    add('hat',hat)
    # 見本の得点板をそのまま使い、C-1の名前の札を付ける。
    d.board_h.location=Vector((.58,.30,0));labels=[o for o in d.board_h.children if o.name.startswith('bl')]
    for o,label in zip(sorted(labels,key=lambda o:o.location.x),['人の手','機械']):o.data.body=label;o.data.size=.034
    parts['score']={'root':d.board_h};groups['score']=[d.board_h]+list(d.board_h.children_recursive)
    def prototypes():
        objects=[];boxes=[];wm=d.wood('c1_shelfW','#8a5a32','#6f4526')
        for row in range(3):
            a=d.box('c1_shelf',(.96,.12,.015),(.10,.36+row*.075,.015+row*.065),wm,bevel=.004);objects.append(a)
            for i in range(12):
                p=Vector((-.34+i*.08,.36+row*.075,.045+row*.065));m=d.wood('c1_protow'+str(i%3),['#5b3a22','#895d31','#6c4426'][i%3],['#4b2f1b','#6f4526','#57391e'][i%3]);r=d.empty('c1_proto',p);a=d.box('c1_protobox',(.070,.053,.035+(i%3)*.006),p,m,bevel=.004);d.parent(a,r)
                for j in range(2+i%3):a=d.cyl('c1_protodial',.006,.002,p+Vector(((j-(1+i%3)/2)*.014,-.008,.023)),d.mat('c1_brass','#c9a44e',.3,metal=.8),verts=20);d.parent(a,r)
                boxes.append((r,p.copy(),row,i))
        return {'boxes':boxes}
    add('proto',prototypes)
    return parts,groups
