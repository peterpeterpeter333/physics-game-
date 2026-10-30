"""1-2 2nd edition parts (copy of desk_lib_1_2.py). The reference library and all its models remain untouched."""
import math
import bpy
from mathutils import Vector
import desk_lib as d

def capture(fn):
    before=set(bpy.data.objects)
    part=fn()
    return part,list(set(bpy.data.objects)-before)

def tree(root):return [root]+list(root.children_recursive)

def letters(name,top,bottom=None,center=(0,-.1,0),material=None,bottom_material=None,spacing=.055,size=.042):
    bottom=bottom or top;assert len(top)==len(bottom)
    result=[]
    for i,(a,b) in enumerate(zip(top,bottom)):
        if a==' ':continue
        p=Vector((center[0]+(i-(len(top)-1)/2)*spacing,center[1],center[2]))
        r=d.tile(name+str(i),a,material or d.M_WHITE,b,bottom_material or material or d.M_WHITE,(0,0,-5),size=size,
                 tsize=.030,ink_top=d.M_INK if material!=d.M_BLUE else d.M_INKW,ink_bot=d.M_INK)
        d.place_tile(r,p)
        result.append((r,p,i))
    return result

def schedule():
    c=Vector((0,-.10,0));paper=d.mat('1_2v1_schedule_paper','#f4e8cc',.75)
    edge=d.mat('1_2v1_schedule_edge','#b8925a',.65)
    base=d.box('1_2v1_schedule',(.30,.12,.004),c+Vector((0,0,.002)),paper,bevel=.006)
    cells={}
    for row,y in [('top',.026),('bot',-.026)]:
        for i in range(6):
            p=c+Vector(((i-2.5)*.040,y,.0045))
            d.box('1_2v1_plan_cell_'+row+str(i),(.038,.042,.001),p,edge,bevel=.002)
            d.box('1_2v1_plan_inset_'+row+str(i),(.035,.039,.001),p+Vector((0,0,.0006)),paper,bevel=.001)
            cells['plan.'+row+'.'+str(i)]=p+Vector((0,0,.002))
    brass=d.mat('1_2v1_clip_brass','#c9a44e',.3,metal=.8)
    for x in [-.012,.012]:d.box('1_2v1_clip',(.002,.025,.004),(x,c.y+.052,.006),brass,bevel=.001)
    d.box('1_2v1_clipbar',(.026,.002,.004),(0,c.y+.064,.006),brass,bevel=.001)
    # Pictograms, not explanatory 3D text: crown and key.
    d.box('1_2v1_crown_base',(.018,.004,.003),(-.14,c.y+.025,.007),brass,bevel=.001)
    for x in [-.147,-.14,-.133]:d.box('1_2v1_crown_point',(.004,.012,.003),(x,c.y+.031,.007),brass,bevel=.001)
    d.torus('1_2v1_key_ring',.004,.0015,(-.14,c.y-.027,.008),d.M_BLUE)
    d.box('1_2v1_keyshaft',(.002,.014,.002),(-.14,c.y-.036,.008),d.M_BLUE,bevel=.001)
    return {'base':base,'anchors':cells,'center':c}

def marker():
    p=Vector((0,-.30,0));r=d.tile('1_2v1_marker','A',d.M_WHITE,'A',d.M_WHITE,p,size=.0525,tsize=.036)
    gold=d.mat('1_2v1_marker_gold','#ffd23f',.4,emit='#ffd23f',strength=0,unique=True)
    for sx,sy,x,y in [(.052,.002,0,.025),(.052,.002,0,-.025),(.002,.052,.025,0),(.002,.052,-.025,0)]:
        o=d.box('1_2v1_marker_edge',(sx,sy,.002),(p.x+x,p.y+y,.014),gold,bevel=.0005);d.parent(o,r)
    return {'root':r,'material':gold,'center':p}

def paper_stack():
    material=d.imgmat('1_2v1_paper_table',d.os.path.join(d.os.environ.get('EM_FILM_CACHE','/private/tmp/ys/ys-chain-1-2v2'),'blender','tex','table-1-2v1.png'))
    papers=[]
    for i in range(26):
        p=Vector((.235+.003*math.sin(i*2.3),-.10+.003*math.cos(i*1.7),.001+i*.001))
        body=d.box('1_2v1_paper_body%d'%i,(.10,.14,.0009),p,d.M_WHITE,bevel=.0004)
        top=d.plane('1_2v1_paper_top%d'%i,.099,.139,p+Vector((0,0,.0005)),material)
        angle=math.radians(3*math.sin(i*1.8));body.rotation_euler.z=angle;top.rotation_euler.z=angle
        papers.append((body,top,p.copy()))
    return {'papers':papers,'center':Vector((.235,-.1,.026))}

def sealed_stack():
    papers=[]
    for i,col in enumerate(['#a3151b','#2a4f8f','#3f6b3a','#a3151b','#2a4f8f','#3f6b3a']):
        p=Vector((.006*math.sin(i),-.1+.006*math.cos(i),i*.005+.002))
        root=d.empty('1_2v1_letterbundle%d'%i,p)
        body=d.box('1_2v1_bundle_paper%d'%i,(.12,.08,.004),p,d.M_WHITE,bevel=.001)
        pattern=d.plane('1_2v1_bundle_print%d'%i,.118,.078,p+Vector((0,0,.0021)),d.M_LET)
        wax=d.cyl('1_2v1_bundle_seal%d'%i,.010,.003,p+Vector((.025,0,.003)),d.mat('1_2v1_wax%d'%i,col,.4))
        for o in [body,pattern,wax]:d.parent(o,root)
        root.rotation_euler.z=math.radians(6*math.sin(i*1.4));papers.append((root,p.copy()))
    return {'papers':papers,'center':Vector((0,-.1,.025))}

def numbered_ring(center=(0,-.1,0)):
    c=Vector(center);cards=[]
    paper=d.mat('1_2v1_num_paper','#efe2c4',.7)
    for i in range(26):
        a=d.ang_of(i);p=c+Vector((.155*math.cos(a),.155*math.sin(a),.014))
        r=d.empty('1_2v1_number%d'%i,p)
        m=d.mat('1_2v1_numglow%d'%i,'#efe2c4',.6,emit='#ffd23f',strength=0,unique=True)
        o=d.box('1_2v1_numcard%d'%i,(.018,.024,.003),p,m,bevel=.001)
        tx=d.text('1_2v1_numtext%d'%i,str(i),.012,d.M_INK,p+Vector((0,0,.0018)))
        for obj in [o,tx]:d.parent(obj,r)
        r.rotation_euler=(math.radians(15),0,a-math.pi/2)
        cards.append((r,p,m))
    return {'cards':cards,'center':c}

TOWER_DY=.40
def towers(data):
    # v2: the three tower rows stand .40 further back on the desk (TOWER_DY), so a closer camera sees desk, not floor, below them.
    rows={};centers={'fixed':-.28+TOWER_DY,'key':-.10+TOWER_DY,'alberti':.08+TOWER_DY}
    for name,y in centers.items():
        blocks=[]
        matcol={'fixed':'#f39a45','key':'#f5b06a','alberti':'#f6f2e8'}[name]
        d.box('1_2v1_towerbase_'+name,(.812,.062,.008),(0,y,.004),d.wood('1_2v1_tower_wood','#8a5a32','#6f4526'),bevel=.005)
        for i,n in enumerate(data['frequencies'][name]):
            p=Vector(((i-12.5)*.030,y,.010+.0034/2))
            m=d.mat('1_2v1_slab_'+name+str(i),matcol,.5,emit='#ffd23f',strength=0,unique=True)
            o=d.box('1_2v1_tower_'+name+str(i),(.024,.024,.0034*.88),p,m,bevel=.0008)
            ar=o.modifiers.new('arr','ARRAY');ar.use_relative_offset=False;ar.use_constant_offset=True;ar.constant_offset_displace=(0,0,.0034);ar.count=max(1,n)
            tag=d.tile('1_2v1_towerletter_'+name+str(i),d.ABC[i],d.M_OR,d.ABC[i],d.M_OR,(0,0,-5),size=.026,tsize=.020)
            d.place_tile(tag,(p.x,p.y-.035,.008))
            blocks.append((o,tag,p,m))
        rows[name]=blocks
    return {'rows':rows,'ys':centers}

def word_lines(name,words,coded,center=(0,-.10,0),pitch=.065,material=None,bottom_material=None,spacing=.055):
    """v2: one word per line (read top to bottom), so each tile can be large on a portrait screen.
    Returns the same (root,position,index) triples as letters(); index counts letters across lines
    (left to right, line by line), which is also the flip order."""
    c=Vector(center);result=[];k=0
    for line,(w,b) in enumerate(zip(words,coded)):
        assert len(w)==len(b)
        y=c.y-(line-(len(words)-1)/2)*pitch
        for i,(a,bb) in enumerate(zip(w,b)):
            p=Vector((c.x+(i-(len(w)-1)/2)*spacing,y,c.z))
            r=d.tile(name+str(k),a,material or d.M_WHITE,bb,bottom_material or material or d.M_WHITE,(0,0,-5),size=.042,
                     tsize=.030,ink_top=d.M_INK,ink_bot=d.M_INK)
            d.place_tile(r,p);result.append((r,p,k));k+=1
    return result

def build(data):
    d.catalog_stage();parts={};groups={}
    def add(name,fn):
        parts[name],groups[name]=capture(fn)
    add('alberti',lambda:d.alberti_disk('1_2v1_alberti',(0,-.10,0)))
    brass=d.mat('1_2v1_alberti_gold','#c9a44e',.3,metal=.8)
    rim=d.torus('1_2v1_goldrim',.157,.001,(0,-.10,.013),brass);groups['alberti'].append(rim)
    add('receiver',lambda:d.alberti_disk('1_2v1_receiver',(.37,-.08,0)))
    parts['receiver']['root'].scale=(.8,.8,.8)
    add('marker',marker)
    add('schedule',schedule)
    add('numbers',numbered_ring)
    add('keyword',lambda:d.keyword_rack('1_2v1_key','KEY',(0,-.29,0),repeats=4))
    add('longkey',lambda:d.keyword_rack('1_2v1_longkey','KEYWORD',(0,-.37+TOWER_DY,0),repeats=1))
    add('shifts',lambda:d.shift_cards('1_2v1_shifts',[10,4,24,10,4,24],(0,-.36,0)))
    add('paperstack',paper_stack)
    add('stack',sealed_stack)
    add('bellaso',lambda:d.bellaso_book('1_2v1_bellaso',(-.07,-.10,0)))
    add('vigenere',lambda:d.bellaso_book('1_2v1_vigenere',(.23,-.10,0)))
    navy=d.mat('1_2v1_navy','#2a3a6a',.55)
    for attr in ['cover','back']:parts['vigenere'][attr].data.materials.clear();parts['vigenere'][attr].data.materials.append(navy)
    pattern=d.imgmat('1_2v1_book_pattern',d.os.path.join(d.os.environ.get('EM_FILM_CACHE','/private/tmp/ys/ys-chain-1-2v2'),'blender','tex','keyword-1-2v1.png'))
    for name in ['bellaso','vigenere']:
        parts[name]['page'].data.materials.clear();parts[name]['page'].data.materials.append(pattern)
    vroot=d.empty('1_2v1_vigenere_root',parts['vigenere']['center'])
    for o in groups['vigenere']:
        if o.parent is None:d.parent(o,vroot)
    vroot.scale=(1.12,1.09,1.25);groups['vigenere'].append(vroot);parts['vigenere']['root']=vroot
    add('towers',lambda:towers(data))
    add('nameclock',lambda:d.name_clock('1_2v1_nameclock',(0,-.10,0)))
    add('answer',lambda:letters('1_2v1_ans','MYEXD DRO VODDOBC','COUNT THE LETTERS',(0,-.27,0),d.M_OR,d.M_WHITE))
    add('cat',lambda:letters('1_2v1_cat','CAT','MER',(0,-.10,0),d.M_WHITE,d.M_OR))
    add('aaa',lambda:letters('1_2v1_aaa','AAA','KEY',(0,-.10,0),d.M_WHITE,d.M_OR))
    add('cipher',lambda:letters('1_2v1_cipher','gkwnprtuzlxysomq'[:12],center=(0,-.23,0),material=d.M_OR))
    add('corrupt',lambda:letters('1_2v1_corrupt','GIJVHMXIGIJV',center=(0,-.22,0),material=d.M_OR))
    # Materials are unique so a sequential error cannot recolour all tiles at once.
    for i,(r,p,idx) in enumerate(parts['corrupt']):
        m=d.mat('1_2v1_errorink%d'%i,'#f08a2c',.45,unique=True)
        o=bpy.data.objects[r.name+'_t'];o.data.materials.clear();o.data.materials.append(m)
    add('challenge',lambda:letters('1_2v1_challenge','GIJV HMXI',center=(0,-.10,0),material=d.M_OR))
    # v2 parts (new objects only; the 1st-edition parts above are unchanged).
    add('answer3',lambda:word_lines('1_2v2_ans',['MYEXD','DRO','VODDOBC'],['COUNT','THE','LETTERS'],(0,-.17,0),.068,d.M_OR,d.M_WHITE))
    add('cipher8',lambda:letters('1_2v2_cipher','gkwn prtu',center=(0,-.31,0),material=d.M_OR))
    add('receiver2',lambda:d.alberti_disk('1_2v2_receiver',(.31,0,0)))
    parts['receiver2']['root'].scale=(.8,.8,.8)
    add('keyword9',lambda:d.keyword_rack('1_2v2_key','KEY',(0,-.10,0),repeats=3))
    add('corrupt9',lambda:letters('1_2v2_corrupt','GIJVHMXIG',center=(0,-.25,0),material=d.M_OR))
    for i,(r,p,idx) in enumerate(parts['corrupt9']):
        m=d.mat('1_2v2_errorink%d'%i,'#f08a2c',.45,unique=True)
        o=bpy.data.objects[r.name+'_t'];o.data.materials.clear();o.data.materials.append(m)
    groups['letter']=tree(d.let_root);d.let_root.location=(0,-.10,0);d.letter_state(3)
    groups['score']=tree(d.board_h)
    groups['caesar']=tree(d.disk_root)+[bpy.data.objects['pin']]
    d.disk_root.location=(0,-.10,0);bpy.data.objects['pin'].location=(0,-.10,.020)
    groups['dolls']=sum([tree(o) for o in d.DOLL_ROOTS+d.DOLL_TAGS],[])
    for name in ['kai','mio']:groups['hand_'+name]=tree(d.HANDS[name])
    # All narration-visible glyphs must be large; books carry a decorative texture only.
    for name in ['bellaso','vigenere']:
        for o in groups[name]:
            if o.type=='FONT':o.hide_render=True;o.hide_viewport=True
        groups[name]=[o for o in groups[name] if o.type!='FONT']
    for objects in groups.values():
        for o in objects:d.show(o,False)
    return parts,groups
