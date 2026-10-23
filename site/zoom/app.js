import * as THREE from './vendor/three.module.js';
import { catalog } from './content.js';

const $ = id => document.getElementById(id);
const root = $('experience');
const state = { id:'speaker', step:0, stack:[{id:'phone',step:2}], selected:'magnet', hover:null, stage:0, targetStage:0, drag:null, use:null, detail:false };
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const colors = { part:0x79daca, tool:0xe3b57b, iron:0xa8b5bb, copper:0xc97942, magnet:0x526575 };
const scene = new THREE.Scene();
let renderer, camera, W=innerWidth, H=innerHeight, mobile=W<680, webgl=true, time=0, lastTime=0;
const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2(), targetMeshes=[], anchors={}, labelItems=[];
const world = new THREE.Group(); scene.add(world);
const speaker = new THREE.Group(), generic = new THREE.Group(); world.add(speaker,generic);
const groups={}, tools={}, materials=[], dynamicLines=[];
const vec = new THREE.Vector3();

function material(config={}) {
  const m=new THREE.MeshPhysicalMaterial({ color:colors.iron, metalness:.87, roughness:.28, clearcoat:.15, ...config });
  materials.push(m); return m;
}
const ironMat=material({color:0x8d9da5,roughness:.31});
const edgeMat=material({color:0xbac8cb,roughness:.2});
const darkMat=material({color:0x13242c,metalness:.45,roughness:.5});
const copperMat=material({color:0xd5884e,roughness:.22,metalness:.98});
const magnetMat=material({color:0x405565,metalness:.72,roughness:.35});
const glassMat=material({color:0x8cddd3,metalness:.18,roughness:.13,transparent:true,opacity:.45,side:THREE.DoubleSide,clearcoat:1,iridescence:.5});
const surroundMat=material({color:0x629d98,metalness:.22,roughness:.38,transparent:true,opacity:.68,side:THREE.DoubleSide});
const toolMat=material({color:0x857158,metalness:.7,roughness:.34});
const amberMat=material({color:0xe4b574,metalness:.45,roughness:.23,emissive:0x67401a,emissiveIntensity:.2});
const tealMat=material({color:0x83daca,metalness:.3,roughness:.26,emissive:0x154a43,emissiveIntensity:.25});

function roundedPoints(w,d,r,n=10) {
  const pts=[];
  const corners=[[w/2-r,d/2-r,0],[-w/2+r,d/2-r,Math.PI/2],[-w/2+r,-d/2+r,Math.PI],[w/2-r,-d/2+r,Math.PI*1.5]];
  for(const [x,z,a] of corners)for(let i=0;i<=n;i++){const q=a+i/n*Math.PI/2;pts.push(new THREE.Vector2(x+Math.cos(q)*r,z+Math.sin(q)*r));}
  return pts;
}
function shapeFromPoints(pts){const s=new THREE.Shape();s.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)s.lineTo(pts[i].x,pts[i].y);s.closePath();return s;}
function block(w,d,h,r,mat,y=0,parent=speaker){
  const geo=new THREE.ExtrudeGeometry(shapeFromPoints(roundedPoints(w,d,r)),{depth:h,bevelEnabled:true,bevelThickness:.024,bevelSize:.027,bevelSegments:3,steps:1,curveSegments:16});
  geo.rotateX(-Math.PI/2);geo.translate(0,-h/2,0);
  const mesh=new THREE.Mesh(geo,mat);mesh.position.y=y;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
function ring(w,d,h,r,iw,id,ir,mat,y=0,parent=speaker){
  const s=shapeFromPoints(roundedPoints(w,d,r));const hole=shapeFromPoints(roundedPoints(iw,id,ir).reverse());s.holes.push(hole);
  const geo=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:true,bevelThickness:.012,bevelSize:.018,bevelSegments:2,steps:1});geo.rotateX(-Math.PI/2);geo.translate(0,-h/2,0);
  const mesh=new THREE.Mesh(geo,mat);mesh.position.y=y;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
function pathLine(points,color=colors.part,opacity=.7,parent=speaker,width=.008){
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,60,width,6,false),new THREE.MeshBasicMaterial({color,transparent:true,opacity}));parent.add(mesh);return mesh;
}
function winding(w,d,r,y,parent,mat=copperMat,radius=.014){
  const pts=roundedPoints(w,d,r,15).map(p=>new THREE.Vector3(p.x,y,p.y));pts.push(pts[0].clone());
  const line=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,true),120,radius,6,true),mat);line.castShadow=true;parent.add(line);return line;
}
function pick(group,id,w,d,h,y=0){
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({visible:false}));m.position.y=y;m.userData.id=id;group.add(m);let p=group;while(p&&p!==generic)p=p.parent;m.userData.generic=!!p;targetMeshes.push(m);anchors[id]=m;return m;
}
function cylinder(radius,height,mat,parent,y=0){const m=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,height,32),mat);m.position.y=y;m.castShadow=true;parent.add(m);return m;}

function buildSpeaker(){
  groups.frame=new THREE.Group();speaker.add(groups.frame);
  ring(3.98,2.22,.22,.38,3.42,1.68,.27,ironMat,0,groups.frame);
  ring(3.72,1.98,.06,.3,3.48,1.72,.26,edgeMat,.13,groups.frame);
  block(3.67,1.92,.1,.3,darkMat,-.16,groups.frame);
  for(const x of[-1.72,1.72])for(const z of[-.78,.78]){
    const screw=new THREE.Group();screw.position.set(x,.15,z);groups.frame.add(screw);
    cylinder(.105,.017,darkMat,screw);const m=cylinder(.063,.027,edgeMat,screw,.016);pathLine([[-.042,.034,0],[.042,.034,0]],0x263c45,1,screw,.004);
  }
  pick(groups.frame,'speaker-frame',3.99,2.23,.16);
  // Separate return yoke, magnetic body and pole piece expose the air gap.
  groups.yoke=new THREE.Group();speaker.add(groups.yoke);
  ring(3.37,1.62,.56,.3,3.14,1.46,.32,ironMat,0,groups.yoke);
  block(3.38,1.63,.07,.3,ironMat,-.245,groups.yoke);
  groups.magnet=new THREE.Group();speaker.add(groups.magnet);
  block(2.52,.92,.25,.2,magnetMat,0,groups.magnet);
  for(const x of[-1,1]){const strip=block(.28,.75,.26,.08,material({color:0x527a8e,roughness:.26}),.012,groups.magnet);strip.position.x=x;}
  pick(groups.magnet,'magnet',2.55,.94,.29);
  groups.pole=new THREE.Group();speaker.add(groups.pole);
  block(2.61,.97,.16,.22,edgeMat,0,groups.pole);
  const poleScrew=cylinder(.08,.023,darkMat,groups.pole,.09);
  pick(groups.pole,'iron-pole',3.39,1.64,.15);
  groups.coil=new THREE.Group();speaker.add(groups.coil);
  ring(2.89,1.21,.55,.29,2.8,1.12,.245,material({color:0x7c614c,transparent:true,opacity:.55,metalness:.1,roughness:.7}),.02,groups.coil);
  for(let i=0;i<17;i++)winding(2.96,1.28,.32,-.185+i*.025,groups.coil);
  pathLine([[-1.36,-.18,.45],[-1.75,-.12,.65],[-2.03,-.05,.58]],0xe49b60,1,groups.coil,.018);
  pathLine([[1.36,-.18,.45],[1.75,-.12,.65],[2.03,-.05,.58]],0xe49b60,1,groups.coil,.018);
  pick(groups.coil,'voice-coil',3.05,1.37,.52);
  groups.film=new THREE.Group();speaker.add(groups.film);
  block(3.48,1.75,.028,.37,glassMat,.015,groups.film);
  block(2.45,1.03,.07,.35,material({color:0xb7ede7,transparent:true,opacity:.24,roughness:.1,metalness:.1,side:THREE.DoubleSide,clearcoat:1}),.06,groups.film);
  winding(2.48,1.04,.35,.099,groups.film,tealMat,.009);
  pick(groups.film,'diaphragm',3.5,1.77,.15);
  groups.surround=new THREE.Group();speaker.add(groups.surround);
  const rings=9,pts=roundedPoints(3.66,1.93,.43,18),count=pts.length,verts=[],idx=[];
  for(let j=0;j<=rings;j++)for(let i=0;i<count;i++){
    const p=pts[i],scale=1-j/rings*.16;
    verts.push(p.x*scale,.025+Math.sin(j/rings*Math.PI*2)*.065,p.y*scale);
  }
  for(let j=0;j<rings;j++)for(let i=0;i<count;i++){const ni=(i+1)%count,a=j*count+i,b=j*count+ni,c=(j+1)*count+i,d=(j+1)*count+ni;idx.push(a,b,c,b,d,c);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex(idx);g.computeVertexNormals();const corrugation=new THREE.Mesh(g,surroundMat);groups.surround.add(corrugation);
  winding(3.68,1.94,.43,.025,groups.surround,tealMat,.021);pick(groups.surround,'surround',3.73,2.01,.15);
  groups.gap=new THREE.Group();speaker.add(groups.gap);
  winding(2.88,1.22,.3,.1,groups.gap,material({color:0x85ebd7,emissive:0x2ebda1,emissiveIntensity:.7,metalness:.1,roughness:.7,transparent:true,opacity:.5}),.014);
  groups.flux=new THREE.Group();speaker.add(groups.flux);
  for(const x of[-1.41,1.41])for(let z=-.35;z<=.36;z+=.175){pathLine([[x*.7,-.03,z],[x*.9,.37,z],[x,.48,z],[x*1.1,.2,z]],0x79daca,.25,groups.flux,.005);}
  groups.adhesive=new THREE.Group();speaker.add(groups.adhesive);
  winding(2.92,1.23,.3,0,groups.adhesive,material({color:0xd8a760,emissive:0x765013,emissiveIntensity:.3,transparent:true,opacity:.6,metalness:.1,roughness:.5}),.025);
  pick(groups.adhesive,'bonding-film',2.94,1.25,.07);
  groups.leads=new THREE.Group();speaker.add(groups.leads);
  pathLine([[-1.65,.19,.62],[-2.0,.0,.9],[-2.35,.15,1.12],[-2.75,.2,.78]],0xaa7860,.7,groups.leads,.014);
  pathLine([[1.65,.19,.62],[2.0,.0,.9],[2.4,.12,1.11],[2.65,.2,.67]],0x668c97,.7,groups.leads,.014);
  groups.waves=new THREE.Group();speaker.add(groups.waves);
  for(let i=0;i<4;i++){const torus=new THREE.Mesh(new THREE.TorusGeometry(.4+i*.31,.009,5,64,Math.PI*1.12),new THREE.MeshBasicMaterial({color:0x85d8ce,transparent:true,opacity:.18}));torus.rotation.x=-Math.PI/2;torus.rotation.z=-.18;torus.position.set(1.5,.87,0);groups.waves.add(torus);}
  groups.probes=new THREE.Group();speaker.add(groups.probes);
  pathLine([[-2.5,.28,1.18],[-2.1,.25,1.45],[-1.77,.45,1.15],[-1.65,.44,.64]],0xd0a675,.9,groups.probes,.012);
  pathLine([[-2.5,.24,1.0],[-2.15,.2,1.8],[1.6,.25,1.68],[1.72,.44,.64]],0x789daf,.9,groups.probes,.012);
  for(const x of[-1.65,1.72]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.018,.024,.26,10),edgeMat);p.rotation.x=-Math.PI/4;p.position.set(x,.4,.73);groups.probes.add(p);const collar=cylinder(.042,.09,amberMat,groups.probes,.48);collar.position.set(x,.48,.8);}
  groups.signalPath=new THREE.Group();speaker.add(groups.signalPath);
  pathLine([[-1.7,.29,-1.9],[-1.2,.1,-2.0],[.1,.28,-2.1],[.5,.14,-1.7],[1.8,.19,-.8],[1.8,.3,.56]],colors.tool,.55,groups.signalPath,.009);
  groups.clearance=new THREE.Group();speaker.add(groups.clearance);
  for(const x of[-1.43,1.43]){pathLine([[x-.035,.23,.48],[x+.035,.23,.48]],colors.part,.8,groups.clearance,.008);pathLine([[x,.13,.48],[x,.33,.48]],colors.part,.4,groups.clearance,.005);}
}

function displayTexture(type){
  const c=document.createElement('canvas');c.width=256;c.height=144;const ctx=c.getContext('2d');ctx.fillStyle='#071c24';ctx.fillRect(0,0,256,144);ctx.strokeStyle='#163d48';ctx.lineWidth=1;
  for(let x=16;x<256;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,144);ctx.stroke();}for(let y=16;y<144;y+=28){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(256,y);ctx.stroke();}
  ctx.strokeStyle='#83d4bf';ctx.lineWidth=3;ctx.beginPath();if(type==='signal'){for(let x=14;x<242;x++){const y=72+Math.sin(x/23)*30;x===14?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}else{ctx.fillStyle='#9fcabe';ctx.font='38px monospace';ctx.textAlign='center';ctx.fillText('—',128,88);}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function toolDevice(id,type){
  const group=new THREE.Group();tools[id]=group;speaker.add(group);
  if(type==='jig'){
    ring(4.12,2.34,.1,.43,3.86,2.08,.34,toolMat,0,group);
    for(const x of[-1.8,1.8])for(const z of[-.92,.92]){const p=cylinder(.052,.65,amberMat,group,.31);p.position.set(x,.31,z);}
    winding(3.32,1.55,.3,.31,group,amberMat,.006);
    pick(group,id,4.12,2.34,.15);
  }else if(type==='microphone'){
    const head=new THREE.Mesh(new THREE.CapsuleGeometry(.13,.34,5,16),edgeMat);head.position.y=.63;group.add(head);
    cylinder(.06,.38,toolMat,group,.23);block(.62,.37,.09,.14,toolMat,0,group);
    for(let j=0;j<5;j++)for(let i=0;i<10;i++){const a=i/10*Math.PI*2;const m=new THREE.Mesh(new THREE.SphereGeometry(.012,5,5),darkMat);m.position.set(Math.cos(a)*.127,.48+j*.06,Math.sin(a)*.127);group.add(m);}
    pick(group,id,.6,.4,1,.4);
  }else if(type==='power'){
    block(.92,.65,.24,.1,toolMat,.08,group);block(.65,.45,.04,.06,darkMat,.23,group);
    const rotor=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.4,24),edgeMat);rotor.rotation.z=Math.PI/2;rotor.position.set(0,.4,0);group.add(rotor);
    pathLine([[.22,.4,0],[.47,.4,0],[.47,.6,0],[.63,.6,0]],colors.tool,1,group,.026);group.userData.rotor=rotor;pick(group,id,1.1,.7,.7,.25);
  }else{
    block(.95,.62,.18,.09,toolMat,0,group);
    if(type==='amp'){for(let i=0;i<8;i++){const f=block(.82,.022,.12,.005,edgeMat,.14,group);f.position.z=-.23+i*.065;}const p=cylinder(.05,.1,darkMat,group,.18);p.position.x=.3;}
    else{const screen=new THREE.Mesh(new THREE.PlaneGeometry(.65,.35),new THREE.MeshBasicMaterial({map:displayTexture(type)}));screen.rotation.x=-Math.PI/2;screen.position.y=.104;group.add(screen);for(const x of[-.32,.32]){const knob=cylinder(.045,.03,amberMat,group,.12);knob.position.set(x,.12,.22);}}
    pick(group,id,.96,.64,.24);
  }
  return group;
}

function studio(){
  scene.add(new THREE.HemisphereLight(0xc4e5eb,0x10202b,2.1));
  const main=new THREE.DirectionalLight(0xdff6f3,4.5);main.position.set(-3,8,5);main.castShadow=true;main.shadow.mapSize.set(2048,2048);main.shadow.camera.left=-7;main.shadow.camera.right=7;main.shadow.camera.top=7;main.shadow.camera.bottom=-7;main.shadow.bias=-.001;scene.add(main);
  const copper=new THREE.DirectionalLight(0xeec19a,2.8);copper.position.set(-5,2,-4);scene.add(copper);
  const rim=new THREE.DirectionalLight(0x64cdbd,3.8);rim.position.set(5,4,-2);scene.add(rim);
  const canvases=[];for(let i=0;i<6;i++){const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');const gradient=ctx.createLinearGradient(0,0,256,256);gradient.addColorStop(0,'#11232d');gradient.addColorStop(.35,'#597175');gradient.addColorStop(.43,'#d8dfdb');gradient.addColorStop(.5,'#456771');gradient.addColorStop(.8,'#0b1a23');gradient.addColorStop(1,'#18343b');ctx.fillStyle=gradient;ctx.fillRect(0,0,256,256);ctx.fillStyle='#d7e9e4';ctx.fillRect(35,0,23,256);canvases.push(c);}const env=new THREE.CubeTexture(canvases);env.needsUpdate=true;env.colorSpace=THREE.SRGBColorSpace;scene.environment=env;
  const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');const g=ctx.createRadialGradient(128,128,0,128,128,125);g.addColorStop(0,'rgba(0,0,0,.58)');g.addColorStop(.5,'rgba(0,0,0,.24)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,256,256);
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(9,7),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-.86;world.add(shadow);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(70,70),new THREE.ShadowMaterial({opacity:.18}));floor.rotation.x=-Math.PI/2;floor.position.y=-.87;floor.receiveShadow=true;scene.add(floor);
  const grid=new THREE.GridHelper(12,24,0x213b44,0x152d37);grid.position.y=-.88;grid.material.transparent=true;grid.material.opacity=.2;world.add(grid);
}

buildSpeaker();toolDevice('alignment-jig','jig');toolDevice('meter','meter');toolDevice('audio-signal','signal');toolDevice('amplifier','amp');toolDevice('power-source','power');toolDevice('microphone','microphone');studio();
const speakerAnchors={...anchors};
try{
  renderer=new THREE.WebGLRenderer({canvas:$('scene'),antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(W,H);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;renderer.localClippingEnabled=true;
}catch(e){webgl=false;$('webgl-error').hidden=false;console.warn('3D unavailable',e);}
camera=new THREE.PerspectiveCamera(30,W/H,.1,100);resize();

const poses=[
  {frame:-.48,yoke:-.14,magnet:.62,pole:1.22,coil:2.04,film:2.91,surround:2.91},
  {frame:-.48,yoke:-.14,magnet:-.14,pole:.08,coil:1.2,film:1.53,surround:1.53},
  {frame:-.48,yoke:-.14,magnet:-.14,pole:.08,coil:.26,film:.59,surround:.59},
  {frame:-.48,yoke:-.14,magnet:-.14,pole:.08,coil:.26,film:.59,surround:.59}
];
const toolPositions={meter:[-2.74,.25,1.05],'audio-signal':[-1.7,.18,-1.9],amplifier:[.1,.18,-2.14],'power-source':[2.35,.2,-1.66],microphone:[2.8,.04,.8],'alignment-jig':[0,.17,0]};
const notes={'speaker-frame':'frame + sealed rear chamber','bonding-film':'joins without stiffening the rim',magnet:'permanent magnetic field','iron-pole':'separate pole + return yoke','voice-coil':'insulated copper winding',diaphragm:'light, translucent membrane',surround:'flexible rim + acoustic seal','alignment-jig':'centres the coil without contact',meter:'check continuity','audio-signal':'provide a changing signal',amplifier:'drive the coil','power-source':'supply the test circuit',microphone:'observe acoustic response'};
const bearings=[[1,0],[0,1],[-1,0],[1,0]];
const stepNames=['Field','Motion','Seal','Test'];
const stepKickers=['BUILD THE FIELD','JOIN THE MOVING PARTS','CENTRE & SEAL','ENERGY INTO SOUND'];
const slotsDesktop=[[[79,68],[80,45],[46,54],[49,73]],[[79,53],[72,26],[46,63],[81,73]],[[79,37],[47,47],[79,67],[48,71]],[[44,63],[43,31],[65,24],[83,36],[85,66]]];
const slotsMobile=[[[62,72],[64,52],[9,61],[10,73]],[[64,59],[56,40],[10,62],[10,73]],[[64,43],[9,52],[64,69],[10,72]],[[9,62],[9,43],[50,37],[67,47],[66,66]]];

function current(){return catalog[state.id]||catalog.speaker;}
function currentStep(){return current().steps[state.step]||current().steps[0];}
function allInputIds(step=currentStep()){return [...(step.parts||[]),...(step.tools||[])].filter(id=>catalog[id]);}
function escapeHTML(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function titleFor(id){return catalog[id]?.label||catalog[id]?.title||id;}
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),2800);}

function renderUI(){
  const n=current(),s=currentStep(), isSpeaker=state.id==='speaker';
  $('journey-label').textContent=isSpeaker?'01 / SOUND':state.id==='phone'?'00 / THE WHOLE':'DEPTH '+String(state.stack.length).padStart(2,'0')+' / MAKING';
  $('journey-title').textContent=n.title;$('journey-title').style.fontSize=n.title.length>17?(mobile?'29px':'45px'):'';
  $('node-role').textContent=n.role;$('node-role').className='role '+n.role.toLowerCase();
  $('journey-summary').innerHTML=(isSpeaker?'Electricity becomes movement.<br>Movement becomes sound.':escapeHTML(n.summary))+(n.status==='stand-in'?'<div class="stand-in-note">NATIVE JOURNEY · CONCEPTUAL STAND-IN</div>':'');
  $('step-number').textContent=String(state.step+1).padStart(2,'0');$('step-kicker').textContent=isSpeaker?stepKickers[state.step]:(n.kicker||'MAKING THE '+n.role.toUpperCase());
  $('step-title').textContent=s.title;$('step-body').textContent=s.instruction;
  $('view-caption').textContent=isSpeaker?['magnetic system','moving assembly','alignment & rear chamber','conceptual motion test'][state.step]:n.status==='stand-in'?'native stand-in · same gestures':'conceptual assembly';
  $('steps').innerHTML=n.steps.map((s,i)=>`<button class="${i===state.step?'active':''}" data-step="${i}" aria-label="Step ${i+1}: ${escapeHTML(s.title)}"><span>${String(i+1).padStart(2,'0')}</span><span class="step-name">${isSpeaker?stepNames[i]:'Step '+(i+1)}</span></button>`).join('');
  $('steps').querySelectorAll('button').forEach(b=>b.onclick=()=>goStep(Number(b.dataset.step)));
  const trail=[...state.stack,{id:state.id,step:state.step}];
  $('trail').innerHTML=trail.map((entry,i)=>`${i?'<span class="trail-arrow">›</span>':''}<button data-trail="${i}" class="${i===trail.length-1?'current':''}">${escapeHTML(titleFor(entry.id))}<span class="trail-role ${catalog[entry.id].role.toLowerCase()}">${catalog[entry.id].role}</span>${i===trail.length-2?'<span class="caller-tag">CALLER</span>':''}</button>`).join('');
  $('trail').querySelectorAll('button').forEach(b=>b.onclick=()=>jumpTrail(Number(b.dataset.trail)));
  $('trail').scrollLeft=$('trail').scrollWidth;
  const caller=state.stack.at(-1);$('return-button').hidden=!caller;$('return-button').textContent='↑ Return to '+(caller?titleFor(caller.id):'');
  const hasNext=state.step<n.steps.length-1;const b=bearings[state.step%4];
  $('route-arrow').textContent=hasNext?(b[0]===1?'→':b[1]===1?'↓':'←'):'↖';
  $('route-title').textContent=hasNext?n.steps[state.step+1].title:'Making complete';
  const prev=bearings[(state.step+3)%4],backName=prev[0]===1?'left':prev[1]===1?'up':'right';
  $('route-instruction').textContent=hasNext?'Drag '+(b[0]===1?'right':b[1]===1?'down':'left')+(state.step?' · previous '+backName:' along the illuminated route'):caller?'Zoom out to return to '+titleFor(caller.id)+(state.step?' · previous '+backName:''):'Zoom into a labelled Part or Tool';
  $('route').setAttribute('aria-label',hasNext?'Next: '+n.steps[state.step+1].title:'Return to caller');
  renderLabels();renderDetail();
}
function renderLabels(){
  labelItems.length=0;const ids=allInputIds();$('labels').innerHTML='';
  ids.forEach((id,i)=>{
    const n=catalog[id],el=document.createElement('div');el.className='model-label '+n.role.toLowerCase()+' visible';el.dataset.id=id;
    el.innerHTML=`<button aria-label="${escapeHTML(n.title)}. ${n.role==='Tool'?'Tap to use; zoom or double tap to make.':'Zoom or double tap to make.'}"><span class="label-name">${escapeHTML(titleFor(id))}</span><span class="label-note">${escapeHTML(notes[id]||n.summary.split('.')[0])}</span><span class="label-meta">${n.role.toUpperCase()} · ${n.role==='Tool'?'TAP USE / ZOOM MAKE':'ZOOM TO MAKE'}</span></button>`;
    el.onmouseenter=()=>{state.hover=id;state.selected=id;el.classList.add('active');};el.onmouseleave=()=>{state.hover=null;el.classList.remove('active');};
    el.querySelector('button').onclick=()=>{state.selected=id;if(n.role==='Tool')useTool(id);else toast('Zoom into '+titleFor(id)+' · or double tap');};
    el.ondblclick=e=>{e.preventDefault();enter(id);};
    el.addEventListener('wheel',onWheel,{passive:false});$('labels').append(el);labelItems.push({id,el,i});
  });
}
function goStep(i){
  if(i<0||i>=current().steps.length||i===state.step)return;
  state.step=i;state.targetStage=i;state.selected=allInputIds()[0]||null;state.use=null;root.classList.add('transitioning');setTimeout(()=>root.classList.remove('transitioning'),250);renderUI();
}
function enter(id){
  if(!catalog[id]||id===state.id){toast('This is the current making journey.');return;}
  state.stack.push({id:state.id,step:state.step});changeJourney(id,0);toast('Inside '+titleFor(id)+' · zoom out to return');
}
function returnCaller(){
  const call=state.stack.pop();if(call)changeJourney(call.id,call.step);else toast('You are at the phone. Zoom into a component.');
}
function jumpTrail(i){if(i>=state.stack.length)return;const call=state.stack[i];state.stack=state.stack.slice(0,i);changeJourney(call.id,call.step);}
function changeJourney(id,step){
  state.id=id;state.step=step;state.stage=state.targetStage=step;state.use=null;state.detail=false;$('detail').hidden=true;$('detail-toggle').setAttribute('aria-expanded','false');
  state.selected=allInputIds()[0]||null;for(let i=targetMeshes.length-1;i>=0;i--)if(targetMeshes[i].userData.generic)targetMeshes.splice(i,1);generic.clear();Object.assign(anchors,speakerAnchors);buildGeneric();renderUI();$('depth-flash').classList.add('flash');setTimeout(()=>$('depth-flash').classList.remove('flash'),320);
}

function buildGeneric(){
  if(state.id==='speaker')return;
  const n=current();generic.userData={};
  if(state.id==='phone'){
    const shell=ring(2.7,5.25,.32,.35,2.43,4.98,.27,ironMat,-.4,generic);
    block(2.45,4.97,.08,.26,darkMat,.0,generic);
    const display=block(2.4,4.9,.05,.25,glassMat,.77,generic);
    const board=block(1.7,1.8,.08,.06,material({color:0x185650,metalness:.25}),.3,generic);board.position.z=-1.1;
    const cell=block(1.86,2.0,.21,.06,darkMat,.12,generic);cell.position.z=.8;
    const sound=new THREE.Group();sound.position.set(.48,.32,1.93);generic.add(sound);ring(1,.51,.1,.1,.72,.28,.08,edgeMat,0,sound);block(.69,.27,.05,.06,tealMat,.11,sound);pick(sound,'speaker',1.1,.6,.4,.1);
    pick(display,'display',2.4,4.9,.2);pick(board,'logic-board',1.7,1.8,.2);pick(cell,'battery',1.9,2,.3);pick(shell,'phone-frame',2.7,5.25,.1);
  }else if(['voice-coil','generator-coil','coil-former','insulated-wire','generator-assembly'].includes(state.id)){
    const windingGroup=new THREE.Group();generic.add(windingGroup);generic.userData.winding=windingGroup;
    ring(2.89,1.2,.58,.3,2.8,1.11,.26,material({color:0x7fa8a2,transparent:true,opacity:.25,metalness:.1,roughness:.4}),.2,windingGroup);
    for(let i=0;i<24;i++)winding(2.96,1.27,.32,-.07+i*.025,windingGroup);
    pathLine([[-1.5,.04,.45],[-2.1,.08,.75],[-2.5,.4,.58],[-2.6,.62,0]],colors.copper,.9,generic,.026);
    const spool=cylinder(.37,.53,toolMat,generic,.54);spool.position.x=-2.55;const hub=cylinder(.1,.7,edgeMat,generic,.54);hub.position.x=-2.55;
    block(3.7,1.65,.1,.13,toolMat,-.47,generic);pick(windingGroup,'coil-former',3,1.3,.65,.3);pick(spool,'insulated-wire',.8,.8,.7);pick(spool,'winding-fixture',.82,.82,.72);
  }else if(n.role==='Tool'){
    const type=state.id==='power-source'?'power':state.id==='microphone'?'microphone':state.id==='alignment-jig'?'jig':state.id==='audio-signal'?'signal':state.id==='amplifier'?'amp':'meter';
    const g=new THREE.Group();generic.add(g);g.scale.setScalar(state.id==='alignment-jig'?.83:2.5);generic.userData.tool=g;
    if(type==='jig'){ring(4,2,.13,.3,3.6,1.6,.2,toolMat,.2,g);for(const x of[-1.7,1.7]){const p=cylinder(.08,.7,amberMat,g,.5);p.position.x=x;}}
    else{block(.95,.63,.2,.09,toolMat,.1,g);const face=new THREE.Mesh(new THREE.PlaneGeometry(.66,.34),new THREE.MeshBasicMaterial({map:displayTexture(type)}));face.rotation.x=-Math.PI/2;face.position.y=.212;g.add(face);for(const x of[-.32,.32]){const p=cylinder(.05,.06,amberMat,g,.24);p.position.set(x,.24,.22);}}
    pathLine([[-1.1,0,.8],[-1.6,-.15,1.2],[-2.0,.1,.8]],colors.tool,.8,generic,.022);
  }else{
    block(2.85,1.7,.16,.32,n.id.includes('film')||n.id.includes('polymer')?glassMat:n.id.includes('copper')?copperMat:n.id.includes('magnet')?magnetMat:ironMat,.3,generic);
    if(n.id==='surround')ring(3.5,1.95,.08,.4,2.9,1.4,.3,surroundMat,.7,generic);
    if(n.id==='diaphragm')block(3.5,1.95,.024,.4,glassMat,.7,generic);
  }
  const ids=[...new Set(current().steps.flatMap(s=>[...(s.parts||[]),...(s.tools||[])]))].slice(0,8);
  generic.userData.children=[];ids.forEach((id,i)=>{
    const group=new THREE.Group();generic.add(group);const isTool=catalog[id].role==='Tool';const m=block(.56,.4,.12,.06,isTool?toolMat:catalog[id].id.includes('wire')?copperMat:glassMat,0,group);
    const side=i%2?-1:1,rank=Math.floor(i/2);group.position.set(side*(1.85+rank*.16),.4+rank*.5,(rank-1)*.8);pick(group,id,.7,.55,.3);generic.userData.children.push({id,group});
  });
}

function useTool(id){
  if(catalog[id]?.role!=='Tool')return;
  state.use={id,start:performance.now(),duration:4300};state.selected=id;
  const messages={'alignment-jig':'The guide holds the coil centred in the air gap.',meter:'Probes touch the leads to check the electrical path.','audio-signal':'A changing signal begins the electrical motion test.',amplifier:'The amplifier drives current through the coil.','power-source':'Mechanical input supplies the test circuit.',microphone:'The microphone observes the sound response.'};
  toast(messages[id]||'Use '+titleFor(id)+' in this making step.');
}

const detailDiagrams=[
  `<svg viewBox="0 0 310 135" aria-label="Magnetic circuit cross section"><defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10" fill="#81d4c6"/></marker></defs><path d="M40 43v64h230V43h-40v47H80V43Z" fill="#6d818b"/><rect x="96" y="68" width="118" height="21" fill="#426377"/><rect x="80" y="40" width="150" height="28" fill="#a9bdc5"/><path d="M72 65h18M222 65h17" stroke="#83d9cb" stroke-width="2" marker-end="url(#a)"/><text x="155" y="22" fill="#a5dace" font-size="10" text-anchor="middle">NARROW AIR GAP · NO CONTACT</text><text x="155" y="127" fill="#7895a4" font-size="9" text-anchor="middle">magnet + separate iron field path</text></svg>`,
  `<svg viewBox="0 0 310 135"><path d="M45 48Q65 24 85 42H225Q245 24 265 48" stroke="#85d5c8" stroke-width="3" fill="none"/><path d="M90 43v60M220 43v60" stroke="#d38d53" stroke-width="9" stroke-dasharray="3 2"/><path d="M155 14v18M155 115v-18" stroke="#7ec9be" stroke-width="2"/><path d="M150 23l5 9 5-9M150 106l5-9 5 9" fill="none" stroke="#7ec9be"/><text x="155" y="79" fill="#7895a4" font-size="10" text-anchor="middle">coil + diaphragm move together</text></svg>`,
  `<svg viewBox="0 0 310 135"><path d="M35 53Q55 28 77 49H233Q255 28 277 53" stroke="#85d5c8" stroke-width="3" fill="none"/><path d="M50 60v48h210V60" stroke="#6d818b" stroke-width="8" fill="none"/><rect x="98" y="69" width="114" height="26" fill="#7895a4"/><path d="M91 54v38M219 54v38" stroke="#d38d53" stroke-width="5"/><text x="155" y="126" fill="#7895a4" font-size="9" text-anchor="middle">sealed rear chamber · fixed magnetic system</text><path d="M46 48h20M247 48h20" stroke="#e1b77a" stroke-width="3"/></svg>`,
  `<svg viewBox="0 0 310 135"><path d="M15 51Q27 15 38 51T60 51T82 51" fill="none" stroke="#d6b581" stroke-width="2"/><path d="M95 50h40M180 50h40" stroke="#667f8b"/><path d="M130 31h52v38h-52z" fill="none" stroke="#d6b581"/><path d="M227 40q15 10 0 20M240 32q25 20 0 36M253 23q34 29 0 54" fill="none" stroke="#8bdacb"/><text x="155" y="112" fill="#7895a4" font-size="10" text-anchor="middle">electrical path → motion → acoustic response</text><text x="155" y="129" fill="#506e7b" font-size="8" text-anchor="middle">conceptual behaviour · no measured result</text></svg>`
];
function renderDetail(){const s=currentStep(),n=current();$('detail-title').textContent=s.title;$('detail-body').innerHTML=(state.id==='speaker'?`<div class="detail-diagram">${detailDiagrams[state.step]}</div>`:'')+`<p>${escapeHTML(s.instruction)}</p><p>${escapeHTML(n.note||'This stand-in preserves the making journey and caller return.')}</p>`;}
function toggleDetail(){state.detail=!state.detail;$('detail').hidden=!state.detail;$('detail-toggle').setAttribute('aria-expanded',String(state.detail));toast(state.detail&&state.id==='speaker'?'Section cut reveals the moving clearance.':'');}
$('detail-toggle').onclick=toggleDetail;$('detail-close').onclick=()=>{if(state.detail)toggleDetail();};$('return-button').onclick=returnCaller;
$('route').onclick=()=>{if(performance.now()<suppressRouteClick)return;state.step<current().steps.length-1?goStep(state.step+1):toast(state.stack.length?'Zoom out to restore the caller.':'Zoom into a labelled Part or Tool.');};
$('route').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('route').click();}};
document.querySelector('.brand').onclick=e=>{e.preventDefault();state.stack=[];changeJourney('phone',2);};

let wheelLock=0,wheelAccum=0,suppressRouteClick=0;
function onWheel(e){
  e.preventDefault();if(performance.now()<wheelLock)return;wheelAccum+=e.deltaY;
  if(Math.abs(wheelAccum)<38)return;
  const inward=wheelAccum<0;wheelAccum=0;wheelLock=performance.now()+680;
  if(inward){const id=e.currentTarget?.dataset?.id||pickAt(e.clientX,e.clientY)||state.hover||state.selected||allInputIds()[0];if(id)enter(id);else toast('This is a material boundary. Zoom out to return.');}else returnCaller();
}
$('scene').addEventListener('wheel',onWheel,{passive:false});
function pickAt(x,y){
  if(!webgl)return null;pointer.set(x/W*2-1,-y/H*2+1);raycaster.setFromCamera(pointer,camera);
  for(const hit of raycaster.intersectObjects(targetMeshes,false)){let p=hit.object,visible=true,attached=false;while(p){if(!p.visible){visible=false;break;}if(p===scene)attached=true;p=p.parent;}if(visible&&attached&&catalog[hit.object.userData.id])return hit.object.userData.id;}
  return null;
}
const pointers=new Map();let pinchStart=0,pinchDone=false,lastTap={t:0,id:null};
function pointerDown(e){
  if(e.button!==0)return;e.currentTarget.setPointerCapture?.(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size===2){const ps=[...pointers.values()];pinchStart=Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y);pinchDone=false;state.drag=null;return;}
  state.drag={x:e.clientX,y:e.clientY,moved:false,target:state.step,p:0,pick:pickAt(e.clientX,e.clientY)};
}
function pointerMove(e){
  if(pointers.has(e.pointerId))pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size===2){if(pinchDone)return;const ps=[...pointers.values()],dist=Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y),ratio=dist/pinchStart;if(ratio>1.14||ratio<.86){pinchDone=true;if(ratio>1.14){const id=pickAt((ps[0].x+ps[1].x)/2,(ps[0].y+ps[1].y)/2)||state.selected||allInputIds()[0];if(id)enter(id);}else returnCaller();}return;}
  if(!state.drag){const id=pickAt(e.clientX,e.clientY);state.hover=id;$('scene').style.cursor=id?'zoom-in':'grab';return;}
  const d=state.drag,dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.hypot(dx,dy)>7)d.moved=true;
  const b=bearings[state.step%4],forward=dx*b[0]+dy*b[1],prev=bearings[(state.step+3)%4],back=-(dx*prev[0]+dy*prev[1]);
  let direction=0,progress=0;if(forward>0&&state.step<current().steps.length-1){direction=1;progress=forward;}if(back>progress&&state.step>0){direction=-1;progress=back;}
  d.target=state.step+direction;d.p=Math.min(1,progress/(mobile?120:220));state.targetStage=state.step+direction*d.p;$('route-progress').style.width=(d.p*100)+'%';
  $('route-arrow').style.transform=`translate(${b[0]*d.p*8}px,${b[1]*d.p*8}px)`;
}
function pointerUp(e){
  pointers.delete(e.pointerId);if(pinchDone){if(!pointers.size){pinchDone=false;state.drag=null;}return;}
  const d=state.drag;if(!d)return;state.drag=null;
  if(d.moved)suppressRouteClick=performance.now()+350;
  if(d.moved&&d.p>.34&&d.target!==state.step)goStep(d.target);else{state.targetStage=state.step;if(!d.moved&&d.pick){const id=d.pick;state.selected=id;if(performance.now()-lastTap.t<370&&lastTap.id===id){enter(id);lastTap={t:0,id:null};}else{lastTap={t:performance.now(),id};if(catalog[id]?.role==='Tool')useTool(id);else toast(titleFor(id)+' · zoom to make');}}}
  $('route-progress').style.width='0';$('route-arrow').style.transform='';
}
for(const el of[$('scene'),$('route')]){el.addEventListener('pointerdown',pointerDown);el.addEventListener('pointermove',pointerMove);el.addEventListener('pointerup',pointerUp);el.addEventListener('pointercancel',pointerUp);}
window.addEventListener('keydown',e=>{
  if(e.target.tagName==='BUTTON')return;
  if(e.key==='Escape'){state.detail?toggleDetail():returnCaller();return;}
  if(e.key==='Enter'&&state.selected){enter(state.selected);return;}
  if(e.key===' '){e.preventDefault();if(catalog[state.selected]?.role==='Tool')useTool(state.selected);else $('route').click();return;}
  if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();goStep(state.step+1);}if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();goStep(state.step-1);}
});

function resize(){
  W=innerWidth;H=innerHeight;mobile=W<680;camera.aspect=W/H;
  const width=mobile?5.6:9.5;const distance=(width/camera.aspect)/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)));
  camera.position.copy(new THREE.Vector3(4.6,6.3,7.8).normalize().multiplyScalar(distance));camera.lookAt(0,.9,0);
  camera.setViewOffset(W,H,mobile?0:-W*.14,mobile?-H*.12:0,W,H);camera.updateProjectionMatrix();renderer?.setSize(W,H);$('connectors').setAttribute('viewBox',`0 0 ${W} ${H}`);
}
window.addEventListener('resize',()=>{resize();renderUI();});
function screenPoint(object){if(!object)return{x:W*.63,y:H*.52};object.getWorldPosition(vec);vec.project(camera);return{x:(vec.x*.5+.5)*W,y:(-.5*vec.y+.5)*H};}
function positionLabels(){
  let svg='';const native=state.id!=='speaker';
  labelItems.forEach(item=>{
    const slot=native?(mobile?[[9,48],[66,51],[9,67],[64,70],[48,39],[9,40]]:[[78,40],[45,29],[79,66],[45,69],[66,26],[86,51]])[item.i%6]:(mobile?slotsMobile:slotsDesktop)[state.step][item.i%((mobile?slotsMobile:slotsDesktop)[state.step].length)];
    const delta=state.targetStage-state.step;const b=bearings[state.step%4];const x=W*slot[0]/100+b[0]*delta*(item.i%2?18:30),y=H*slot[1]/100+b[1]*delta*(item.i%2?18:30);
    item.el.style.left=x+'px';item.el.style.top=y+'px';const p=screenPoint(anchors[item.id]);const tool=catalog[item.id].role==='Tool';
    svg+=`<line class="${tool?'tool':''}" x1="${p.x}" y1="${p.y}" x2="${x-11}" y2="${y+1}"/><circle class="${tool?'tool':''}" cx="${p.x}" cy="${p.y}" r="2"/>`;
  });
  const hasNext=state.step<current().steps.length-1;
  if(hasNext){const b=bearings[state.step%4],cx=W*(mobile?.5:.65),cy=H*(mobile?.74:.74),len=mobile?70:120;let endX=cx+b[0]*len,endY=cy+b[1]*(mobile?30:50);const path=b[1]?`M${cx-55} ${cy-35}H${cx}V${endY}`:`M${cx-b[0]*35} ${cy-25}V${cy}H${endX}`;
    svg+=`<defs><filter id="routeglow"><feGaussianBlur stdDeviation="3"/></filter><marker id="routehead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 1L8 5L0 9" fill="none" stroke="#78b7a8" stroke-width="1.2"/></marker></defs><path d="${path}" stroke="#64c4b0" stroke-width="4" opacity=".12" fill="none" filter="url(#routeglow)"/><path d="${path}" stroke="#69ab9d" stroke-width=".8" opacity=".6" stroke-dasharray="3 7" fill="none" marker-end="url(#routehead)"/><circle cx="${endX}" cy="${endY}" r="4" fill="none" stroke="#78b7a8" stroke-width=".7" opacity=".6"/>`;
  }
  if(state.step>0){const incoming=bearings[(state.step+3)%4],x=W*(mobile?.33:.52),y=H*(mobile?.77:.77),l=mobile?27:42;const ex=x-incoming[0]*l,ey=y-incoming[1]*l;svg+=`<path d="M${x} ${y}L${ex} ${ey}" stroke="#3c5d68" stroke-width=".7" opacity=".8"/><text x="${ex-5}" y="${ey+12}" fill="#496878" font-size="${mobile?6:7}" letter-spacing="1">PREVIOUS ${incoming[0]===1?'←':incoming[1]===1?'↑':'→'}</text>`;}
  $('connectors').innerHTML=svg;
}
function updateModel(t,dt){
  state.stage+=(state.targetStage-state.stage)*(1-Math.exp(-dt*(state.drag?18:7)));if(Math.abs(state.stage-state.targetStage)<.002)state.stage=state.targetStage;
  speaker.visible=state.id==='speaker';generic.visible=!speaker.visible;
  if(speaker.visible){
    const a=Math.max(0,Math.min(3,Math.floor(state.stage))),b=Math.min(3,a+1),blend=state.stage-a;
    for(const name of['frame','yoke','magnet','pole','coil','film','surround'])groups[name].position.y=THREE.MathUtils.lerp(poses[a][name],poses[b][name],blend);
    const movement=state.stage>2.5&&!reducedMotion?Math.sin(t*5.4)*.045*Math.min(1,(state.stage-2.5)*2):0;groups.coil.position.y+=movement;groups.film.position.y+=movement;groups.surround.position.y+=movement*.75;
    groups.gap.position.y=.13;groups.gap.visible=state.stage<1.2||state.detail;groups.flux.position.y=.0;groups.flux.visible=state.stage<.8;groups.adhesive.position.y=groups.film.position.y-.09;groups.adhesive.visible=state.stage>.8&&state.stage<2.4;groups.leads.visible=state.stage>2.55;groups.waves.visible=state.stage>2.6;
    groups.probes.visible=state.use?.id==='meter';groups.signalPath.visible=state.stage>2.6;groups.clearance.visible=state.step===2||state.detail;
    groups.waves.children.forEach((m,i)=>{m.scale.setScalar(1+Math.sin(t*2.6-i*.7)*.04);m.material.opacity=.08+(.5+.5*Math.sin(t*2.6-i*.7))*.14;});
    for(const [id,g]of Object.entries(tools)){
      const testTool=id!=='alignment-jig';g.visible=testTool?state.stage>2.4:state.step<3||state.use?.id===id;
      const pos=toolPositions[id];g.position.set(...pos);g.scale.setScalar(id==='alignment-jig'?1:.88);
      if(id==='alignment-jig'){g.position.y=state.step===0?-.35:state.step===1?.86:.12;g.visible=state.step<3;g.children.forEach(m=>{if(m.material?.transparent)m.material.opacity=.25;});}
      if(state.use?.id===id){const progress=(performance.now()-state.use.start)/state.use.duration;if(progress>1){state.use=null;}else{const amount=Math.sin(Math.min(1,progress*3)*Math.PI/2)*Math.sin(Math.min(1,(1-progress)*4)*Math.PI/2);if(id==='alignment-jig'){g.position.y+=amount*.3;g.rotation.y=Math.sin(progress*8)*.015;}else{g.position.x=THREE.MathUtils.lerp(pos[0],id==='microphone'?2.15:-1.9,amount*.4);g.position.y+=amount*.28;}if(id==='power-source'&&g.userData.rotor)g.userData.rotor.rotation.x=t*5;}}
    }
  }else{
    generic.position.y=.4;generic.rotation.y=state.id==='phone'?-.06:0;
    generic.userData.children?.forEach(({id,group},i)=>{const active=allInputIds().includes(id);group.visible=active;group.position.y=.4+Math.floor(i/2)*.5+Math.sin(t*.8+i)*.025;});
    if(generic.userData.winding)generic.userData.winding.position.y=.1+Math.sin(t*.8)*.03;
  }
  // A technical section removes the near half while keeping every layer in place.
  const plane=state.detail&&speaker.visible?[new THREE.Plane(new THREE.Vector3(0,0,-1),.05)]:[];for(const m of materials)m.clippingPlanes=plane;
  positionLabels();
}
function animate(now){
  const dt=Math.min(.05,(now-lastTime)/1000||.016);lastTime=now;time+=dt;updateModel(time,dt);if(webgl)renderer.render(scene,camera);requestAnimationFrame(animate);
}
renderUI();requestAnimationFrame(animate);
// Expose a compact, read-only snapshot for the preview host.
window.materiaSnapshot=()=>({journey:state.id,step:state.step,caller:state.stack.at(-1),inputs:allInputIds(),webgl});
