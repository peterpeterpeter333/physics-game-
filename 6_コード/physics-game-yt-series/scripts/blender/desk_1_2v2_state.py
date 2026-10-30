"""Absolute-time choreography, 2nd edition (copy of desk_1_2v1_state.py). Executed in desk_1_2v2's live scene namespace.
v2 changes (marked "v2"): closer cameras for the scenes listed in DATA['v2cams'] (rows 4-8, 18-27, 30-31, 41-45, 47, 51-52);
one word per tile line in the answer check; the capital marker inside the cipher row; 9-tile keyword rows;
longer finger contact in rows 12-13 and 35-37. Unlisted scenes keep the 1st-edition camera and state."""
import bisect,types
FPS=30
# Small physical teaching marks, kept independent from the shared model library.
if 'teaching' not in GROUPS:
    objects=[];PARTS['marks']={}
    red=d.mat('1_2v1_cross_red','#c8483a',.5)
    yellow=d.mat('1_2v1_separator_gold','#ffd23f',.5)
    for i in [1,4,7,10]:
        p=Vector(((i-5.5)*.055,-.32,.035));pair=[]
        for angle in [-.7,.7]:pair.append(d.box('1_2v1_cross%d'%i,(.022,.003,.003),p,red,bevel=.001,rot=(0,0,angle)))
        PARTS['marks']['cross'+str(i)]=pair;objects.extend(pair)
    for i in [3,6,9]:
        o=d.box('1_2v1_key_divider%d'%i,(.002,.065,.03),((i-6)*.055,-.29,.025),yellow,bevel=.001)
        PARTS['marks']['divide'+str(i)]=[o];objects.append(o)
    for i,col in enumerate(d.DOLL_COL[:5]):
        p=Vector((.13+(i-2)*.025,-.04,.14+(.03 if i%2 else 0)))
        o=d.sphere('1_2v1_name_bubble%d'%i,.014,p,d.mat('1_2v1_bubblecol%d'%i,col,.5),scale=(1,1,.16))
        PARTS['marks']['bubble'+str(i)]=[o];objects.append(o)
    seam=d.box('1_2v1_za_seam',(.003,.020,.002),(0,.026,.015),yellow,bevel=.0006,rot=(0,0,-STEP/2 if 'STEP' in globals() else -math.pi/26))
    PARTS['marks']['seam']=[seam];objects.append(seam)
    GROUPS['teaching']=objects;MANAGED.extend(objects)
if 'seam' not in PARTS['marks']:
    seam=d.box('1_2v1_za_seam',(.003,.020,.002),(0,.026,.015),d.mat('1_2v1_seam_gold','#ffd23f',.5),bevel=.0006,rot=(0,0,-math.pi/26))
    PARTS['marks']['seam']=[seam];GROUPS['teaching'].append(seam);MANAGED.append(seam)
if 'tilepaper' not in GROUPS:
    o=d.box('1_2v1_tilepaper',(.19,.155,.004),(0,-.10,.002),d.mat('1_2v1_tilepaper_cream','#efe2c4',.76),bevel=.005)
    GROUPS['tilepaper']=[o];MANAGED.append(o)
STARTS=[c['start'] for c in CUES]
PREVIOUS_BASE=globals().get('BASE',{})
BASE={o:PREVIOUS_BASE.get(o,(o.location.copy(),o.rotation_euler.copy(),o.scale.copy())) for o in MANAGED}
STEP=2*math.pi/26
HAND_YAW_A=globals().get('HAND_YAW_A',120)
HAND_YAW_M=globals().get('HAND_YAW_M',110)   # v2: Mio's hand reaches from the upper right, clear of the tiles and the disk letters
V2CAMS=set(DATA.get('v2cams',[]))
CAP_SWITCH=DATA['capSwitch']   # v2: alb:cap caption chunk「受け取る側は、」
ANS_DISK=(0,.10)    # v2: Caesar disk behind the three answer lines
RECV=Vector((.31,.0,0))
def cue_at(t):return CUES[max(0,bisect.bisect_right(STARTS,t)-1)]
def u(t,a,dur=.3):return d.sm((t-a)/max(1e-8,dur))
def touch(name,p,t,a,b,yaw=0):
    if not a-.2<=t<=b+.4:return
    p=Vector(p)
    lift=.05*(1-u(t,a-.2,.2))+.05*u(t,b+.1,.3)
    d.set_hand(name,p+Vector((0,0,lift)),yaw=yaw,pitch=-20)
def emit(m,v):d.set_emit(m,v,'#ffd23f')
def cam_keys():return [(c['start'],c['move'],c['pose']) for c in CUES]
def pose12(t,cues,data):
    """Camera pose at t (pure; no scene access). With the 1st-edition cues/data (no 'v2cams') it is the
    1st-edition pose, which lets the retouch prove that untouched frames keep the same camera."""
    starts=[q['start'] for q in cues];c=cues[max(0,bisect.bisect_right(starts,t)-1)];i=cues.index(c);p=list(c['pose'])
    v2cams=set(data.get('v2cams',[]));CUES_=cues
    # A sixteen-letter line cannot fit in the original portrait trial framing.
    # Preserve all letters; widen this shot rather than cropping the question.
    def adjusted(q):
        v=list(q['pose'])
        if q['camera'] in v2cams:return v   # v2: explicit closer pose, no 1st-edition widening
        if q['group']=='answer':v[3]=2.05
        if q['group'] in ['tower','compare','three']:v[3]=1.90
        if q['group'] in ['skip','key']:v[3]=1.55
        if q['group']=='books':v[3]=1.35
        if q['group']=='stack':v[3]=.46
        if q['group']=='ringkey':v[1]=-.26
        if q['group']=='receiver':v[3]=1.55
        if q['group']=='letter':v[2]=-.05;v[3]=.62
        return v
    p=adjusted(c)
    if c['move'] and i:
        old=adjusted(cues[i-1])
        if cues[i-1]['key'] in ('tag:mix','tag:mio') and 'namesT' in data:old=list(data['cameras']['namesX'])   # v2
        v=u(t,c['start'],c['move']);p=[a+(b-a)*v for a,b in zip(old,p)]
    if c['key']=='letter:open':p[3]+=.14*(1-u(t,0,1.5))
    if c['key']=='alb:cap' and 'capSwitch' in data:
        # v2: two compositions in row 18. Sender disk, cipher row and capital marker; then the receiver's hand and disk.
        a=list(data['cameras']['capMark']);b=list(data['cameras']['capRecv']);v=u(t,data['capSwitch'],.8)
        if t>=data['capSwitch']:p=[x+(y-x)*v for x,y in zip(a,b)]
        elif c['move']:p=[x+(y-x)*u(t,c['start'],c['move']) for x,y in zip(adjusted(cues[i-1]),a)]
        else:p=a
    if c['key'] in ('tag:mix','tag:mio') and 'namesT' in data:
        # v2: from「ある一つの名札」the camera moves in on the tag X, where the voice bubbles gather (寄り).
        p=[x+(y-x)*u(t,data['namesT'],.8) for x,y in zip(p,data['cameras']['namesX'])]
    if c['key']=='chk:judge' and 'judgeT' in data:
        # v2: just before「判定」the camera moves right so the score board (moved beside the rows) is in view.
        p=[x+(y-x)*u(t,data['judgeT'],.8) for x,y in zip(p,data['cameras']['judge2'])]
    if c['key']=='alb:place':
        p=list(data['cameras']['albWide']);v=u(t,c['start']+.8,.8)
        p=[a+(b-a)*v for a,b in zip(p,c['pose'])]
    return p,c
def set_camera12(t):
    p,c=pose12(t,CUES,DATA)
    target=Vector(p[:3]);distance,az,el,lens=p[3:]
    az=math.radians(az);el=math.radians(el)
    pos=target+distance*Vector((math.sin(az)*math.cos(el),-math.cos(az)*math.cos(el),math.sin(el)))
    d.CAM.location=pos;d.CAM.rotation_euler=(target-pos).to_track_quat('-Z','Y').to_euler()
    d.CAM_D.lens=lens*.78;d.CAM_D.dof.focus_distance=distance
    if c['group']=='letter':d.CAM_D.dof.focus_distance=(pos-Vector((target.x,target.y,0))).length
    d.CAM_D.dof.aperture_fstop=2+2.2*d.clamp((distance-.3)/1.2)
    return p
def reset12():
    hide_all()
    for o,(p,r,s) in BASE.items():o.location=p;o.rotation_euler=r;o.scale=s
    for name in ['kai','mio']:d.set_hand(name,(0,0,0),vis=False)
    for _,m in list(d.OUTL.values())+list(d.INL.values()):emit(m,0)
    for name in ['alberti','receiver']:
        for _,m in PARTS[name]['outer_letters']+PARTS[name]['inner_letters']:emit(m,0)
    for _,_,m in PARTS['numbers']['cards']:emit(m,0)
    d.board_h.rotation_euler=(0,0,0);d.dg['make'].data.body='0';d.dg['brk'].data.body='2'
    d.dg['make'].scale=(1,1,1);d.dg['brk'].scale=(1,1,1)
    d.inner.rotation_euler=(0,0,0)
def letter_state12(t,c):
    visible('letter','caesar','score');d.letter_state(3)
    d.let_root.location=(0,-.1,.045*(1-u(t,0,.8)) if c['row']==1 else 0)
    d.disk_root.location=(-.28,.10,0);bpy.data.objects['pin'].location=(-.28,.10,.02)
    if c['row']==1:touch('kai',(0,-.16,.025),t,0,.8)
def answer_state(t,c):
    visible('answer3','caesar')
    d.disk_root.location=(ANS_DISK[0],ANS_DISK[1],0);bpy.data.objects['pin'].location=(ANS_DISK[0],ANS_DISK[1],.02)
    times=[26.69,27.78]+[29.30+i*.25 for i in range(7)]+[31.55]
    steps=sum(u(t,a,.12) for a in times)
    d.inner.rotation_euler.z=STEP*steps
    for order,(r,p,idx) in enumerate(PARTS['answer3']):
        # v2: MYEXD / DRO / VODDOBC on three lines; flip order is left to right, line by line.
        d.place_tile(r,p,flip=d.clamp((t-37.09-order*.08)/.26) if c['row']==6 else 0)
        if c['row']==4:d.show_tree(r,t>=(16.14 if idx<5 else 17.81 if idx<8 else 18.79))
    if c['row']<=5:
        angle=d.ang_of(0)+STEP*steps;p=Vector((ANS_DISK[0]+.08*math.cos(angle),ANS_DISK[1]+.08*math.sin(angle),.031))
        touch('mio',p,t,23.76,32.0,yaw=HAND_YAW_M)
        n=int(round(steps))%26;emit(d.OUTL[d.ABC[n]][1],1.6 if any(0<=t-a<.3 for a in times) else 0)
def alberti_state(t,c):
    visible('alberti');part=PARTS['alberti'];steps=u(t,86.08,.5)
    if c['row']==10:part['root'].location.z=.12*(1-u(t,c['start'],.8))+.006*math.sin(math.pi*u(t,c['start']+.8,.25))
    if 16<=c['row']<=17:
        visible('paperstack');steps=1+sum(u(t,104.01+i*.12,.10) for i in range(26))
        for i,(body,top,p) in enumerate(PARTS['paperstack']['papers']):
            a=104.01+i*.12;d.show(body,t>=a);d.show(top,t>=a)
            for obj in [body,top]:obj.location.z+=.025*(1-u(t,a,.10))
    d.alberti_turn(part,steps,0 if c['row']>=12 else None,marker_index=0)
    if 12<=c['row']<=15:
        emit(part['outer_letters'][0][1],2.5 if t>=78.27 else 0)
        for j,(_,m) in enumerate(part['inner_letters']):emit(m,2.5 if (j==0 and steps<.01 and t>=79.58) or (j==25 and steps>=.999 and t>=93.99) else 0)
    if c['row']==11:
        for name,a in [('outer_letters',69.64),('inner_letters',71.85)]:
            for j,(_,m) in enumerate(part[name]):emit(m,2.5*max(0,1-(t-a-j*.035)/.25) if a+j*.035<=t else 0)
    if c['row'] in [12,13,14]:
        # v2: the finger stays on the outer A while A -> g is said (78.27-82.94), then rests on the inner
        # ring from「内の円板を」(85.08), pushes it one step (86.08-86.58) and leaves after「回します」.
        # It reaches A from the right side, so the arm does not cover the inner g under A.
        a=d.ang_of(0)-STEP*steps;p=Vector((.096*math.cos(a),-.1+.096*math.sin(a),.031))
        if t<84:touch('kai',(.004,.034,.02),t,78.27,82.94,yaw=HAND_YAW_A)
        else:touch('kai',p,t,85.08,87.40,yaw=HAND_YAW_A)
    if c['row']==18:
        # v2: the capital marker sits inside the cipher row (slot 5 of 9); the receiver disk is nearer.
        visible('receiver2','cipher8','marker');recv=PARTS['receiver2'];d.alberti_turn(part,u(t,121.8,.5),0)
        d.alberti_turn(recv,u(t,122.45,.5),0)
        mk=PARTS['marker']['root'];mk.location.x=0;mk.location.y=-.31
        emit(PARTS['marker']['material'],2*u(t,117.16,.12)*(1-u(t,117.44,.12))+1.2*u(t,120.13,.15)*(1-u(t,120.9,.2)))
        a=d.ang_of(0)-STEP*u(t,122.45,.5)
        p=Vector((RECV.x+.0768*math.cos(a),RECV.y+.0768*math.sin(a),.026))
        touch('mio',p,t,121.36,123.30,yaw=HAND_YAW_M)
def tower_state(t,c):
    visible('towers');rows=PARTS['towers']['rows'];counts=DATA['frequencies']
    partial=[0]*26
    if t>=171.34:
        frac=d.clamp((t-171.34)/(172.61-171.34));n=round(frac*541)
        for ch in DATA['sequences']['alberti'][:n]:partial[d.ABC.index(ch)]+=1
    for name,blocks in rows.items():
        shown=name=='fixed' or (name=='alberti' and c['row']>=24) or (name=='key' and c['row']>=41)
        target=counts[name]
        if name=='alberti' and c['row']<25:target=partial
        if name=='key':
            p=u(t,300.24,1.2);v=u(t,320.89,.9)
            target=[round(((1-v)*a+v*b)*p) for a,b in zip(counts['key'],counts['keyword'])]
        maxn=max(target);idx=target.index(maxn)
        for j,(o,tag,p,m) in enumerate(blocks):
            vis=shown and target[j]>0;d.show(o,vis);d.show_tree(tag,shown)
            o.modifiers['arr'].count=max(1,target[j]);emit(m,1.8 if j==idx and ((name=='fixed' and t>=50.18) or (name=='alberti' and t>=175.25) or (name=='key' and t>=304.82)) else 0)
    # Bases must follow row visibility, rather than remaining as unexplained empty rows.
    for name in rows:
        d.show(bpy.data.objects['1_2v1_towerbase_'+name],name=='fixed' or name=='alberti' and c['row']>=22 or name=='key' and c['row']>=41)
    if c['row']>=41:
        visible('longkey');p=PARTS['longkey']
        grow=u(t,317.23,.5)
        # Keep the left edge and K/E/Y in place; append W/O/R/D on the right.
        p['rack'].scale.x=(.190+.220*grow)/.410;p['rack'].location.x=-.110+.110*grow
        for i,r in enumerate(p['tiles']):
            a=317.23+max(0,i-3)*.12
            lift=.03*(1-u(t,a,.25)) if i>=3 else 0
            if i<3:
                a=313.61+i*.15;lift=.025*math.sin(math.pi*u(t,a,.35))
            d.place_tile(r,p['positions'][i],vis=i<3 or t>=a,lift=lift)
        if c['row']==43 and 313.41<=t<=315.21:
            # Point across K, E, Y as the narration counts the three tables.
            # A hand makes the correspondence clearer than barely lifting tiny tiles.
            step=d.clamp((t-313.61)/.45)*2
            i=min(1,int(step));v=step-i
            pos=Vector(p['positions'][i]).lerp(Vector(p['positions'][i+1]),v)
            touch('kai',pos+Vector((0,0,.025)),t,313.61,314.81,yaw=-30)
    if c['row']==42:
        idx=counts['alberti'].index(max(counts['alberti']))
        p=rows['alberti'][idx][2]+Vector((0,0,.0034*counts['alberti'][idx]))
        touch('mio',p,t,308.27,308.70,yaw=-35)
    if c['row']==26:
        visible('score');d.board_h.location=(.66,.24,0)   # v2: beside the rows, not in front of the back row
    if c['row']==26 and t>=187.97:
        visible('score');d.dg['make'].data.body='1';pop=1+.25*math.sin(math.pi*d.clamp((t-187.97)/.3));d.dg['make'].scale=(pop,)*3
    if c['key'] in ['chk:alb','chk:count']:
        # While distinguishing the historical disk from the comparison experiment,
        # point first to the existing distribution and then the row to be counted.
        for a,y in [(161.12,-.28+ext.TOWER_DY),(164.62,.08+ext.TOWER_DY),(167.79,.08+ext.TOWER_DY)]:
            touch('kai',(.18,y,.035),t,a,a+.35,yaw=-35)
def names_state(t,c):
    visible('nameclock','dolls');part=PARTS['nameclock'];v=u(t,127.33,.5)+u(t,129.8,.5)
    d.name_clock_set(part,v,False)
    for i,tag in enumerate(d.DOLL_TAGS):
        pair=i^1;f=u(t,127.33,.5);g=u(t,129.8,.5);amount=f*(1-g)
        src=part['positions'][i];dst=part['positions'][pair];p=src.lerp(dst,amount);p.y=part['center'].y-.047
        p.z=.021+.03*math.sin(math.pi*amount);d.place_tile(tag,p,flip=1)
    if c['row']>=20:
        # v2: the five coloured voice bubbles start over five dolls from「何人もの声」(134.74, 0.2 s apart)
        # and gather above the one name tag X (slot 4), so "one tag, many voices" is visible.
        dst0=part['positions'][4]
        for i in range(5):
            a=134.74+i*.2;g=u(t,a+.15,.55)
            src=Vector((part['positions'][i].x,part['center'].y-.02,.13))
            dst=Vector((dst0.x+.022*math.cos(2.4*i),part['center'].y-.02+.012*math.sin(2.4*i),.095+.018*i))
            for o in PARTS['marks']['bubble'+str(i)]:
                d.show(o,t>=a);o.location=src.lerp(dst,g)+Vector((0,0,.025*(1-u(t,a,.2))+.03*math.sin(math.pi*g)))
                o.scale=(1.7,1.7,.35)
def number_state(t,c):
    visible('caesar')
    if c['group'] in ['numbers','ringkey']:
        visible('numbers')
        for i,(r,p,m) in enumerate(PARTS['numbers']['cards']):
            d.show_tree(r,t>=232.47+i*.05);r.location.z+=.02*(1-u(t,232.47+i*.05,.2))
            emit(m,2 if i in [10,4,24] and t>={10:241.97,4:242.83,24:243.69}[i] else 0)
    if c['group']=='ringkey':
        visible('keyword','shifts');p=PARTS['keyword']
        p['rack'].scale.x=.52
        for i,r in enumerate(p['tiles']):
            pos=p['positions'][i]+Vector((.165,0,0))
            d.place_tile(r,pos,vis=i<6 and t>=246.60+i*.12,lift=.03*(1-u(t,246.60+i*.12,.24)))
        for i,r in enumerate(PARTS['shifts']['cards']):d.show_tree(r,t>=[249.36,250.86,252.38,255.28,255.40,255.52][i])
def counting(t,c):
    if c['row']==35:start,n,ts=2,10,[260.50+i*.12 for i in range(10)]
    elif c['row']==36:start,n,ts=0,4,[265.13+i*.12 for i in range(4)]
    elif c['row']==37:start,n,ts=19,24,[269.22+i*.12 for i in range(6)]+[272.07]+[272.10+i*.12 for i in range(17)]
    else:start,n,ts=0,40,[337.56+i*.06 for i in range(40)]
    k=sum(u(t,a,.08 if c['row']!=46 else .05) for a in ts);ang=d.ang_of(start+k)
    p=(.116*math.cos(ang),-.1+.116*math.sin(ang),.026)
    first={35:260.02,36:264.02,37:267.87,46:337.56}[c['row']]
    # v2: in rows 35-37 the finger is on the start letter from「Cから」「Aから」「Tから」and stays on the
    # result letter until the cue's pause ends; row 46 is unchanged.
    hold={35:(first,263.35),36:(first,267.20),37:(first,275.75),46:(ts[0]-.25,ts[-1]+.25)}[c['row']]
    touch('kai',p,t,hold[0],hold[1],yaw=15)
    idx=(start+round(k))%26;emit(d.OUTL[d.ABC[idx]][1],2.5 if t>=first else 0)
    for i,a in enumerate(ts):
        if 0<=t-a<.15:emit(d.OUTL[d.ABC[(start+i+1)%26]][1],2.5)
    if c['row']==37:
        for o in PARTS['marks'].get('seam',[]):
            a=d.ang_of(-.5);o.location=(.126*math.cos(a),-.1+.126*math.sin(a),.015)
            o.rotation_euler.z=math.pi/26;d.show(o,272.07<=t<272.47)
def keyword_state(t,c):
    # v2: nine tiles (KEYKEYKEY) instead of twelve, so the row can fill 7/10 of the portrait width.
    visible('keyword9');p=PARTS['keyword9'];rack=p['rack']
    if c['row']==47:
        g=u(t,343.31,.6);L=.055*9+.025
        rack.scale.x=(L+.055*g)/L;rack.location.x+=.0275*g
    for i,r in enumerate(p['tiles']):
        pos=p['positions'][i].copy()
        if c['row']==47 and i>0:pos.x+=.055*u(t,343.31,.6)
        d.place_tile(r,pos)
    if c['row']==51:
        for i in [3,6]:
            for o in PARTS['marks']['divide'+str(i)]:
                d.show(o,t>=366.15);o.location.x=(i-4.5)*.055;o.location.y=-.10;o.location.z-=.03*(1-u(t,366.15,.25))
    if c['row']==47:
        visible('corrupt9')
        for i,(r,pp,idx) in enumerate(PARTS['corrupt9']):
            m=bpy.data.objects[r.name+'_t'].data.materials[0]
            m.diffuse_color=d.rgb('#c8483a' if i>0 and t>=343.91+i*.05 else '#f08a2c')
            bs=m.node_tree.nodes.get('Principled BSDF')
            if bs:bs.inputs['Base Color'].default_value=m.diffuse_color
            d.place_tile(r,pp)
            if i in [1,4,7]:
                for o in PARTS['marks']['cross'+str({1:1,4:4,7:7}[i])]:
                    o.location.x=(i-4)*.055;o.location.y=-.25;d.show(o,t>=343.91+i*.05)
def hands(t):
    # Model-specific functions call touch with exact world-space finger targets.
    pass
def apply(t):
    reset12();c=cue_at(t);g=c['group'];set_camera12(t)
    d.dg['make'].data.body='1' if t>=187.97 else '0'
    if g=='letter':letter_state12(t,c)
    elif g=='score':visible('score');d.dg['make'].data.body='1' if t>=187.97 else '0'
    elif g=='answer':answer_state(t,c)
    elif g in ['tower','compare','three']:tower_state(t,c)
    elif g in ['alberti','paperstack','receiver']:alberti_state(t,c)
    elif g=='names':names_state(t,c)
    elif g=='books':
        visible('bellaso');d.bellaso_open(PARTS['bellaso'],u(t,203.59,.9))
        if c['row']==29:
            visible('vigenere');PARTS['vigenere']['root'].location.z+=.05*(1-u(t,209.23,.6))
            d.bellaso_open(PARTS['vigenere'],0)
    elif g=='plan':
        visible('schedule');v=.02*(1-u(t,213.37,.6))
        for o in GROUPS['schedule']:
            if not o.parent:o.location.y+=v
    elif g in ['numbers','ringkey','count']:
        number_state(t,c)
        if g=='count':counting(t,c)
    elif g=='tiles':
        name='cat' if c['row']==38 else 'aaa';visible(name,'tilepaper')
        for i,(r,p,idx) in enumerate(PARTS[name]):
            a=277.30+i*.12 if name=='cat' else [285.24,286.41,287.85][i]
            d.place_tile(r,p+Vector((0,0,.004)),flip=d.clamp((t-a)/.28))
    elif g in ['skip','key']:keyword_state(t,c)
    elif g=='stack':
        visible('stack')
        for i,(r,p) in enumerate(PARTS['stack']['papers']):
            a=353.64+max(0,i-2)*.3;d.show_tree(r,i<3 or t>=a);r.location.z+=.05*(1-u(t,a,.3)) if i>=3 else 0
    elif g=='challenge':
        visible('keyword')
        PARTS['keyword']['rack'].scale.x=.27
        for i,r in enumerate(PARTS['keyword']['tiles']):
            pos=Vector(((i-1)*.055,-.29,.01));d.place_tile(r,pos,vis=i<3)
        visible('challenge')
        # v2: GIJV / HMXI on two lines behind the KEY rack, so the tiles can be large.
        for r,p,idx in PARTS['challenge']:
            line=0 if idx<4 else 1;k=idx if idx<4 else idx-5
            q=Vector(((k-1.5)*.055,-.07-.08*line,p.z))
            d.place_tile(r,q,vis=t>=377.15+idx*.12,lift=.03*(1-u(t,377.15+idx*.12,.25)))
    else:raise ValueError(g)
    bpy.context.view_layer.update()
    return anchors(t)
def anchors(t):
    c=cue_at(t);out={}
    if c['group']=='plan':out.update(PARTS['schedule']['anchors'])
    if c['group']=='paperstack':out['paperstack.top']=PARTS['paperstack']['center']
    if c['group']=='answer':out['answer.reading']=Vector((0,-.17,.025))
    if c['group']=='books':
        for name in ['bellaso','vigenere']:out[name+'.page']=PARTS[name]['center']+Vector((0,0,.04))
    if c['group'] in ['numbers','ringkey']:
        for i,(r,p,m) in enumerate(PARTS['numbers']['cards']):
            if t>=232.47+i*.05:out['number.'+str(i)]=p+Vector((0,0,.015))
    if c['group']=='three':
        for name,y in PARTS['towers']['ys'].items():out['tower.'+name+'.label']=Vector((0,y,.015))
        out['longkey.end']=Vector((.235,-.37+ext.TOWER_DY,.04))
    return out

# Every interval in which a 3D object actually changes. Outside these intervals
# the reference writer can clone the identical still, while overlay remains 30fps.
SPANS=[(c['start'],c['start']+c['move']) for c in CUES if c['move']]
SPANS += [(0,1.5),(23.56,32.4),(37.09,38.7),(60.73,62.33),(69.64,70.8),(71.85,73.1),
 (78.07,79.65),(85.88,86.98),(104.01,107.25),(117.16,117.60),(121.8,123.35),
 (127.33,127.83),(129.8,130.3),(171.34,172.61),(187.97,188.27),(203.59,204.49),
 (209.23,209.83),(213.37,213.97),(232.47,233.97),(246.60,247.5),(260.25,262.35),
 (264.88,266.14),(268.97,274.79),(277.30,277.9),(285.24,285.52),(286.41,286.69),
 (287.85,288.13),(300.24,301.44),(317.23,318.1),(320.89,321.79),(337.31,340.55),
 (343.31,344.6),(353.64,354.84),(377.15,378.4)]
SPANS += [(a-.2,a+.75) for a in [161.12,164.62,167.79]]
SPANS += [(308.07,309.15),(313.41,315.21)]
# v2: new movements (camera switch in row 18, camera move in row 26, marker glow, longer finger contacts).
SPANS += [(DATA['namesT'],DATA['namesT']+.85),(134.70,136.40),(CAP_SWITCH,CAP_SWITCH+.85),(DATA['judgeT'],DATA['judgeT']+.85),(120.0,121.2),
 (78.0,78.4),(82.95,83.45),(84.85,85.15),(85.9,86.7),(87.4,87.85),(121.1,121.45),(123.3,123.75),
 (259.75,260.1),(263.3,263.8),(263.75,264.1),(267.15,267.65),(267.6,267.95),(275.7,276.2)]
# Also preserve the single-frame changes (glows, subtitle-driven props, cue cuts).
EVENTS=sorted(set([c['start'] for c in CUES]+[w['time'] for c in CUES for w in c['wordEvents']]+[b for a,b in SPANS]+[255.40,255.52]))
def plan12(j):
    t=j/FPS
    if any(a-.034<=t<=b+.034 for a,b in SPANS):return ('render',None)
    c=cue_at(t);last=max([c['start']]+[x for x in EVENTS if x<=t])
    k=min(j,int(math.ceil(last*FPS+1e-7)))
    # First frame of each hold must be independently rendered, not an absent source.
    return ('render',None) if k==j else ('dup',k)
def main():
    """Use the shared resume/--times/--from/--to renderer with an isolated scope.
    Its original v6 copy/map and end:b checks are 1-1-only. Supply this episode's
    plan/apply/anchors, plus empty read-only-copy seeds, without editing desk_lib.
    """
    import shutil
    seed=os.path.join(A.cache,'blender','seed-1_2v1');os.makedirs(seed+'/blender/desk',exist_ok=True)
    json.dump({'anchors':{}},open(seed+'/blender/desk/anchors.json','w'))
    json.dump({'moving_spans':[]},open(seed+'/blender/camera-motion.json','w'))
    # Discover stable anchor names by evaluating every cue; hidden anchors are zeros.
    names=set()
    for c in CUES:names.update(apply(min(c['end']-.01,c['start']+2)))
    options={'every':A.every,'scale':A.scale,'times':[float(x) for x in A.times.split(',')] if A.times else None,
             'out':A.out,'from':A.start,'to':A.stop,'force':A.force}
    # Shared main first projects each distinct frame, then renders the selected
    # frames. Anchor positions here are analytical world coordinates, so that
    # projection pass needs only the camera, not thousands of model resets.
    pp=[plan12(j) for j in range(math.ceil(DATA['duration']*FPS))]
    projection_count=len({j if p[0]=='render' else p[1] for j,p in enumerate(pp)})
    calls=[0]
    def projected_apply(t):
        if not options['times'] and calls[0]<projection_count:
            calls[0]+=1;set_camera12(t);bpy.context.view_layer.update();return anchors(t)
        return apply(t)
    if options['times']:
        out=A.out or os.path.join(A.cache,'blender','preview');os.makedirs(out,exist_ok=True)
        arrays={name:[[0,0,0] for _ in range(math.ceil(DATA['duration']*FPS))] for name in names}
        for t in options['times']:
            pts=apply(t);j=round(t*FPS)
            for name in names:arrays[name][j]=d.project(pts[name]) if name in pts else [0,0,0]
        json.dump({'anchors':arrays,'fps':FPS},open(os.path.join(out,'anchors.json'),'w'))
    scope={**d.__dict__,'__file__':__file__,'A':options,'CACHE':seed,'CACHE6':A.cache,
       'NF6':math.ceil(DATA['duration']*FPS),'FPS':FPS,'CLIP6':{'duration':DATA['duration']},
       'CUE6':{c['key']:{'s':c['start'],'e':c['end']} for c in CUES},'DATA':DATA,
       'PT6':{'stateSHA':hashlib.sha256(open(os.path.join(os.path.dirname(__file__),'desk_1_2v2_state.py'),'rb').read()).hexdigest()},
       'plan6':(lambda j:('render',None)) if options['times'] else plan12,'apply6':projected_apply,'anchors':lambda t:{},'anchors5':lambda t:{},
       'V6_ANC':sorted(names),'S6':lambda key:1e6,'T6':lambda *a,**k:0}
    try:types.FunctionType(d.main.__code__,scope)()
    except SystemExit as e:
        if e.code not in [None,0]:raise
    poses=[tuple(round(x,10) for x in set_camera12(j/FPS)) for j in range(scope['NF6'])]
    mv=[False]+[poses[j]!=poses[j-1] for j in range(1,len(poses))]
    spans=[];start=None
    for j,flag in enumerate(mv+[False]):
        if flag and start is None:start=j/FPS
        if not flag and start is not None:spans.append([start,j/FPS]);start=None
    motion={'frames':scope['NF6'],'moving_frames':sum(mv),'moving_ratio':sum(mv)/scope['NF6'],
            'moving_spans':spans,'top_ratio':sum(p[5]>=65 for p in poses)/len(poses),'episode':'1-2v2',
            'method':'actual 30fps camera poses; no motion inferred from the shot list'}
    json.dump(motion,open(os.path.join(A.cache,'blender','camera-motion.json'),'w'),indent=1)
