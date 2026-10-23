const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const nodes = {
  magnet: {name:'Magnet + soft-iron flux path',type:'PART · FIXED SYSTEM',role:'The permanent magnet supplies a field. The soft-iron yoke and pole plate guide that field across a narrow air gap. These parts stay still.',requirements:'Permanent-magnet material, soft iron, shaped pole surfaces and dimensional control. Their separate making paths are not included yet.',steps:[0,2,3]},
  film: {name:'Diaphragm + compliant surround',type:'PART · MOVING ASSEMBLY',role:'A thin membrane moves the air. Its flexible surround connects the moving center to the fixed frame and permits a small back-and-forth motion.',requirements:'A thin formed film and a compliant edge with a controlled stiffness. This is an honest grouped part: diaphragm plus surround.',steps:[1,2,3]},
  coil: {name:'Insulated copper voice coil',type:'PART · MOVING ASSEMBLY',role:'An insulated copper winding is bonded to the diaphragm. Audio current in the coil interacts with the magnetic field, moving the coil and diaphragm together.',requirements:'Copper wire, electrical insulation, a controlled winding shape and flexible electrical connections.',steps:[1,2,3]},
  frame: {name:'Frame + rear acoustic chamber',type:'PART · STRUCTURE',role:'The frame holds the fixed system and supports the surround. The rear chamber provides a defined air volume behind the diaphragm; its geometry affects the speaker response.',requirements:'A shaped rigid frame, a rear enclosure and controlled sealing. Frame and chamber are explicitly grouped for this conceptual preview.',steps:[0,2,3]},
  fixtures: {name:'Winding + alignment fixtures',type:'TOOL · USED TO MAKE',role:'A winding fixture holds the coil’s shape. An alignment fixture centers the moving coil in the magnetic gap while the surround and adhesive secure it. The fixtures are removed after assembly.',requirements:'Controlled geometry for winding and temporary centering. These two fixtures are grouped as one tool node.',steps:[1,2]},
  materials: {name:'Assembly materials',type:'MATERIAL · PART OF ASSEMBLY',role:'This group contains adhesive, flexible leads and electrical terminals. Adhesive joins the coil to the film and seals the surround; leads and terminals connect the moving coil to the outside circuit.',requirements:'Compatible adhesive, flexible lead conductors, insulation and terminals. Each remains a separate underlying requirement within this visible group.',steps:[1,2,3]},
  test: {name:'Test equipment',type:'TOOL · USED TO TEST',role:'A meter checks DC resistance and continuity. A test signal setup and acoustic measurement check free motion, rubbing or buzzing and the sound response.',requirements:'A resistance/continuity meter, an audio stimulus setup and acoustic measurement equipment. These are grouped as one tool node.',steps:[3]},
  power: {name:'Audio signal + current source',type:'ENERGY / SIGNAL · USED TO TEST',role:'An electrical audio signal drives current through the coil. Reversing the current reverses the force, so the diaphragm can move back and forth and produce sound.',requirements:'A controlled audio signal and a current-driving source, such as a suitable audio amplifier. This is a dependency of the test, not a physical part contained in the speaker.',steps:[3]}
};
const node = (id,label,type='PART') => `<button class="node ${type.toLowerCase()} ${id==='coil'||(id==='fixtures'&&label.includes('winding'))?'demo-path':''}" data-inspect="${id}"><span class="type">${type}</span>${label}<span aria-hidden="true">↗</span>${id==='coil'||(id==='fixtures'&&label.includes('winding'))?'<span class="path-cue">Try this path</span>':''}</button>`;
const steps = [
  {category:'THE FIXED SYSTEM',title:'Build a home for the magnetic field.',lede:'Start with the parts that stay still. They create the field the moving coil will work inside.',recipe:`<p>Fit the ${node('magnet','magnet + iron')} into the ${node('frame','frame + chamber')}. Leave a precise, open <strong>magnetic air gap</strong> around the pole plate.</p>`,science:'A permanent magnet provides the magnetic field. Soft iron guides the flux through a narrow air gap. The coil will sit in that gap with clearance to move, rather than touching the fixed surfaces.',result:'A stable magnetic system with a clear path for the coil.',caption:'The parts, before they become a speaker.',status:'Fixed parts, ready to assemble'},
  {category:'THE MOVING ASSEMBLY',title:'Give the membrane a copper heartbeat.',lede:'Two light parts become one moving assembly. The coil will push and pull the membrane.',recipe:`<p>Shape the ${node('coil','insulated coil')} with ${node('fixtures','winding fixture','TOOL')}. Use ${node('materials','adhesive','MATERIAL')} to bond it to the ${node('film','diaphragm + surround')}.</p>`,science:'The thin diaphragm moves the surrounding air. Its copper coil adds moving mass, so the bond must transmit force while the assembly remains light. The compliant surround allows the central diaphragm to travel.',result:'A diaphragm and insulated coil that move together.',caption:'The coil meets the diaphragm. A moving pair.',status:'Joining the moving assembly'},
  {category:'ALIGNMENT & SEALING',title:'Center the coil. Leave room to move.',lede:'Lower the moving assembly into the fixed system. The tiny clearance is the key.',recipe:`<p>Use the ${node('fixtures','alignment fixture','TOOL')} to center the ${node('coil','coil')} in the gap. Bond and seal the ${node('film','surround')} to the ${node('frame','frame')} with ${node('materials','adhesive','MATERIAL')}, then remove the fixture.</p>`,science:'The coil needs clearance from both the pole plate and the outer iron return. The flexible surround supports it without locking it in place. The diagram shows the principle with exaggerated dimensions.',result:'A centered, sealed assembly that can move freely.',caption:'Separated layers become a single assembly.',status:'Centered in the gap · free to move'},
  {category:'CONNECTIONS & VERIFICATION',title:'Connect. Move. Listen.',lede:'Now the electrical signal can become sound. Check the path, the movement and the response.',recipe:`<p>Connect the ${node('materials','leads + terminals','MATERIAL')}. Use ${node('test','meter + acoustic setup','TOOL')} and an ${node('power','audio current source','ENERGY')} to check continuity, DC resistance, free motion, rub-buzz and acoustic response.</p>`,science:'Current in the magnetic field creates force on the coil. The coil and diaphragm move together while the magnet remains still. Real micro-speakers have mechanical travel and thermal limits; this animation is a conceptual demonstration, not a test recipe.',result:'A speaker whose electrical and mechanical behavior has been checked.',caption:'The moving assembly turns current into sound.',status:'Audio current → motion → sound'}
];
let current = 0;
let view = 'exploded';
let lastTrigger = null;
const dialog = $('#inspector');
function setStep(index,reveal=true) {
  current = Math.max(0,Math.min(3,index));
  const s = steps[current];
  $('#step-num').textContent = String(current+1).padStart(2,'0');
  $('#step-category').textContent = s.category;
  $('#step-title').textContent = s.title;
  $('#step-lede').textContent = s.lede;
  $('#step-recipe').innerHTML = s.recipe;
  $('#step-science').textContent = s.science;
  $('#step-result').textContent = s.result;
  $('#diagram-caption').textContent = s.caption;
  $('#stage-status').textContent = view==='section'?'Coil inside the gap · fixed magnetic system':s.status;
  $('#stage').dataset.step = current;
  $('#prev').disabled = current === 0;
  $('#next').innerHTML = current === 3 ? 'Replay <span aria-hidden="true">↺</span>' : 'Next <span aria-hidden="true">→</span>';
  $$('[data-step]').filter(el=>el.tagName==='BUTTON').forEach(button=> {
    const n=Number(button.dataset.step);
    if(n===current)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
    button.classList.toggle('complete',n<current);
  });
  $('#why').open=false;
  $('#diagram-desc').textContent = `${s.title} ${s.lede} Click a diagram part to inspect its role and its dependencies.`;
  if(reveal && window.matchMedia('(max-width:760px)').matches){
    $('.step-kicker').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  }
}
function setView(nextView) {
  view=nextView;$('#stage').dataset.view=view;
  $('#exploded-diagram').setAttribute('aria-hidden',String(view!=='exploded'));
  $('#section-diagram').setAttribute('aria-hidden',String(view!=='section'));
  $$('#exploded-diagram [data-part]').forEach(part=>part.setAttribute('tabindex',view==='exploded'?'0':'-1'));
  $$('#section-diagram [data-part]').forEach(part=>part.setAttribute('tabindex',view==='section'?'0':'-1'));
  $('#exploded-btn').classList.toggle('active',view==='exploded');
  $('#section-btn').classList.toggle('active',view==='section');
  $('#exploded-btn').setAttribute('aria-pressed',view==='exploded');
  $('#section-btn').setAttribute('aria-pressed',view==='section');
  $('#diagram-title').textContent = view==='exploded'?'Exploded conceptual smartphone speaker':'Cross-section of the speaker magnetic air gap';
  $('#stage-status').textContent = view==='section'?'Coil inside the gap · fixed magnetic system':steps[current].status;
  $('.tap-hint').innerHTML=view==='exploded'?'Tap a numbered part to explore ↗':'Tap a part to explore ↗';
}
function showDialog(html,trigger) {
  lastTrigger=trigger || document.activeElement;
  $('#inspector-content').innerHTML=html;
  if(!dialog.open) dialog.showModal();
  $('.close').focus();
}
const path = (relation,name) => `<div class="dependency-path"><button class="path-link" data-context="smartphone">Smartphone</button><span aria-hidden="true">›</span><button class="path-link" data-context="sound">Sound system</button><span aria-hidden="true">›</span><button class="path-link" data-return>Speaker</button><span class="link-relation">${relation}</span><strong>${name}</strong></div>`;
function inspect(id,trigger) {
  const n=nodes[id];if(!n)return;
  const relation=['fixtures','test'].includes(id)?'uses tool':id==='power'?'uses energy / signal':'contains';
  const needed=n.steps.includes(current);
  showDialog(`${path(relation,n.name)}<span class="inspector-type">${n.type}</span><h2 id="inspector-title">${n.name}</h2><p>${n.role}</p><div class="inspection-requirement"><strong>${needed?'REQUIRED IN THIS STEP':'PART OF THE FULL SPEAKER'}</strong><p>${needed?`Step ${current+1}: ${steps[current].title}`:`Used in ${n.steps.map(s=>'step '+(s+1)).join(', ')}.`}</p><p>${n.requirements}</p></div><div class="preview-scope"><strong>Making path: awaiting prototype approval.</strong><br>This panel inspects a requirement inside the speaker. Its own manufacturing page is not included in this first-component preview.</div><button class="return-button" data-return>Back to the speaker <span aria-hidden="true">↩</span></button>`,trigger);
}
function context(id,trigger){
  const isPhone=id==='smartphone';
  showDialog(`<span class="inspector-type">${isPhone?'PRODUCT CONTEXT':'SUBSYSTEM CONTEXT'}</span><h2 id="inspector-title">${isPhone?'A place in the phone.':'The sound system.'}</h2><p>The speaker belongs to the sound system, which belongs to the smartphone. This tracker keeps that physical hierarchy visible as you explore.</p><div class="inventory"><div class="inventory-row">Smartphone <span>PRODUCT</span></div><div class="inventory-row">↳ Sound system <span>SUBSYSTEM · PART OF SMARTPHONE</span></div><button class="inventory-row" data-return>↳ Speaker <span>COMPONENT · YOU ARE HERE ↩</span></button></div><div class="preview-scope">The Speaker is the only component authored in this preview. The rest of the phone’s manufacturing journey is not included yet.</div><button class="return-button" data-return>Return to Speaker ↩</button>`,trigger);
}
function inventory(trigger){
  showDialog(`<span class="inspector-type">13 MEANINGFUL NODES</span><h2 id="inspector-title">One component. Its requirements.</h2><p>The four assembly steps are processes. Parts and assembly materials belong to the speaker; tools and the audio current source are external dependencies.</p><div class="inventory"><div class="inventory-row">Speaker <span>COMPONENT · 1 NODE</span></div><div class="inventory-row">4 assembly steps <span>PROCESS · 4 NODES</span></div>${Object.entries(nodes).map(([id,n])=>`<button class="inventory-row" data-inspect="${id}">${n.name}<span>${n.type.split(' · ')[0]} ↗</span></button>`).join('')}</div><button class="return-button" data-return>Back to the speaker ↩</button>`,trigger);
}
$('#prev').addEventListener('click',()=>setStep(current-1));
function nextStep(){if(current===3){setView('exploded');setStep(0);}else setStep(current+1);}
$('#next').addEventListener('click',nextStep);
$('#exploded-btn').addEventListener('click',()=>setView('exploded'));
$('#section-btn').addEventListener('click',()=>setView('section'));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
function pauseMotion(paused){$('#stage').classList.toggle('paused',paused);$('#motion-btn').setAttribute('aria-pressed',String(!paused));$('#motion-btn').setAttribute('aria-label',paused?'Play diagram motion':'Pause diagram motion');$('#motion-btn').innerHTML=paused?'<span aria-hidden="true">▷</span> Play':'<span aria-hidden="true">Ⅱ</span> Pause';}
pauseMotion(reduced.matches);
$('#motion-btn').addEventListener('click',()=>pauseMotion(!$('#stage').classList.contains('paused')));
reduced.addEventListener('change',()=>pauseMotion(reduced.matches));
$('#all-parts').addEventListener('click',e=>inventory(e.currentTarget));
$('#sources-btn').addEventListener('click',e=>showDialog(`<span class="inspector-type">MODEL & SOURCE NOTES</span><h2 id="inspector-title">A concept you can see.</h2><p>This diagram represents an electrodynamic micro-speaker, rather than one manufacturer’s exact geometry. Dimensions, movement and the magnetic gap are enlarged for clarity. The steps explain assembly relationships; they are not fabrication instructions.</p><p>Physics is informed by KLIPPEL’s transducer simulation and identification documentation: electrical stimulus, voice-coil displacement, moving mass and mechanical / thermal limits.</p><div class="source-links"><a href="https://docs.klippel.de/db-lab/latest/simulation-auralisation/lsim/lsim.html" target="_blank" rel="noopener">KLIPPEL · Linear simulation ↗</a><a href="https://docs.klippel.de/db-lab/latest/transducer-parameter-identification/lsi3/lsi3.html" target="_blank" rel="noopener">KLIPPEL · Large signal identification ↗</a></div><button class="return-button" data-return>Back to the speaker ↩</button>`,e.currentTarget));
document.addEventListener('click',e=>{
  const part=e.target.closest('[data-inspect],[data-part]');
  if(part){inspect(part.dataset.inspect||part.dataset.part,part);return;}
  const contextEl=e.target.closest('[data-context]');
  if(contextEl){e.preventDefault();context(contextEl.dataset.context,contextEl);return;}
  if(e.target.closest('[data-return]')){dialog.close();return;}
  const step=e.target.closest('button[data-step]');if(step)setStep(Number(step.dataset.step));
});
document.addEventListener('keydown',e=>{
  const part=e.target.closest('[data-part]');
  if(part&&(e.key==='Enter'||e.key===' ')){e.preventDefault();inspect(part.dataset.part,part);return;}
  if(dialog.open||e.target.closest('button,a,summary,input'))return;
  if(e.key==='ArrowRight'){e.preventDefault();nextStep();}
  if(e.key==='ArrowLeft'){e.preventDefault();setStep(current-1);}
});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>lastTrigger?.focus());
setStep(0,false);
setView('exploded');
