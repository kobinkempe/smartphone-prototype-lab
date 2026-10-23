import * as THREE from './three.module.js';
const $ = (s) => document.querySelector(s);
const lerp=(a,b,t)=>a+(b-a)*t;
let renderer,scene,camera,model,floor,groups={},raycaster=new THREE.Raycaster(),webgl=true;
const canvas=$('#scene'),viewport=$('#viewport');
const materials=[];
function material(color,opts={}){const m=new THREE.MeshStandardMaterial({color,metalness:.6,roughness:.3,...opts});m.userData.baseOpacity=m.opacity;materials.push(m);return m;}
function roundedPath(w,h,r){const p=new THREE.Shape(),x=-w/2,z=-h/2;p.moveTo(x+r,z);p.lineTo(x+w-r,z);p.quadraticCurveTo(x+w,z,x+w,z+r);p.lineTo(x+w,z+h-r);p.quadraticCurveTo(x+w,z+h,x+w-r,z+h);p.lineTo(x+r,z+h);p.quadraticCurveTo(x,z+h,x,z+h-r);p.lineTo(x,z+r);p.quadraticCurveTo(x,z,x+r,z);return p;}
function solid(w,d,h,r,mat){const g=new THREE.ExtrudeGeometry(roundedPath(w,d,r),{depth:h,bevelEnabled:true,bevelThickness:.035,bevelSize:.045,bevelSegments:3,curveSegments:12,steps:1});g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,mat);m.castShadow=true;m.receiveShadow=true;return m;}
function ring(w,d,iw,id,h,r,mat){const sh=roundedPath(w,d,r);const hole=roundedPath(iw,id,Math.min(r,Math.min(iw,id)/3));sh.holes.push(hole);const g=new THREE.ExtrudeGeometry(sh,{depth:h,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:2,curveSegments:14,steps:1});g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,mat);m.castShadow=true;m.receiveShadow=true;return m;}
function box(w,h,d,mat,x=0,y=0,z=0){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;return m;}
function wire(w,d,y,r,mat){const points=roundedPath(w,d,r).getPoints(85).map(p=>new THREE.Vector3(p.x,y,-p.y));const curve=new THREE.CatmullRomCurve3(points,true,'centripetal');const m=new THREE.Mesh(new THREE.TubeGeometry(curve,128,.026,6,true),mat);m.castShadow=true;return m;}
function meshLine(points,mat,r=.024){return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),24,r,6,false),mat);}
function identify(group,id){group.traverse(o=>{if(o.isMesh){o.userData.part=id;o.material=o.material.clone();o.material.userData.baseOpacity=o.material.opacity;}});}

try{
  renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.42;
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(34,1,.1,100);scene.add(new THREE.HemisphereLight(0xc7f4ff,0x17314b,2.7));
  const key=new THREE.DirectionalLight(0xf1f8ff,4.3);key.position.set(-5,12,8);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-10;key.shadow.camera.right=10;key.shadow.camera.top=10;key.shadow.camera.bottom=-10;key.shadow.camera.far=32;key.shadow.bias=-.0007;scene.add(key);
  const cyanLight=new THREE.PointLight(0x2ea7ca,28,20);cyanLight.position.set(6,6,-3);scene.add(cyanLight);const rim=new THREE.DirectionalLight(0xa087ff,2.5);rim.position.set(3,2,-8);scene.add(rim);
  model=new THREE.Group();scene.add(model);
  const silver=material(0xb5c5d8,{metalness:.86,roughness:.28}),iron=material(0x697f96,{metalness:.85,roughness:.23}),dark=material(0x263b4f,{metalness:.45,roughness:.5}),violet=material(0x7363de,{metalness:.35,roughness:.31}),copper=material(0xef9760,{metalness:.86,roughness:.22}),cyan=material(0x64dce5,{metalness:.38,roughness:.21}),film=material(0x92eef1,{metalness:.35,roughness:.3,transparent:true,opacity:.87,side:THREE.DoubleSide});
  groups.frame=new THREE.Group();model.add(groups.frame);groups.frame.add(solid(7.8,4.35,.16,.58,silver));const chamber=ring(7.78,4.33,6.86,3.36,1.13,.57,silver);chamber.position.y=.17;groups.frame.add(chamber);const lip=ring(7.9,4.42,6.58,3.12,.11,.6,silver);lip.position.y=1.29;groups.frame.add(lip);const seal=ring(7.12,3.63,6.58,3.12,.06,.58,dark);seal.position.y=1.4;groups.frame.add(seal);
  for(const x of [-3.5,3.5])for(const z of [-1.75,1.75]){const screw=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.07,20),iron);screw.position.set(x,1.45,z);groups.frame.add(screw);const slit=box(.15,.01,.025,dark,x,1.49,z);groups.frame.add(slit);}
  for(const x of [-2.1,2.1]){const pad=box(.55,.09,.26,copper,x,1.05,2.2);groups.frame.add(pad);}
  groups.magnetic=new THREE.Group();model.add(groups.magnetic);groups.magnetic.add(solid(6.4,3.2,.16,.36,iron));const magnet=solid(5.65,2.76,.37,.4,violet);magnet.position.y=.17;groups.magnetic.add(magnet);const outer=ring(5.55,2.68,4.66,1.8,.34,.43,silver);outer.position.y=.38;groups.magnetic.add(outer);const pole=solid(4.04,1.15,.28,.39,silver);pole.position.y=.43;groups.magnetic.add(pole);const centerMark=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.011,24),iron);centerMark.position.y=.755;groups.magnetic.add(centerMark);
  groups.coil=new THREE.Group();model.add(groups.coil);const former=ring(4.47,1.64,4.31,1.47,.5,.44,material(0x5d4033,{metalness:.1,roughness:.65}));groups.coil.add(former);for(let i=0;i<12;i++)groups.coil.add(wire(4.51,1.68,.026+i*.038,.44,copper));
  groups.coil.add(meshLine([[-2.1,.08,.5],[-2.85,.03,1.1],[-3,.01,1.7],[-2.12,0,2.0]],copper));groups.coil.add(meshLine([[2.1,.08,.5],[2.85,.03,1.1],[3,.01,1.7],[2.12,0,2.0]],copper));
  groups.membrane=new THREE.Group();model.add(groups.membrane);const surround=ring(7.15,3.75,5.7,2.3,.035,.65,cyan);groups.membrane.add(surround);
  for(let i=0;i<5;i++){const f=i/5;const w=lerp(6.95,5.84,f),d=lerp(3.55,2.45,f);const fold=ring(w,d,w-.10,d-.10,.035,.62,cyan);fold.position.y=.07*Math.sin(f*Math.PI*3);groups.membrane.add(fold);}
  const membrane=solid(5.7,2.31,.045,.8,film);membrane.position.y=.03;groups.membrane.add(membrane);const bond=ring(4.48,1.66,4.32,1.48,.035,.44,dark);bond.position.y=-.015;groups.membrane.add(bond);
  groups.wire=new THREE.Group();model.add(groups.wire);groups.wire.visible=false;
  const wirePoints=[];for(let i=0;i<=80;i++){const x=-3.6+i*.09;wirePoints.push([x,.18*Math.sin(x*1.2),.13*Math.sin(x*1.8)]);}
  const core=meshLine(wirePoints,copper,.086);groups.wire.add(core);const insulation=meshLine(wirePoints.slice(6,-6),material(0x53dae1,{transparent:true,opacity:.68,metalness:.22,roughness:.22}),.145);insulation.userData.insulation=true;groups.wire.add(insulation);
  groups.fixture=new THREE.Group();model.add(groups.fixture);groups.fixture.visible=false;const fixtureBase=solid(7,3.7,.26,.32,silver);groups.fixture.add(fixtureBase);
  const support=new THREE.Group();support.name='supports';groups.fixture.add(support);for(const x of [-2.9,2.9]){support.add(box(.45,.9,1.1,iron,x,.7,0));support.add(box(.55,.12,1.2,silver,x,1.18,0));}
  const mandrel=solid(4.5,1.7,.75,.48,violet);mandrel.name='mandrel';mandrel.position.y=.42;groups.fixture.add(mandrel);const fixtureShaft=new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,6.6,20),iron);fixtureShaft.rotation.z=Math.PI/2;fixtureShaft.position.y=.85;groups.fixture.add(fixtureShaft);const handle=box(.15,.95,.15,copper,3.5,.4,0);groups.fixture.add(handle);
  Object.entries(groups).forEach(([id,g])=>identify(g,id));
  floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({color:0x000000,opacity:.38}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.02;floor.receiveShadow=true;scene.add(floor);
  // A quiet reference plane helps make the depth of the floating layers legible.
  const grid=new THREE.GridHelper(24,24,0x29455a,0x193245);grid.position.y=-2.05;grid.material.transparent=true;grid.material.opacity=.22;scene.add(grid);
}catch(e){webgl=false;$('#model-fallback').hidden=false;canvas.hidden=true;console.warn('WebGL unavailable; accessible schematic remains available.',e);}


if(webgl){
 const silver=material(0xb5c5d8,{metalness:.86,roughness:.28}),iron=material(0x657d92,{metalness:.8}),black=material(0x152a3d,{metalness:.3}),violet=material(0x8570df,{metalness:.3}),copper=material(0xef9760,{metalness:.86}),cyan=material(0x64dce5,{metalness:.3}),green=material(0x61b597,{metalness:.15});
 groups.phone=new THREE.Group();model.add(groups.phone);groups.phone.add(solid(5.5,9.6,.26,.6,silver));let screen=solid(5.05,9.08,.055,.5,black);screen.position.y=.3;groups.phone.add(screen);for(let row=0;row<3;row++)for(let col=0;col<3;col++){let icon=solid(.8,.8,.028,.2,(row+col)%2?cyan:violet);icon.position.set((col-1)*1.28,.385,(row-1)*1.35-1);groups.phone.add(icon);}const phoneSlot=solid(2.7,.4,.03,.12,iron);phoneSlot.position.set(0,.39,3.95);groups.phone.add(phoneSlot);
 groups.magnet=new THREE.Group();groups.magnet.add(solid(5.65,2.76,.37,.4,violet));model.add(groups.magnet);
 groups.iron=new THREE.Group();[0,2,3,4].forEach(i=>groups.iron.add(groups.magnetic.children[i].clone()));model.add(groups.iron);
 groups.alignment=new THREE.Group();model.add(groups.alignment);groups.alignment.add(ring(7.8,4.1,7.5,3.8,.12,.6,violet));for(let x of [-3.55,3.55])for(let z of [-1.6,1.6])groups.alignment.add(box(.12,1.2,.12,silver,x,.4,z));
 groups.applicator=new THREE.Group();model.add(groups.applicator);const barrel=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.95,20),silver);barrel.position.y=.8;groups.applicator.add(barrel);const needle=new THREE.Mesh(new THREE.CylinderGeometry(.024,.024,.6,12),iron);needle.position.y=.1;groups.applicator.add(needle);const plunger=box(.5,.08,.16,violet,0,1.45,0);groups.applicator.add(plunger);
 function instrument(color){const g=new THREE.Group();g.add(solid(1.4,1.05,.65,.12,black));const lcd=box(.95,.035,.48,color,0,.69,-.1);g.add(lcd);for(let x of [-.37,.37])g.add(box(.16,.05,.16,silver,x,.71,.34));return g;}
 groups.meter=instrument(green);model.add(groups.meter);groups.meter.add(meshLine([[-.4,.15,.4],[-.8,.05,1],[-.5,.15,1.4],[.4,.25,1.5]],copper,.027));groups.meter.add(meshLine([[.4,.15,.4],[.85,.05,1],[.65,.1,1.5],[1,.25,1.7]],cyan,.027));
 groups.signal=instrument(violet);model.add(groups.signal);groups.signal.add(meshLine([[-.4,.75,-.2],[-.2,.75,-.05],[0,.75,-.25],[.2,.75,-.05],[.4,.75,-.2]],cyan,.018));
 groups.amplifier=instrument(silver);model.add(groups.amplifier);for(let x=-.5;x<=.5;x+=.2)groups.amplifier.add(box(.08,.25,.8,silver,x,.8,0));
 groups.microphone=new THREE.Group();model.add(groups.microphone);let micbody=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,1,20),silver);micbody.position.y=.75;groups.microphone.add(micbody);const capsule=new THREE.Mesh(new THREE.SphereGeometry(.21,20,12),black);capsule.position.y=1.37;groups.microphone.add(capsule);groups.microphone.add(box(.9,.08,.65,iron,0,.2,0));
 groups.power=new THREE.Group();model.add(groups.power);const housing=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,1.15,32),silver);housing.rotation.z=Math.PI/2;housing.position.y=.65;groups.power.add(housing);let shaft=box(2,.09,.09,iron,0,.65,0);shaft.name='shaft';groups.power.add(shaft);groups.power.add(box(.1,.65,.1,copper,1,.32,0));groups.power.add(box(1.8,.12,1.2,black,0,.08,0));groups.power.add(box(.3,.14,.23,violet,-.3,1.14,0));
 groups.board=new THREE.Group();model.add(groups.board);groups.board.add(solid(4.2,2.8,.1,.16,green));for(let x of [-1.3,0,1.3])groups.board.add(box(.6,.18,.6,black,x,.23,0));for(let x=-1.5;x<1.7;x+=.5)groups.board.add(box(.16,.09,.35,copper,x,.2,1.25));
 groups.casing=new THREE.Group();model.add(groups.casing);groups.casing.add(ring(4.7,3.4,4.35,3.05,.9,.25,silver));groups.casing.add(solid(4.7,3.4,.08,.25,silver));
 groups.adhesive=new THREE.Group();model.add(groups.adhesive);const bond=new THREE.Mesh(new THREE.SphereGeometry(.52,28,20),material(0xe2aa6e,{transparent:true,opacity:.65,roughness:.12}));bond.scale.y=.35;groups.adhesive.add(bond);
 Object.entries(groups).forEach(([id,g])=>identify(g,id));
 Object.entries(groups).forEach(([id,g])=>{if(!['frame','magnetic','coil','membrane'].includes(id)){g.scale.setScalar(.04);g.traverse(o=>{if(o.isMesh){o.material.opacity=0;o.material.transparent=true;o.castShadow=false;}});}});
}
if(webgl){const silver=material(0xb5c5d8,{metalness:.85}),black=material(0x152a3d),violet=material(0x8876e0,{metalness:.3});
 groups.drawingDie=new THREE.Group();const die=ring(1.4,1.2,.35,.3,.5,.22,silver);die.rotation.z=Math.PI/2;groups.drawingDie.add(die);model.add(groups.drawingDie);
 groups.metalworking=new THREE.Group();groups.metalworking.add(box(.65,.55,.65,silver,0,.5,0));const bit=new THREE.Mesh(new THREE.CylinderGeometry(.07,.03,.75,16),black);groups.metalworking.add(bit);model.add(groups.metalworking);
 groups.gauge=new THREE.Group();groups.gauge.add(box(3,.12,.12,silver));for(const x of [-1.4,1.4])groups.gauge.add(box(.1,.7,.12,silver,x,-.3,0));groups.gauge.add(box(.6,.2,.4,violet,1,.1,0));model.add(groups.gauge);
 groups.press=new THREE.Group();for(const x of [-1,1])groups.press.add(box(.17,1.7,.25,silver,x,.8,0));groups.press.add(box(2.2,.25,.65,silver,0,1.7,0));groups.press.add(box(1.2,.2,.8,violet,0,.6,0));model.add(groups.press);
 groups.furnace=new THREE.Group();groups.furnace.add(box(1.5,1.2,1.1,silver,0,.6,0));groups.furnace.add(box(.9,.7,.03,material(0xe6a46b,{metalness:0,emissive:0x98401a,emissiveIntensity:.5}),0,.6,.57));model.add(groups.furnace);
 groups.magnetizer=new THREE.Group();const field=ring(5.8,3.1,5.4,2.7,.8,.5,violet);groups.magnetizer.add(field);model.add(groups.magnetizer);
 for(let id of ['drawingDie','metalworking','gauge','press','furnace','magnetizer']){identify(groups[id],id);groups[id].scale.setScalar(.04);groups[id].traverse(o=>{if(o.isMesh){o.material.opacity=0;o.material.transparent=true;o.castShadow=false;}});}
}
export {renderer,scene,camera,model,groups,raycaster,webgl};
