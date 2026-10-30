"""B-1's new, warm tabletop models. No shared library or existing asset is edited."""
import math,random,os
import bpy
from mathutils import Vector
import desk_lib as d

def curve(name,points,material,radius=.0012):
    cu=bpy.data.curves.new(name,'CURVE');cu.dimensions='3D';cu.bevel_depth=radius;cu.bevel_resolution=2
    sp=cu.splines.new('POLY');sp.points.add(len(points)-1)
    for p,v in zip(sp.points,points):p.co=(*v,1)
    o=bpy.data.objects.new(name,cu);d.link(o);d.put(o,material);return o

def arrow(name,length=.09,width=.012,color=None):
    root=d.empty(name)
    for side,col in [(1,'#d6453d'),(-1,'#fffaf0')]:
        me=bpy.data.meshes.new(name+'mesh');me.from_pydata([(0,0,0),(-width/2,0,0),(0,side*length/2,0),(width/2,0,0)],[],[(0,1,2,3)])
        o=bpy.data.objects.new(name+'half',me);d.link(o);d.put(o,d.mat(name+str(side),color or col,.4,emit=color,strength=.35 if color else 0));d.parent(o,root)
        so=o.modifiers.new('thickness','SOLIDIFY');so.thickness=.0012
    pin=d.sphere(name+'pin',width*.19,(0,0,.0018),d.mat('b1brass','#c9a44e',.3,metal=.8));d.parent(pin,root)
    return root

def build(data,tex):
    d.catalog_stage();before=set(bpy.data.objects);P={};G={}
    wood=d.wood('b1oak','#9a6234','#7b4a24');gold=d.mat('b1brass','#c9a44e',.3,metal=.8)
    red=d.mat('b1N','#d6453d',.4);blue=d.mat('b1S','#3a6fd8',.4);white=d.mat('b1ivory','#efe2c4',.7);ink=d.mat('b1ink','#3b2412',.6)
    def group(name,fn):
        old=set(bpy.data.objects);p=fn();G[name]=list(set(bpy.data.objects)-old);P[name]=p;return p
    def compass():
        root=d.empty('b1_compass',(0,-.18,0));x,y=0,-.18
        d.box('b1_boxbase',(.14,.14,.009),(x,y,.0045),wood,.004)
        for sx in [-1,1]:d.box('b1_boxside',(.008,.14,.04),(sx*.066,y,.028),wood,.002)
        for sy in [-1,1]:d.box('b1_boxedge',(.14,.008,.04),(x,y+sy*.066,.028),wood,.002)
        d.cyl('b1_dial',.055,.008,(x,y,.032),white)
        d.torus('b1_compassrim',.056,.003,(x,y,.038),gold)
        for j in range(36):
            a=2*math.pi*j/36;d.box('b1_dialtick',(.001,.004 if j%9 else .008,.0007),(.049*math.sin(a),y+.049*math.cos(a),.0365),ink,.0002,rot=(0,0,-a))
        for j,ch in enumerate('NESW'):
            a=j*math.pi/2;d.text('b1_dial_'+ch,ch,.012,red if ch=='N' else ink,(.039*math.sin(a),y+.039*math.cos(a),.037))
        needle=arrow('b1_compassneedle');needle.location=(x,y,.043)
        hinge=d.empty('b1_lidhinge',(0,y+.07,.05))
        lid=d.box('b1_lid',(.14,.14,.008),(x,y,.054),wood,.004);d.parent(lid,hinge)
        star=[]
        for j in range(32):
            a=j*math.pi/16;r=.04 if j%2==0 else .011;star.append((r*math.sin(a),y+r*math.cos(a),.0488))
        rose=curve('b1_lidrose',star+[star[0]],ink,.0007);d.parent(rose,hinge)
        return {'root':root,'needle':needle,'hinge':hinge,'center':Vector((x,y,.043))}
    group('compass',compass)
    def bar(name,center):
        root=d.empty(name,center)
        for side,m in [(-1,blue),(1,red)]:
            o=d.box(name+'half',(.025,.06,.015),(center[0],center[1]+side*.03,center[2]),m,.003);d.parent(o,root)
            label=d.text(name+('_N' if side==1 else '_S'),'N' if side==1 else 'S',.012,d.M_INKW,(center[0],center[1]+side*.045,center[2]+.0082));d.parent(label,root)
        band=d.box(name+'separator',(.0255,.0015,.0155),center,white,.0003);d.parent(band,root)
        return root
    group('magnets',lambda:{'a':bar('b1_magA',(-.035,-.02,.017)),'b':bar('b1_magB',(.08,-.02,.017))})
    def garlic():
        root=d.empty('b1_garlic',(0,-.12,.018));parts=[]
        for i in range(8):
            a=i*math.pi/4;o=d.sphere('b1_clove',.011,(.01*math.cos(a),-.12+.01*math.sin(a),.018),d.mat('b1garlic','#eee4cf',.75),scale=(.85,.85,1.5));d.parent(o,root);parts.append(o)
        stem=d.cyl('b1_garlicstem',.003,.018,(0,-.12,.039),white);d.parent(stem,root)
        nails=[]
        for i in range(3):
            p=(-.045+i*.01,.10,.014);r=d.empty('b1_nail',p)
            for o in [d.cyl('b1_nailshaft',.0018,.04,p,d.mat('b1iron','#666665',.35,metal=.7),rot=(math.pi/2,0,0),verts=16),d.cyl('b1_nailhead',.005,.002,(p[0],p[1]+.02,p[2]),d.mat('b1iron','#666665',.35,metal=.7),rot=(math.pi/2,0,0))]:d.parent(o,r)
            nails.append(r)
        streaks=[d.box('b1_rub',(.018,.004,.0007),(-.035,-.04+i*.014,.025),white,.001) for i in range(3)]
        return {'root':root,'nails':nails,'streaks':streaks}
    group('garlic',garlic)
    def star():
        c=Vector((-.20,.08,0));d.cyl('b1_starbase',.035,.009,c+Vector((0,0,.005)),wood);d.cyl('b1_starpole',.002,.32,c+Vector((0,0,.17)),gold)
        pts=[]
        for i in range(10):
            a=i*math.pi/5;rr=.027 if i%2==0 else .012;pts.append(c+Vector((rr*math.sin(a),0,.35+rr*math.cos(a))))
        mat=d.mat('b1polarstarYellow','#ffd23f',.45,emit='#ffd23f',strength=1.5)
        me=bpy.data.meshes.new('b1_star_mesh');me.from_pydata([c+Vector((0,0,.35))]+pts,[],[(0,j+1,(j+1)%10+1) for j in range(10)])
        o=bpy.data.objects.new('b1_polarstar',me);d.link(o);d.put(o,mat);return c+Vector((0,0,.35))
    group('star',star)
    def oldmap():
        d.box('b1_mapboard',(.31,.23,.006),(-.32,.12,.003),wood,.003)
        d.plane('b1_oldmap',.30,.22,(-.32,.12,.0063),d.imgmat('b1map',tex+'/map.png'))
        rock=d.sphere('b1_magneticisland',.015,(-.32,.195,.014),d.mat('b1blackrock','#343130',.65),scale=(1.6,.8,.6),seg_=16,ring=8)
        return {'rock':rock,'center':Vector((-.32,.12,.01))}
    group('map',oldmap)
    def doll(name,c,color,collar=False,cap=False,sailor=False):
        root=d.empty(name,c);cc=Vector(c)
        for o in [d.cyl(name+'body',.02,.062,cc+Vector((0,0,.032)),d.mat(name+'coat',color,.55)),d.sphere(name+'head',.021,cc+Vector((0,0,.085)),d.M_SKIN)]:d.parent(o,root)
        if collar:
            for i in range(12):
                a=i*math.pi/6;o=d.sphere(name+'ruff',.007,cc+Vector((.021*math.cos(a),.021*math.sin(a),.065)),white,scale=(1,1,.45),seg_=12,ring=8);d.parent(o,root)
            for o in [d.cyl(name+'blackhatbrim',.025,.004,cc+Vector((0,0,.106)),d.mat('b1hatblack','#24212a',.6)),d.cyl(name+'blackhat',.019,.013,cc+Vector((0,0,.113)),d.mat('b1hatblack','#24212a',.6))]:d.parent(o,root)
        if cap:
            for o in [d.cyl(name+'hat',.025,.006,cc+Vector((0,0,.105)),blue),d.cyl(name+'cap',.019,.012,cc+Vector((0,0,.111)),white)]:d.parent(o,root)
        if sailor:
            navy=d.mat('b1sailorNavy','#243951',.6);redcloth=d.mat('b1sailorRed','#b44b43',.6)
            for z in [.012,.025,.038,.051]:
                o=d.cyl(name+'stripe',.0204,.005,cc+Vector((0,0,z)),navy);d.parent(o,root)
            o=d.sphere(name+'headscarf',.0217,cc+Vector((0,0,.101)),redcloth,scale=(1,1,.4));d.parent(o,root)
            o=d.box(name+'scarftail',(.010,.005,.022),cc+Vector((.016,.008,.091)),redcloth,.002,rot=(0,.45,0));d.parent(o,root)
        return root
    group('gilbert',lambda:doll('b1_gilbert',(-.48,-.1,0),'#29262b',collar=True))
    def norman():
        root=doll('b1_norman',(-.405,-.04,0),'#765a41',cap=True);cc=Vector((-.405,-.04,0))
        for o in [d.box('b1_normanapron',(.026,.003,.038),cc+Vector((0,-.020,.035)),d.mat('b1apron','#704129',.8),.002),d.box('b1_normanfile',(.007,.005,.034),cc+Vector((.026,-.006,.045)),d.mat('b1file','#797c80',.45,metal=.5),.0007)]:d.parent(o,root)
        return root
    group('norman',norman)
    group('sailor',lambda:doll('b1_sailor',(.035,-.02,0),'#f6f2e8',sailor=True))
    def vane():
        c=Vector((.20,-.18,0));d.cyl('b1_vanebase',.04,.01,c+Vector((0,0,.005)),wood);d.cyl('b1_vanepole',.003,.17,c+Vector((0,0,.09)),gold)
        root=d.empty('b1_vanerooster',c+Vector((0,0,.19)))
        metal=d.mat('b1vaneMetal','#5a5f66',.45,metal=.6)
        for o in [d.sphere('b1_roosterbody',.02,c+Vector((0,0,.19)),metal,scale=(1.6,.25,1)),d.sphere('b1_roosterhead',.01,c+Vector((.03,0,.21)),metal,scale=(1,.3,1)),d.box('b1_vanearrow',(.10,.003,.004),c+Vector((0,0,.175)),metal,.001),d.sphere('b1_roostertail',.022,c+Vector((-.034,0,.207)),metal,scale=(.65,.15,1)),d.sphere('b1_roostercomb',.005,c+Vector((.029,0,.221)),metal,scale=(1.5,.4,1))]:d.parent(o,root)
        for j,ch in enumerate('NESW'):
            a=j*math.pi/2;v=c+Vector((.044*math.sin(a),.044*math.cos(a),.14));d.text('b1_vane_'+ch,ch,.009,metal,v)
        return {'root':root,'center':c+Vector((0,0,.16))}
    group('vane',vane)
    def wind():
        root=d.empty('b1_wind');curves=[]
        for j in range(3):
            pts=[(.40-.19*i/28,-.18+(j-1)*.014,.17+j*.022+.008*math.sin(i*.23+j)) for i in range(29)]
            o=curve('b1_windline',pts,d.mat('b1windWhite','#fffaf0',.65),.0008);d.parent(o,root);curves.append(o)
        return {'root':root,'curves':curves}
    group('wind',wind)
    def terrella():
        c=Vector((0,.10,.12));rockmat=d.mat('b1magnetite','#3e3b38',.56,metal=.3)
        rock=d.sphere('b1_terrella',.09,c,rockmat,seg_=64,ring=32)
        rock.shape_key_add(name='Basis');rough=rock.shape_key_add(name='rough');
        for v in rough.data:
            q=v.co.normalized();v.co*=1+.11*math.sin(7*q.x+3*q.y)*math.cos(5*q.z+2*q.y)+.06*math.sin(6*q.y-4*q.z)
        d.cyl('b1_terrellabase',.06,.012,(0,.10,.006),wood)
        d.cyl('b1_terrellastem',.006,.040,(0,.14,.025),wood)
        for z,m in [(c.z+.093,blue),(c.z-.093,red)]:d.sphere('b1_pole',.009,(0,.10,z),m,scale=(1,1,.5))
        needles=[]
        for i,n in enumerate(data['needles']):
            rr=Vector(n['r']);p=c+.097*rr;support=d.sphere('b1_needlesupport',.004,p,d.mat('b1stand','#e1e7e0',.25,alpha=.35))
            a=arrow('b1_surfaceneedle'+str(i),.024,.005);a.location=p+.005*rr;needles.append((a,support,rr,Vector(n['B']).normalized()))
        chips=[]
        for i in range(20):
            a=i*2.399;chips.append(d.sphere('b1_chip',.003,(.11*math.cos(a),.10+.11*math.sin(a),.005),rockmat,seg_=8,ring=4))
        meridians=[]
        for lon in range(0,180,30):
            a=math.radians(lon);pts=[c+Vector((.0908*math.cos(-math.pi/2+2*math.pi*j/180)*math.cos(a),.0908*math.cos(-math.pi/2+2*math.pi*j/180)*math.sin(a),.0908*math.sin(-math.pi/2+2*math.pi*j/180))) for j in range(181)]
            meridians.append(curve('b1_terrella_meridian',pts,d.mat('b1meridianWhite','#e5e3d7',.7,alpha=.45),.00045))
        return {'center':c,'rock':rock,'rough':rough,'needles':needles,'chips':chips,'meridians':meridians}
    group('terrella',terrella)
    def powder():
        c=P['terrella']['center'];mat=d.mat('b1powder','#3b3b3b',.65);rng=random.Random(816);start=[];end=[];verts=[];faces=[]
        lines=data['fieldLines']
        on_board=[[p for p in line if abs(p[0])<=.215 and .021<=c.z+p[1]<=.359] for line in lines]
        assert all(on_board)
        for i in range(3000):
            line=on_board[i%16];p=line[(i*17)%len(line)];a=Vector((rng.uniform(-.21,.21),.10+.018,rng.uniform(.035,.335)));b=Vector((p[0],.10+.018,c.z+p[1]));
            # Each filing is a tiny tetrahedron, one mesh with a shape-key displacement.
            for dv in [(0,0,.0012),(.001,0,-.0006),(-.0005,.0009,-.0006),(-.0005,-.0009,-.0006)]:verts.append(a+Vector(dv));end.append(b+Vector(dv))
            j=i*4;faces.extend([(j,j+1,j+2),(j,j+2,j+3),(j,j+3,j+1),(j+1,j+3,j+2)])
        me=bpy.data.meshes.new('b1_ironfilings');me.from_pydata(verts,[],faces);o=bpy.data.objects.new('b1_ironfilings',me);d.link(o);d.put(o,mat);o.shape_key_add(name='Basis');sk=o.shape_key_add(name='aligned')
        for v,p in zip(sk.data,end):v.co=p
        arrows=[]
        for i,line in enumerate(lines):
            for j in range(3):a=arrow('b1_fieldarrow',.008,.003,color='#ffd23f');arrows.append((a,i,j))
        board=d.box('b1_glassboard',(.44,.002,.34),(0,.12,.19),d.mat('b1glass','#b6d0d2',.2,alpha=.1),.002)
        bottle=d.cyl('b1_powderbottle',.014,.044,(.15,.08,.2),d.mat('b1bottle','#c1d8ce',.2,alpha=.65));return {'mesh':o,'aligned':sk,'arrows':arrows,'board':board,'bottle':bottle}
    group('powder',powder)
    def protractor(c,name,inward=False):
        sign=1 if inward else -1
        pts=[c+Vector((.07*math.cos(a*math.pi/180),0,sign*.07*math.sin(a*math.pi/180))) for a in range(181)]
        curve(name+'_semicircle',pts,gold,.002)
        for j in range(19):
            a=j*math.pi/18;r=.060 if j%3==0 else .064;curve(name+'_tick',[c+Vector((r*math.cos(a),0,sign*r*math.sin(a))),c+Vector((.069*math.cos(a),0,sign*.069*math.sin(a)))],ink,.0009 if j%3==0 else .0005)
        for value in [0,30,60,90]:
            a=math.radians(value);d.text(name+'_number'+str(value),str(value),.009,ink,c+Vector((.052*math.cos(a),-.001,sign*.052*math.sin(a))),rot=(math.pi/2,0,0))
        curve('b1_horizon',[c+Vector((-.08,0,0)),c+Vector((.08,0,0))],d.mat('b1yellow','#ffd23f',.4),.0008)
        a=math.radians(72);mark=d.sphere(name+'_mark72',.0026,c+Vector((.071*math.cos(a),-.001,sign*.071*math.sin(a))),d.mat('b1mark72','#ffd23f',.4,emit='#ffd23f',strength=1.5))
        return mark
    def meter():
        c=Vector((-.30,-.04,.085));d.box('b1_meterbase',(.1,.06,.012),c-Vector((0,0,.079)),wood,.003)
        mark=protractor(c,'b1_meter')
        a=arrow('b1_meterneedle',.12,.007);a.location=c;a.rotation_euler=(math.pi/2,0,-math.pi/2)
        return {'center':c,'needle':a,'mark72':mark}
    group('meter',meter)
    def frame_only():
        old=set(bpy.data.objects);c=Vector((0,0,0));mark=protractor(c,'b1_terrella_protractor',inward=True);items=set(bpy.data.objects)-old
        root=d.empty('b1_terrella_protractor_root')
        for ob in items:d.parent(ob,root)
        root.scale=(.4,.4,.4);d.show(mark,False)
        return {'root':root,'center':c,'mark72':mark}
    group('protractor',frame_only)
    def globe():
        c=Vector((.32,.12,.16));d.cyl('b1_globebase',.075,.018,(c.x,c.y,.009),wood);d.cyl('b1_axis',.004,.31,(c.x,c.y,.17),gold)
        surface=d.imgmat('b1earth',tex+'/globe.png');transparent=surface.copy();transparent.name='b1earthTransparent'
        d.principled(transparent).inputs['Alpha'].default_value=.6
        try:transparent.surface_render_method='DITHERED'
        except Exception:
            try:transparent.blend_method='BLEND'
            except Exception:pass
        globe=d.sphere('b1_globe',.12,c,surface,seg_=64,ring=32)
        # A physically separate meridional cutaway is shown only in comparison shots.
        disc=d.cyl('b1_cutaway',.119,.005,c,d.mat('b1cut','#e9dcc0',.65),rot=(math.pi/2,0,0),verts=96)
        needle=arrow('b1_londonneedle',.028,.005);lat=math.radians(51.5);pin=c+Vector((.12*math.cos(lat),-.007,.12*math.sin(lat)))
        needle.location=pin;needle.rotation_euler=(math.pi/2,0,-lat)
        d.sphere('b1_londonpin',.004,pin,red)
        tangent=Vector((-math.sin(lat),0,math.cos(lat)));normal=Vector((math.cos(lat),0,math.sin(lat)))
        horizon=curve('b1_london_horizon',[pin+tangent*.045+Vector((0,-.002,0)),pin-tangent*.045+Vector((0,-.002,0))],d.mat('b1horizonInk','#77736b',.65),.0008)
        inner=d.empty('b1_innerbar',c)
        halves=[];letters=[]
        for sign in [-1,1]:
            o=d.box('b1_innerhalf',(.028,.028,.08),c+Vector((0,0,sign*.04)),d.mat('b1neutral','#777573',.6),.004);d.parent(o,inner);halves.append(o)
            letter=d.text('b1_innerletter','',.020,d.mat('b1innerLetterWhite','#fffaf0',.5,emit='#fffaf0',strength=2),c+Vector((0,-.015,sign*.04)),rot=(math.pi/2,0,0));d.parent(letter,inner);letters.append(letter)
        lines=[]
        for index,ang in enumerate([data['star'],-data['island'],-data['dipLondon']]):
            # Local horizontal at London is rotated by latitude. The numerical angle is relative to it.
            tangent=Vector((-math.sin(lat),0,math.cos(lat)));normal=Vector((math.cos(lat),0,math.sin(lat)))
            vv=tangent*math.cos(math.radians(ang))+normal*math.sin(math.radians(ang))
            pts=[pin+vv*(.10 if index==0 else .16)*j/20 for j in range(21)]
            if index==2:
                theta=math.pi/2-lat;L=.12/math.sin(theta)**2
                pts=[c+Vector((L*math.sin(theta*(1-.8*j/60))**3,-.007,L*math.sin(theta*(1-.8*j/60))**2*math.cos(theta*(1-.8*j/60)))) for j in range(61)]
            co=['#ffd23f','#8e613d','#3b3b3b'][index];oo=[]
            for j in range(0,len(pts)-1,2):oo.append(curve('b1_prediction',pts[j:j+2],d.mat('b1prediction'+str(index),co,.5),.0013))
            lines.append(oo)
        return {'center':c,'globe':globe,'disc':disc,'needle':needle,'pin':pin,'horizon':horizon,'inner':inner,'halves':halves,'letters':letters,'lines':lines,'surfaceMaterial':surface,'transparentMaterial':transparent}
    group('globe',globe)
    def mysterybox():
        c=Vector((.32,.108,.16));root=d.empty('b1_mysterybox',c)
        for o in [d.box('b1_mysterybody',(.02,.018,.014),c,wood,.002),d.box('b1_mysterylid',(.021,.019,.003),c+Vector((0,0,.009)),wood,.001),d.box('b1_mysterylatch',(.004,.001,.004),c+Vector((0,-.010,.004)),gold,.0005)]:d.parent(o,root)
        points=[c+Vector((-.004,-.013,.036)),c+Vector((.007,-.013,.036)),c+Vector((.001,-.013,.024)),c+Vector((.009,-.013,.024)),c+Vector((-.008,-.013,.005)),c+Vector((-.002,-.013,.021)),c+Vector((-.010,-.013,.021))]
        me=bpy.data.meshes.new('b1_lightning');me.from_pydata(points,[],[tuple(range(7))]);bolt=bpy.data.objects.new('b1_lightning',me);d.link(bolt);d.put(bolt,d.mat('b1lightningYellow','#ffd23f',.4,emit='#ffd23f',strength=2.5));d.parent(bolt,root)
        return {'root':root,'lightning':bolt}
    group('mysterybox',mysterybox)
    def book():
        part=d.bellaso_book('b1_book',(-.20,.30,0))
        for ob in bpy.context.scene.objects:
            if ob.name.startswith('b1_book_row') and ob.type=='FONT':ob.data.body=''
        cc=Vector((-.20,.30,.0323))
        d.torus('b1_book_terrella_figure',.039,.0005,cc,ink)
        curve('b1_book_terrella_axis',[cc+Vector((0,-.046,0)),cc+Vector((0,.046,0))],ink,.0005)
        for sign in [-1,1]:
            pts=[cc+Vector((sign*.043*math.sin(math.pi*j/36),.045*math.cos(math.pi*j/36),.0001)) for j in range(37)]
            curve('b1_book_terrella_field',pts,ink,.0004)
        return part
    group('book',book)
    def ship():
        c=Vector((.13,.30,0));h=d.sphere('b1_ship',.11,c+Vector((0,0,.026)),wood,scale=(1,.3,.28));d.cyl('b1_mast',.002,.13,c+Vector((0,0,.09)),gold)
        sail=d.plane('b1_sail',.08,.07,c+Vector((0,0,.12)),white);sail.rotation_euler.x=math.pi/2
        return c+Vector((0,0,.06))
    group('ship',ship)
    for o in set(bpy.data.objects)-before:d.show(o,False)
    return P,G
