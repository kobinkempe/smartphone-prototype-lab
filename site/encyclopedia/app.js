const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const items={
 diaphragm:{n:'01',name:'Diaphragm + surround',description:'A thin film moves the air. Its compliant edge anchors it to the frame while letting the center travel.',nodes:['film']},
 coil:{n:'02',name:'Copper voice coil',description:'Insulated wire forms a light coil. Force on the wire carries motion into the bonded diaphragm.',nodes:['coil']},
 magnetic:{n:'03',name:'Magnetic assembly',description:'Two distinct parts: the permanent magnet supplies the field, and the iron pole and return parts guide its flux into the coil’s air gap. Each has its own making article below.',nodes:['magnet','iron']},
 frame:{n:'04',name:'Frame + rear chamber',description:'The frame holds the fixed system and anchors the surround. The rear chamber helps define the acoustic system.',nodes:['frame']}
};
let selectedPart='diaphragm';
function selectPart(key){if(!items[key])return;selectedPart=key;try{sessionStorage.setItem('encyclopedia-part',key);}catch{}const d=items[key];$('#part-number').textContent=d.n;$('#part-name').textContent=d.name;$('#part-description').textContent=d.description;
 $$('.part-list button').forEach(b=>{const active=b.dataset.part===key;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 $$('.svg-hotspot,.image-hotspot').forEach(b=>b.classList.toggle('selected',b.dataset.part===key));
 $$('.layer').forEach(layer=>{layer.classList.toggle('selected',layer.dataset.layer===key);layer.classList.toggle('dim',layer.dataset.layer!==key);});
 $('#part-actions').hidden=key==='magnetic';$('#magnetic-making-paths').hidden=key!=='magnetic';
 if(key!=='magnetic')$('#part-actions').innerHTML=d.nodes.map(node=>`<a class="soft-button" data-node="${node}" href="${window.EncyclopediaNav.ordinaryHref(node)}">Open how it is made ↗</a>`).join('');window.EncyclopediaNav.bind();
}
document.addEventListener('click',event=>{const part=event.target.closest('[data-part]');if(part&&!part.matches('a')){if(part.closest('#zoom-stage'))$('#zoom-dialog').close();selectPart(part.dataset.part);}const close=event.target.closest('[data-close]');if(close)close.closest('dialog').close();});
document.addEventListener('keydown',event=>{const part=event.target.closest('.svg-hotspot');if(part&&!part.matches('a')&&(event.key==='Enter'||event.key===' ')){event.preventDefault();part.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
$$('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}}));
let diagramMode='illustration';
function setDiagram(mode){diagramMode=mode;try{sessionStorage.setItem('encyclopedia-diagram',mode);}catch{}$('#warm-figure').hidden=mode!=='illustration';$('#schematic-figure').hidden=mode!=='schematic';$$('[data-diagram]').forEach(b=>{const active=b.dataset.diagram===mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});$('#figure-caption').textContent=mode==='illustration'?'An illustrated concept. Numbers select a layer; linked parts open their making articles.':'An interactive schematic. Slide from assembled to exploded to compare the layers.';}
$$('[data-diagram]').forEach(button=>button.addEventListener('click',()=>setDiagram(button.dataset.diagram)));
let mechanismMode='cutaway';
function setMechanism(mode){mechanismMode=mode;$('#cutaway-figure').hidden=mode!=='cutaway';$('#motion-diagram').hidden=mode!=='motion';$$('[data-mechanism]').forEach(b=>{const active=b.dataset.mechanism===mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});updateMotionButton();}
$$('[data-mechanism]').forEach(b=>b.addEventListener('click',()=>setMechanism(b.dataset.mechanism)));
const layerOffsets={diaphragm:267,coil:166,magnetic:70,frame:0};
function updateExplosion(value){
 const collapsed=1-Number(value)/100;
 $$('.layer', $('#exploded')).forEach(layer=>layer.setAttribute('transform',`translate(0 ${layerOffsets[layer.dataset.layer]*collapsed})`));
 const yOffsets={diaphragm:267,coil:166,magnetic:70,frame:0};
 $$('.svg-hotspot',$('#exploded')).forEach(node=>node.setAttribute('transform',`translate(0 ${yOffsets[node.dataset.part]*collapsed})`));
}
$('#explode-range').addEventListener('input',event=>updateExplosion(event.target.value));
$('#zoom-button').addEventListener('click',()=>{
 const clone=$(diagramMode==='illustration'?'#warm-figure':'#exploded').cloneNode(true);clone.removeAttribute('id');clone.setAttribute('aria-label','Enlarged speaker layers');
 // Unique SVG definitions prevent a second copy from shadowing the main figure.
 const suffix='-zoom';$$('[id]',clone).forEach(el=>{el.id+=suffix;});$$('*',clone).forEach(el=>{for(const attr of [...el.attributes]){if(attr.value.includes('url(#'))el.setAttribute(attr.name,attr.value.replace(/url\(#([^)]+)\)/g,(_,id)=>`url(#${id}${suffix})`));}});
 clone.removeAttribute('aria-labelledby');$('#zoom-stage').replaceChildren(clone);$('#zoom-range').value='100';$('#zoom-value').textContent='1×';clone.style.width='100%';$('#zoom-dialog').showModal();
});
$('#zoom-range').addEventListener('input',event=>{const value=+event.target.value;$('#zoom-stage > *').style.width=value+'%';$('#zoom-value').textContent=(value/100).toFixed(1)+'×';});
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let playing=!reducedMotion.matches,phase=0,amplitude=.6,lastFrame=0,showForce=true;
function updateMotionButton(){$('#motion-toggle').textContent=mechanismMode==='cutaway'?'Watch the motion ▷':playing?'Pause the motion Ⅱ':'Play the motion ▷';$('#motion-toggle').setAttribute('aria-pressed',String(playing&&mechanismMode==='motion'));}
updateMotionButton();
$('#motion-toggle').addEventListener('click',()=>{if(mechanismMode==='cutaway'){playing=true;setMechanism('motion');}else{playing=!playing;updateMotionButton();}});
$('#amplitude').addEventListener('input',event=>{amplitude=+event.target.value/100;$('#amplitude-value').textContent=event.target.value+'%';if(!playing)renderMotion();});
$('#force-toggle').addEventListener('click',()=>{showForce=!showForce;$('#force-arrows').style.display=showForce?'':'none';$('#force-toggle').textContent=showForce?'Hide force arrows':'Show force arrows';$('#force-toggle').setAttribute('aria-pressed',String(showForce));});
function renderMotion(){
 const value=Math.sin(phase),shift=-value*15*amplitude;
 $('#moving-system').setAttribute('transform',`translate(0 ${shift.toFixed(2)})`);
 $('#flexible-film').setAttribute('d',`M75 ${116-shift}Q89 ${100-shift} 103 ${117-shift}T130 ${116-shift}L177 95H383L430 ${116-shift}Q444 ${132-shift} 458 ${115-shift}T486 ${116-shift}`);
 const from=165+value*20,to=165-value*20;$('#force-left').setAttribute('d',`M161 ${from}V${to}`);$('#force-right').setAttribute('d',`M398 ${from}V${to}`);
 $('#current-state').textContent=amplitude===0?'motion size set to zero':value>.15?'forward →':value<-.15?'reverse ←':'near zero';
}
let visible=true;document.addEventListener('visibilitychange',()=>{visible=!document.hidden;});
function animate(time){if(lastFrame&&playing&&visible){phase+=(Math.min(time-lastFrame,50)/1000)*2.1;renderMotion();}lastFrame=time;requestAnimationFrame(animate);}
renderMotion();requestAnimationFrame(animate);
reducedMotion.addEventListener('change',event=>{if(event.matches){playing=false;updateMotionButton();}});
const observed=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){$$('.rail a').forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id));}}},{rootMargin:'-15% 0px -65% 0px',threshold:0});
$$('#overview,#motion,#assembly,.step-section').forEach(section=>observed.observe(section));
let fluxPlaying=!reducedMotion.matches;
function updateFlux(){$('.flux-line').classList.toggle('flowing',fluxPlaying);$('#flux-toggle').textContent=fluxPlaying?'Pause flux guide Ⅱ':'Trace the field path ▷';$('#flux-toggle').setAttribute('aria-pressed',String(fluxPlaying));}
$('#flux-toggle').addEventListener('click',()=>{fluxPlaying=!fluxPlaying;updateFlux();});updateFlux();
let joined=false;$('#join-toggle').addEventListener('click',()=>{
 joined=!joined;$('#join-coil').style.transform=joined?'translateY(94px)':'';$('#join-guide').style.opacity=joined?'0':'1';$('#bond-ring').style.opacity=joined?'0':'.8';
 $('#join-toggle').textContent=joined?'Separate the parts ↑':'Join the parts ↓';$('#join-toggle').setAttribute('aria-pressed',String(joined));$('#join-caption').textContent=joined?'Bonded together → one moving diaphragm-and-coil assembly.':'Separate parts → a coil, a membrane and a controlled bond.';
});
function updateAlignment(value){
 const offset=+value;$('#align-moving').setAttribute('transform',`translate(${offset} 0)`);
 const near=Math.abs(offset)>10;$('#align-moving').style.opacity=near?'.75':'1';
 $('#alignment-message').textContent=near?'Too far off center: one side approaches the fixed iron. Return to center.':offset===0?'Centered: the coil has clearance on both sides.':'Slight offset: clearances become uneven. Center before sealing.';
 $('#alignment-message').style.color=near?'#b05d32':'#087781';
}
$('#alignment').addEventListener('input',event=>updateAlignment(event.target.value));
$('#center-button').addEventListener('click',()=>{$('#alignment').value='0';updateAlignment(0);});
const tests={
 continuity:{display:'DC Ω',equipment:'meter',note:'A meter checks continuity and DC resistance. No resistance target is specified in this conceptual model.',trace:'M154 239H387',sound:false},
 movement:{display:'~ audio',equipment:'signal + amplifier',note:'A controlled audio current checks free movement and unwanted rubbing or buzzing. Trace is illustrative.',trace:'M154 239Q163 216 173 239T192 239T211 239T230 239T249 239T268 239T287 239T306 239T325 239T344 239T363 239T384 239',sound:true},
 response:{display:'sweep ↗',equipment:'signal + amplifier',note:'A measured frequency response is compared with the design’s target. This schematic curve is not test data.',trace:'M154 246L176 245Q191 245 200 239T221 239Q239 222 254 231T279 235Q300 226 322 238T348 239L384 246',sound:true}
};
function setTest(key){const test=tests[key];$$('[data-test]').forEach(button=>{const active=button.dataset.test===key;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});$('#test-display').textContent=test.display;$('#test-equipment-label').textContent=test.equipment;$('#test-trace').setAttribute('d',test.trace);$('#test-note').textContent=test.note;$('#sound-waves').style.opacity=test.sound?'1':'.12';$('#test-mic').style.opacity=test.sound?'1':'.35';$$('.audio-device,.audio-drive-path').forEach(el=>el.style.opacity=test.sound?'1':'.35');$$('.meter-device,.meter-drive-path').forEach(el=>el.style.opacity=test.sound?'.4':'1');}
$$('[data-test]').forEach(button=>button.addEventListener('click',()=>setTest(button.dataset.test)));setTest('continuity');
reducedMotion.addEventListener('change',event=>{if(event.matches){fluxPlaying=false;updateFlux();}});

function addToolActor(step,node,markup,restTransform){
 const svg=$('#'+step+' .assembly-svg');if(!svg)return;svg.setAttribute('role','group');const actor=document.createElementNS('http://www.w3.org/2000/svg','a');actor.dataset.node=node;actor.dataset.role='Tool';actor.setAttribute('class','working-tool');actor.setAttribute('href',window.EncyclopediaNav.ordinaryHref(node));actor.innerHTML='<title>Open how to make '+window.EncyclopediaData[node].name+'</title>'+markup;actor.setAttribute('transform',restTransform);svg.append(actor);
 const controls=document.createElement('div');controls.className='tool-use-controls';controls.innerHTML='<a class="workspace-tool inline-link tool-link" data-node="'+node+'" href="'+window.EncyclopediaNav.ordinaryHref(node)+'"><small class="role-hint">Tool</small>'+window.EncyclopediaData[node].name+' ↗</a><button type="button" aria-pressed="false">Place tool at the work ↓</button>';
 svg.after(controls);let working=false;controls.querySelector('button').addEventListener('click',event=>{working=!working;actor.setAttribute('transform',working?'translate(0 0)':restTransform);actor.classList.toggle('at-work',working);event.currentTarget.textContent=working?'Return tool to the workspace ↑':'Place tool at the work ↓';event.currentTarget.setAttribute('aria-pressed',String(working));});
}
addToolActor('step-1','alignment','<path d="M75 82V211H416V82M75 97H92M400 97H416" fill="none" stroke="#ae934c" stroke-width="3" stroke-dasharray="5 3"/><rect x="48" y="109" width="25" height="34" rx="4" fill="#e9ddb6" stroke="#a88d45"/><rect x="417" y="109" width="25" height="34" rx="4" fill="#e9ddb6" stroke="#a88d45"/>','translate(0 24)');
addToolActor('step-2','winding','<ellipse cx="245" cy="82" rx="96" ry="17" fill="#d9dfca" stroke="#8e9678"/><path d="M142 81H130V107M347 81H360V107" stroke="#b29b5d" fill="none" stroke-width="3"/>','translate(-70 110)');
addToolActor('step-3','alignment','<path d="M155 94V172M330 94V172" stroke="#b29b5d" stroke-width="4"/><path d="M149 93H161M324 93H336" stroke="#b29b5d" stroke-width="3"/>','translate(-80 63)');
window.EncyclopediaNav.breadcrumbs($('#article-path'));try{const part=sessionStorage.getItem('encyclopedia-part');if(items[part])selectPart(part);const mode=sessionStorage.getItem('encyclopedia-diagram');if(mode==='schematic')setDiagram(mode);}catch{}window.EncyclopediaNav.bind();
