(() => {
 'use strict';
 const $ = id => document.getElementById(id), clamp = (n,a=0,b=1) => Math.max(a,Math.min(b,n)), ease = n => { n=clamp(n); return n*n*(3-2*n); };
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const steps = [...document.querySelectorAll('.story-step')], rail = [...document.querySelectorAll('.step-rail a')];
 const poses = [
  ['FIXED SYSTEM','Make a place for movement.','The magnet and iron stay still.','Tap a part to see what it contributes.'],
  ['MOVING ASSEMBLY','Two parts. One movement.','Bond the coil to the diaphragm.','Copper carries current. The film moves air.'],
  ['CENTER & SEAL','Leave room to move.','Keep the coil clear of the fixed iron.','Dashed purple lines are a temporary alignment tool.'],
  ['ELECTRICITY → SOUND','Now, make it move.','The coil and diaphragm move together.','Motion is exaggerated and slowed for clarity.'],
  ['PART OF THE PHONE','A voice for the sound system.','A finished module fits into its parent.','Explore the material, energy and equipment branches.']
 ];
 let phase=0, current=0, previous=-1, playing=false, startTime=0, raf=0, manualMotion=false, lastFocus=null, selected=null, branch=false,entering=false;
 const transform = (id,x,y,scale=1) => $(id).setAttribute('transform', `translate(${x} ${y}) scale(${scale})`);
 const opacity = (id,n) => { const el=$(id),hidden=n<.12;el.setAttribute('opacity',clamp(n));el.style.pointerEvents=hidden?'none':'auto';el.setAttribute('aria-hidden',String(hidden));if(el.matches('[data-inspect]'))el.setAttribute('tabindex',hidden?'-1':'0');el.querySelectorAll('[data-inspect]').forEach(child=>child.setAttribute('tabindex',hidden?'-1':'0')); };
 function scrollState() {
  if(entering)return;
  const mobile=innerWidth<=760, line=mobile?innerHeight*.78:innerHeight*.55;
  let index=0, local=0;
  steps.forEach((step,i) => {const r=step.getBoundingClientRect(); if(r.top<=line){index=i;local=clamp((line-r.top)/r.height);}});
  current=index; phase=Math.min(4,index+local);
  if(reduced.matches) phase=index+(local>.5?1:0);
  if(index!==previous){
   const p=poses[index]; $('stage-mode').textContent=p[0];$('stage-title').textContent=p[1];$('stage-subtitle').textContent=p[2];$('stage-note').textContent=p[3];$('stage-count').textContent=index===4?'✓ COMPLETE':`0${index+1} / 04`;
   rail.forEach((a,i)=>{a.classList.toggle('active',i===Math.min(index,3)); if(i===Math.min(index,3))a.setAttribute('aria-current','step');else a.removeAttribute('aria-current');});
   if(previous>=0)$('live-status').textContent=index===4?'Speaker complete. It fits in the phone sound system.':`Step ${index+1}: ${steps[index].querySelector('h2').innerText.replace(/\s+/g,' ')}`;
   previous=index;
  }
  draw(performance.now());
 }
 function draw(now) {
  const p=phase, magnet=ease(p), join=ease(p-1), align=ease(p-2), test=ease(p-3), fit=ease((p-3.62)/.38);
  $('speaker-diagram').setAttribute('viewBox',innerWidth<=760&&p<3.62?`120 ${10+150*align} 560 ${460-150*align}`:'0 0 800 570');
  transform('frame-part',0,110*(1-magnet));
  transform('magnet-part',0,-108*(1-magnet));
  opacity('frame-part',.25+.75*magnet);opacity('magnet-part',.4+.6*magnet);
  const joinedY=-128*(1-align), wave=(playing&&p>2.55&&!reduced.matches?Math.sin((now-startTime)/320)*8:0);
  transform('moving-system',0,joinedY+wave);
  transform('membrane-part',0,-66*(1-join));
  transform('coil-part',0,14*(1-join));
  opacity('moving-system',p<.82?.05:clamp((p-.82)*4));
  opacity('materials-part',.8*align+.2*test);
  opacity('fixtures-part',ease((p-1.72)*2)*(1-ease((p-2.65)*3)));
  opacity('gap-highlight',ease((p-1.85)*3)*(1-test));
  opacity('signal-part',test*(1-fit));
  opacity('magnet-label',(1-fit)*(p<1.2?1:.45));
  opacity('coil-label',(1-fit)*(p>1.1&&p<2.7?1:.15));transform('coil-label',0,joinedY+14*(1-join));
  $('moving-label').textContent=p>3.1?'Coil + diaphragm move together':'Diaphragm + surround';
  opacity('ground-shadow',1-fit);opacity('phone-context',fit);
  // The section becomes a compact module at the phone's bottom edge.
  const scale=1-.7*fit;transform('assembly-model',280*fit,295*fit,scale);
  $('moving-label').style.opacity=String(1-fit);
  const percent=Math.round(clamp(p/4)*100);$('assembly-percent').textContent=`${percent}%`;$('assembly-progress').style.width=`${percent}%`;
  $('sound-waves').style.opacity=playing?String(.45+.55*(Math.sin((now-startTime)/320)+1)/2):'.7';
  if(playing&&p>2.55&&!reduced.matches){raf=requestAnimationFrame(draw);}else raf=0;
 }
 function setMotion(value){
  if(reduced.matches)value=false;playing=value;startTime=performance.now();$('motion-toggle').setAttribute('aria-pressed',String(value));$('motion-toggle').disabled=reduced.matches;$('story-motion').disabled=reduced.matches;$('motion-toggle').innerHTML=reduced.matches?'Motion reduced':value?'<span aria-hidden="true">Ⅱ</span> Pause motion':'<span aria-hidden="true">▶</span> Try the motion';$('story-motion').innerHTML=reduced.matches?'Motion reduced by your preference':value?'Pause the moving assembly <span aria-hidden="true">Ⅱ</span>':'Try the moving assembly <span aria-hidden="true">↗</span>';
  cancelAnimationFrame(raf);draw(performance.now());
 }
 $('motion-toggle').addEventListener('click',()=>{manualMotion=true;if(current<3&&!playing){steps[3].scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});}setMotion(!playing);});
 $('story-motion').addEventListener('click',()=>{manualMotion=true;setMotion(!playing);});
 let scheduled=false; addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;cancelAnimationFrame(raf);scrollState();if(current===3&&!manualMotion&&!reduced.matches)setMotion(true);});}},{passive:true});
 addEventListener('resize',scrollState);reduced.addEventListener('change',()=>{setMotion(false);scrollState();});
 const nodes={
  magnet:{type:'PART GROUP · FIXED',title:'Magnet + soft iron',description:'A permanent magnet provides the magnetic field. Soft-iron pieces guide its flux across the air gap. This group remains stationary.',requirement:'Step 1 needs a permanent magnet and shaped soft-iron flux pieces. Neither belongs to the moving assembly.',relation:'Speaker › contains › Magnet + soft iron',branch:'Magnet and soft-iron manufacture'},
  frame:{type:'PART GROUP · STRUCTURE',title:'Frame + rear enclosure',description:'The frame supports and locates the assembly. The rear acoustic enclosure defines the air volume behind the diaphragm; it affects acoustic loading.',requirement:'Step 1 needs a frame and rear enclosure. Step 3 bonds the compliant surround to the frame.',relation:'Speaker › contains › Frame + rear enclosure',branch:'Frame and acoustic enclosure manufacture'},
  membrane:{type:'PART GROUP · MOVING',title:'Diaphragm + surround',description:'The thin diaphragm pushes and pulls the air. Its compliant surround supports the outer edge and allows the center to move.',requirement:'Step 2 bonds the coil to the diaphragm. Step 3 secures the surround to the frame. Both travel with the moving coil.',relation:'Speaker › contains › Diaphragm + surround',branch:'Diaphragm and compliant surround manufacture'},
  coil:{type:'PART · MOVING',title:'Insulated copper voice coil',description:'Current through the wire produces electrodynamic force in the magnetic gap. The insulation prevents adjacent turns from shorting together.',requirement:'Step 2 requires insulated copper wire and a winding fixture. Step 3 places the coil in the gap with room to move.',relation:'Speaker › contains › Voice coil',branch:'Insulated copper wire and coil manufacture'},
  fixture:{type:'TOOL GROUP · USED TO MAKE',title:'Winding + alignment fixtures',description:'A winding fixture shapes and holds the coil. An alignment fixture centers the moving assembly in the magnetic gap while bonding is completed.',requirement:'Used in steps 2 and 3, then removed. These tools help make the speaker; they are not contained in the finished module.',relation:'Speaker › used to make › Winding + alignment fixtures',branch:'Winding and alignment fixture manufacture'},
  materials:{type:'ASSEMBLY MATERIALS · PHYSICAL',title:'Adhesive, leads + terminals',description:'Adhesive bonds the coil to the diaphragm and the surround to the frame. Flexible leads and terminals provide the electrical connection without preventing motion.',requirement:'Steps 2–3 need suitable adhesive; step 4 needs flexible leads and electrical terminals. This is an explicitly grouped materials node.',relation:'Speaker › contains › Assembly materials',branch:'Adhesive, flexible leads and terminal manufacture'},
  test:{type:'TOOL GROUP · USED TO TEST',title:'Test equipment',description:'A meter checks continuity and DC resistance. A microphone and audio analyzer check the acoustic response and listen for rubbing or buzz.',requirement:'Step 4 needs a meter plus acoustic measurement equipment. An audio current source is a separate signal and energy dependency.',relation:'Speaker › used to test › Test equipment',branch:'Meter, microphone and audio analyzer manufacture'},
  power:{type:'ENERGY + SIGNAL · DEPENDENCY',title:'Audio current source',description:'A signal generator and amplifier can drive a changing current through the coil. The changing force moves the coil and attached diaphragm.',requirement:'Step 4 requires an audio signal and powered current drive. A meter alone cannot demonstrate acoustic output. No current source is contained in this speaker.',relation:'Speaker › powered and driven by › Audio current source',branch:'Audio signal, amplification and power dependencies'}
 };
 const inspector=$('inspector');
 function clearSelection(){document.querySelectorAll('.diagram-part.selected').forEach(el=>el.classList.remove('selected'));$('speaker-diagram').classList.remove('isolated');$('path-extra').replaceChildren();}
 function pathExtra(relation,title){$('path-extra').replaceChildren();const sep=document.createElement('span'),r=document.createElement('small'),n=document.createElement('b');sep.textContent='›';r.textContent=relation;n.textContent=title;n.style.fontWeight='600';$('path-extra').append(sep,r,n);document.querySelector('.path').scrollLeft=9999;}
 const childPages={coil:'coil',fixture:'fixture',power:'power'};
 function childUrl(id,step){const back=`index.html#step-${step}`;return `branch.html?page=${childPages[id]}&from=speaker&step=${step}&back=${encodeURIComponent(back)}`;}
 function saveCaller(back){try{sessionStorage.setItem('scroll-return:'+back,String(scrollY));}catch{}}
 function enterChild(url,id,back){if(entering)return;saveCaller(back);setMotion(false);cancelAnimationFrame(raf);entering=true;document.body.classList.add('child-entering');$('speaker-diagram').classList.remove('isolated');$('speaker-diagram').classList.add('entering-child');document.querySelectorAll('.diagram-part').forEach(el=>el.classList.toggle('entering-selected',el.dataset.inspect===id));const target=document.querySelector(`g[data-inspect="${id}"]`);target?.setAttribute('opacity','1');if(id==='coil')transform('moving-system',0,0);$('stage-mode').textContent=id==='fixture'?'ENTER TOOL CHILD':'ENTER COMPONENT / DEPENDENCY';$('stage-title').textContent=id==='coil'?'Follow the voice coil.':id==='fixture'?'Follow the fixture.':'Follow the energy source.';$('stage-subtitle').textContent='The chosen requirement stays. Its parent context recedes.';$('stage-note').textContent='Opening a child journey · your return position is saved.';pathExtra(id==='fixture'?'used to make':'dependency',nodes[id].title);setTimeout(()=>location.assign(url),reduced.matches?0:900);}
 document.querySelectorAll('button[data-inspect]').forEach(el=>{const id=el.dataset.inspect;if(!childPages[id])return;const step=Number(el.closest('.story-step')?.dataset.step??current)+1,link=document.createElement('a');link.href=childUrl(id,step);link.className=el.className+' demo-path';link.innerHTML=el.innerHTML+' <span class="path-cue">TRY PATH</span>';link.title='Open this child journey';link.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey)return;e.preventDefault();enterChild(link.href,id,`index.html#step-${step}`);});el.replaceWith(link);});
 document.querySelectorAll('g[data-inspect]').forEach(el=>{if(childPages[el.dataset.inspect]){el.classList.add('demo-target');el.setAttribute('role','link');el.setAttribute('aria-label',`Try this path: ${nodes[el.dataset.inspect].title}`);}});
 function inlineInfo(id,trigger){const n=nodes[id];if(!n)return;document.querySelectorAll('.inline-detail').forEach(el=>el.remove());clearSelection();$('speaker-diagram').classList.add('isolated');document.querySelectorAll(`.diagram-part[data-inspect="${id}"]`).forEach(el=>el.classList.add('selected'));if(trigger?.tagName.toLowerCase()==='g'){$('stage-subtitle').textContent=n.description;$('stage-note').textContent=n.type+' · '+n.title;return;}const panel=document.createElement('aside');panel.className='inline-detail';panel.setAttribute('role','note');const type=document.createElement('small'),heading=document.createElement('strong'),desc=document.createElement('p'),requirement=document.createElement('p'),closeInfo=document.createElement('button');type.textContent=n.type;heading.textContent=n.title;desc.textContent=n.description;requirement.textContent=n.requirement;closeInfo.textContent='Close detail';closeInfo.addEventListener('click',()=>{panel.remove();clearSelection();trigger?.focus({preventScroll:true});});panel.append(type,heading,desc,requirement,closeInfo);const host=trigger?.closest('p')||trigger;host?.insertAdjacentElement('afterend',panel);}
 function inspect(id,trigger){
  if(childPages[id]){const step=Math.min(4,current+1);enterChild(childUrl(id,step),id,`index.html#step-${step}`);return;}
  inlineInfo(id,trigger);return;
  const n=nodes[id];if(!n)return;selected=id;branch=false;lastFocus=document.activeElement;clearSelection();$('inspect-type').textContent=n.type;$('inspect-title').textContent=n.title;$('inspect-description').textContent=n.description;$('inspect-relation').textContent=n.relation;$('inspect-requirement').textContent=n.requirement;$('inspect-extra').replaceChildren();$('return-button').textContent='Return to Speaker';$('branch-button').style.display='flex';$('branch-button').innerHTML=(id==='power'?'Explore this dependency':'Explore how it is made')+' <span aria-hidden="true">↗</span>';
  const matches=[...document.querySelectorAll(`.diagram-part[data-inspect="${id}"]`)];if(matches.length){$('speaker-diagram').classList.add('isolated');matches.forEach(el=>el.classList.add('selected'));}
  pathExtra(n.type.includes('TOOL')?'used to make':id==='power'?'driven by':'part of',n.title);$('inspect-path-current').textContent=n.title;inspector.showModal();
 }
 function close(){inspector.close();clearSelection();if(lastFocus)lastFocus.focus({preventScroll:true});selected=null;}
 document.querySelectorAll('[data-inspect]').forEach(el=>{el.addEventListener('click',()=>inspect(el.dataset.inspect,el));if(el.tagName.toLowerCase()==='g')el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inspect(el.dataset.inspect,el);}});});
 $('close-inspector').addEventListener('click',close);$('inspect-speaker').addEventListener('click',close);$('return-button').addEventListener('click',()=>branch&&selected?inspectReturn():close());inspector.addEventListener('cancel',()=>clearSelection());inspector.addEventListener('click',e=>{if(e.target===inspector){const r=inspector.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
 function inspectReturn(){const id=selected,saved=lastFocus;inspect(id);lastFocus=saved;}
 $('branch-button').addEventListener('click',()=>{if(!selected)return;if(selected==='coil'||selected==='power'){const target=selected==='coil'?'coil':'power',step=selected==='coil'?2:4;location.href=`branch.html?page=${target}&from=speaker&step=${step}&back=${encodeURIComponent('index.html#step-'+step)}`;return;}branch=true;const n=nodes[selected];$('inspect-type').textContent='DEPENDENCY BRANCH · PREVIEW BOUNDARY';$('inspect-title').textContent=n.branch;$('inspect-description').textContent='This requirement is visible, but its manufacture is not authored in this preview yet.';$('inspect-requirement').textContent='The current prototype includes the speaker, insulated wire and coil, electrorefining, accessible ore extraction, shared electricity and a bounded chip-exposure equipment group. Further tool and material manufacture remains a prerequisite.';$('branch-button').style.display='none';$('return-button').textContent='← Return to part inspection';pathExtra('dependency branch',n.branch);$('inspect-path-current').textContent=n.branch;$('inspect-title').focus();});
 document.querySelectorAll('[data-context]').forEach(el=>el.addEventListener('click',()=>{
  lastFocus=document.activeElement;selected=null;branch=false;clearSelection();$('inspect-type').textContent='PARENT CONTEXT · CONTAINS';$('inspect-title').textContent=el.dataset.context==='phone'?'Where the speaker belongs':'The phone’s sound system';$('inspect-relation').textContent='Smartphone › contains › Sound system › contains › Speaker';$('inspect-description').textContent='The speaker is one component in a sound system. An audio amplifier drives it; an acoustic outlet connects its moving air to the world.';$('inspect-requirement').textContent='This is parent context. Chip-exposure equipment is a separate tool dependency used in phone-chip manufacturing; it is not contained in the speaker.';$('inspect-path-current').textContent='Parent context';$('inspect-extra').innerHTML='<div class="context-map"><span>Smartphone</span><i>contains ↓</i><span>Sound system</span><i>contains ↓</i><span class="map-speaker">Speaker · this component</span></div><div class="dependency-gallery"><a href="branch.html?page=lithography&from=speaker&step=5&back=index.html%23step-5"><small>SMARTPHONE → CHIP MANUFACTURE USES</small>Chip-exposure equipment ↗</a></div>';$('branch-button').style.display='none';$('return-button').textContent='Return to Speaker';inspector.showModal();
 }));
 inspector.addEventListener('close',()=>{$('return-button').textContent='Return to Speaker';clearSelection();});
 document.querySelectorAll('.dependency-gallery a').forEach(link=>link.addEventListener('click',()=>{const q=new URL(link.href).searchParams;saveCaller(q.get('back')||'index.html#step-5');}));
 function restoreCaller(){const key='scroll-return:index.html'+location.hash;try{const saved=sessionStorage.getItem(key);if(saved!==null){sessionStorage.removeItem(key);requestAnimationFrame(()=>requestAnimationFrame(()=>{scrollTo({top:Number(saved),behavior:'instant'});scrollState();}));}}catch{}}
 addEventListener('load',restoreCaller);setMotion(false);scrollState();
})();
