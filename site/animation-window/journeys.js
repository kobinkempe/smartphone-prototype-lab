/* Bounded, illustrative child journeys. No manufacturing process is presented as complete. */
const speakerSetStep = setStep;
const speakerSetView = setView;
const speakerIntro = $('.intro').innerHTML;
const speakerLegend = $('.legend').innerHTML;
const speakerBelow = $('.below-note').innerHTML;
const speakerTracker = $('.tracker').innerHTML;
const speakerFooter = $('footer').innerHTML;
let activeJourney = 'speaker';
let parents = [];
let entering = false;
const sampleButton=(id,label,type='PART')=>`<button class="node ${type.toLowerCase()} demo-path" data-inspect="${id}"><span class="type">${type}</span>${label}<span aria-hidden="true">↗</span><span class="path-cue">Try this path</span></button>`;
const sampleSteps = {
  coil: [
    {short:'Wire',category:'START WITH A CONDUCTOR',title:'A coil starts as one continuous wire.',lede:'A long, thin conductor will become many neighboring turns. The insulation keeps those turns electrically separate.',recipe:`<p>Explore the ${sampleButton('wire','insulated copper wire')}. It remains one continuous electrical path as its shape changes.</p>`,science:'This is a navigation stand-in. The diagram distinguishes the conductive copper core from its insulating outer layer; no dimensions, chemistry or fabrication settings are specified.',result:'A continuous, insulated conductor.',caption:'One wire. Copper inside, insulation outside.',status:'PART · belongs to the speaker'},
    {short:'Wind',category:'SHAPE WITH A TEMPORARY TOOL',title:'Wind the wire around a controlled shape.',lede:'The fixture holds the geometry while the wire forms a compact loop.',recipe:`<p>A ${sampleButton('fixtures','winding fixture','TOOL')} supports the coil during winding. This tool helps make the part; it does not remain inside the speaker.</p>`,science:'The animation demonstrates the relationship between a wire, a temporary form and a finished coil. An actual process would need validated material and geometry specifications.',result:'Neighboring insulated turns in a repeatable shape.',caption:'Wire winds around the temporary form.',status:'TOOL DEPENDENCY · winding fixture'},
    {short:'Release',category:'THE TOOL LEAVES THE PART',title:'Release the coil. Keep the winding together.',lede:'The coil leaves its form and continues into the speaker assembly. The tool stays behind.',recipe:'<p>The finished shape is the <strong>voice coil</strong>. Back returns you to the same speaker step and diagram view.</p>',science:'In the speaker, the coil is joined to the diaphragm and positioned in the magnetic gap. This stand-in stops at the navigation handoff rather than specifying a full production process.',result:'A moving part, ready to return to its parent assembly.',caption:'The winding stays. The temporary form recedes.',status:'PART · return to the speaker assembly'}
  ],
  fixtures: [
    {short:'Form',category:'A TOOL, NOT A SPEAKER PART',title:'Give the wire a shape to follow.',lede:'A winding form defines the loop while the conductor is wound around it.',recipe:'<p>The shaped form is a <strong>temporary tool surface</strong>. It belongs to the making process, not to the finished speaker.</p>',science:'This is a stand-in for a tool-making path. A real tool depends on the required coil geometry and process; this preview does not specify fabrication settings.',result:'A form that represents the intended winding shape.',caption:'A shaped form, shown apart from its support.',status:'TOOL · used to make the voice coil'},
    {short:'Hold',category:'SUPPORT & ALIGNMENT',title:'Hold the form steady for winding.',lede:'A support locates the form so its position can be controlled while the wire is added.',recipe:'<p>The form and its holder work as one fixture. The drawing separates their roles: <strong>shape the loop</strong> and <strong>hold the shape</strong>.</p>',science:'The tool is grouped honestly: a form plus a supporting holder. An alignment fixture for centering the coil in the speaker is a different tool within the broader fixture group.',result:'A supported winding form.',caption:'Form + holder become a working fixture.',status:'EXTERNAL DEPENDENCY · removed after use'},
    {short:'Use',category:'MAKE A PART, THEN LET IT GO',title:'Wind the coil. Withdraw the form.',lede:'The copper winding is the output. The fixture remains available to make another coil.',recipe:'<p>Watch the part separate from the tool. Back returns to the parent exactly where you entered this sample.</p>',science:'The fixture is used to make the coil. The finished coil becomes part of the speaker; the fixture does not. This is the dependency relationship this sample makes visible.',result:'A reusable tool and a separate coil.',caption:'The part leaves. The tool remains.',status:'TOOL → used to make → VOICE COIL'}
  ],
  wire: [
    {short:'Core',category:'A MATERIAL WITH TWO ROLES',title:'Copper carries the current.',lede:'At the center of the wire is a continuous copper conductor.',recipe:'<p>This grandchild path belongs to the voice coil. The enlarged wire section exposes the conductor rather than adding another speaker assembly.</p>',science:'This is an illustrative stand-in, not a raw-material extraction or wire-drawing recipe.',result:'A continuous conducting core.',caption:'An enlarged section of a copper conductor.',status:'MATERIAL · part of the voice coil'},
    {short:'Insulate',category:'KEEP THE TURNS SEPARATE',title:'An insulating layer surrounds the core.',lede:'When wire touches neighboring turns, the outer layer separates their conducting surfaces.',recipe:'<p>The diagram separates <strong>copper</strong> from <strong>electrical insulation</strong>. Both requirements belong to the insulated wire.</p>',science:'The two layers have different roles. Copper conducts; insulation separates. This sample does not specify the coating material or a coating process.',result:'A conductor with electrical insulation.',caption:'Copper core + insulating outer layer.',status:'MATERIAL · copper and insulation'},
    {short:'Coil',category:'RETURN TO THE NEXT SCALE',title:'One wire becomes a coil with many turns.',lede:'The same continuous wire can now be followed into the voice coil’s winding step.',recipe:'<p>Back restores the exact voice-coil step you entered from. The ancestry continues through the Speaker all the way to Smartphone.</p>',science:'The grandchild journey shows how containment and process dependencies can be followed without losing the parent context.',result:'Insulated wire, ready for the coil’s winding path.',caption:'A continuous path, folded into neighboring turns.',status:'MATERIAL → part of → VOICE COIL'}
  ]
};
const journeyInfo={speaker:{name:'Speaker',relation:'contains'},coil:{name:'Copper voice coil',relation:'contains',type:'PART',title:'A loop of copper. <em>A path for current.</em>',intro:'An illustrative child journey.<br>Follow the wire, the tool and the finished winding.'},fixtures:{name:'Winding fixture',relation:'uses tool',type:'TOOL · USED TO MAKE',title:'A shape to follow. <em>A tool to leave behind.</em>',intro:'An illustrative tool dependency.<br>The fixture makes a part; it stays outside the speaker.'},wire:{name:'Insulated wire',relation:'contains',type:'MATERIAL',title:'Inside the wire. <em>Two different jobs.</em>',intro:'An illustrative grandchild journey.<br>A conductor carries current; insulation separates turns.'}};
function currentSteps(){return activeJourney==='speaker'?steps:sampleSteps[activeJourney];}
function captureState(){return {journey:activeJourney,current,view,paused:$('#stage').classList.contains('paused'),scrollY:window.scrollY,whyOpen:$('#why').open,camera:$('#speaker-svg').getAttribute('viewBox'),childCamera:$('#child-svg').getAttribute('viewBox')};}
function stepControls(){
  const list=currentSteps();
  $('.steps').innerHTML=list.map((step,i)=>`${i?'<span class="step-line"></span>':''}<button data-step="${i}" aria-label="${journeyInfo[activeJourney].name}, step ${i+1}: ${step.short||['Magnetic system','Moving assembly','Center & seal','Connect & test'][i]}" ${i===current?'aria-current="step"':''} class="${i<current?'complete':''}"><span>${String(i+1).padStart(2,'0')}</span><span class="step-nav-label">${step.short||['Magnetic system','Moving assembly','Center & seal','Connect & test'][i]}</span></button>`).join('');
  $('.assembly-nav').setAttribute('aria-label',`${journeyInfo[activeJourney].name} steps`);
  $('.steps').setAttribute('aria-label',`Jump to a ${journeyInfo[activeJourney].name} step`);
}
function updateAncestry(){
  if(activeJourney==='speaker'){$('.tracker').innerHTML=speakerTracker;return;}
  const route=[...parents.map(p=>p.journey),activeJourney];
  $('.tracker').innerHTML=`<button data-context="smartphone"><span class="crumb-icon" aria-hidden="true">▯</span>Smartphone</button><span class="relation">contains ›</span><button data-context="sound">Sound system</button><span class="relation">contains ›</span>${route.map((id,i)=>`${i?`<span class="relation ${id==='fixtures'?'tool-relation':''}">${journeyInfo[id].relation} ›</span>`:''}${i===route.length-1?`<span class="current" aria-current="page">${journeyInfo[id].name}</span>`:`<button data-parent-state="${i}">${journeyInfo[id].name}</button>`}`).join('')}<span class="tracker-tag">NAVIGATION SAMPLE</span>`;
}
function updateShell(){
  const child=activeJourney!=='speaker';
  document.body.dataset.journey=activeJourney;
  $('#journey-context').hidden=!child;
  $('#bottom-back').hidden=!child;
  $('.view-switch').hidden=child;
  $('#speaker-svg').toggleAttribute('hidden',child);
  $('#child-svg').toggleAttribute('hidden',!child);
  $('#speaker-svg').setAttribute('aria-hidden',String(child));
  $('#child-svg').setAttribute('aria-hidden',String(!child));
  if(child){
    const info=journeyInfo[activeJourney];
    $('.intro').innerHTML=`<div><p class="eyebrow">${info.type} · NAVIGATION SAMPLE</p><h1>${info.title}</h1></div><p class="intro-note">${info.intro}</p>`;
    $('#journey-back').textContent=`← Back to ${journeyInfo[parents[parents.length - 1].journey].name}`;
    $('#bottom-back').textContent=`↩ Back to ${journeyInfo[parents[parents.length - 1].journey].name}`;
    $('#journey-role').textContent=`${info.type} · ${activeJourney==='fixtures'?'EXTERNAL DEPENDENCY':'CHILD PATH'}`;
    $('#path-cues').innerHTML=activeJourney==='coil'?`<span>Try this path</span><button class="demo-path" data-inspect="wire">Insulated wire <small>MATERIAL</small> ↗</button><button class="demo-path tool" data-inspect="fixtures">Winding fixture <small>TOOL</small> ↗</button>`:'<span class="sample-inline">Illustrative stand-in · 3 steps · Back restores your parent</span>';
    $('.legend').innerHTML=activeJourney==='fixtures'?'<span><i class="teal"></i>Temporary form</span><span><i class="blue"></i>Tool holder</span><span><i class="copper"></i>Coil output</span>':'<span><i class="copper"></i>Copper conductor</span><span><i class="teal"></i>Insulation / temporary form</span>';
    $('.below-note').innerHTML=`<p><span class="tiny-tag">YOUR PATH</span>${activeJourney==='fixtures'?'Tool used to make a coil; removed after use.':'A child of '+journeyInfo[parents[parents.length - 1].journey].name+'. Your parent state is saved.'}</p><button data-journey-back>Back to ${journeyInfo[parents[parents.length - 1].journey].name} ↩</button>`;
    $('footer').innerHTML='<span>NAVIGATION SAMPLE · ILLUSTRATIVE STAND-IN CONTENT</span><span>Conceptual relationships, not a complete manufacturing process.</span>';
    $('.concept-note').textContent='Navigation sample. The process is illustrative; the parent assembly remains saved.';
    $('.tap-hint').textContent=activeJourney==='coil'?'Outlined pieces open child paths ↗':'A conceptual tool dependency';
  }else{
    $('.intro').innerHTML=speakerIntro;$('.legend').innerHTML=speakerLegend;$('.below-note').innerHTML=speakerBelow;$('footer').innerHTML=speakerFooter;
    $('#all-parts').addEventListener('click',e=>inventory(e.currentTarget));
    $('#sources-btn').addEventListener('click',()=>inlineNote('Concept notes','This conceptual electrodynamic micro-speaker uses enlarged geometry and motion. Child journeys are illustrative navigation stand-ins. Speaker physics sources: <a href="https://docs.klippel.de/db-lab/latest/simulation-auralisation/lsim/lsim.html" target="_blank" rel="noopener">KLIPPEL Linear Simulation</a> and <a href="https://docs.klippel.de/db-lab/latest/transducer-parameter-identification/lsi3/lsi3.html" target="_blank" rel="noopener">Large Signal Identification</a>.'));
    $('#path-cues').innerHTML='<span>Try this path</span><button class="demo-path" data-inspect="coil">Copper voice coil ↗</button><button class="demo-path tool" data-inspect="fixtures">Winding fixture <small>TOOL</small> ↗</button>';
    $('.concept-note').textContent='A conceptual assembly, with movement enlarged so you can see it.';
  }
  updateAncestry();stepControls();
}
setStep=function(index,reveal=true){
  const list=currentSteps();current=Math.max(0,Math.min(list.length-1,index));
  if(activeJourney==='speaker'){speakerSetStep(current,reveal);stepControls();return;}
  const s=list[current];
  $('#step-num').textContent=String(current+1).padStart(2,'0');$('#step-category').textContent=s.category;
  $('#step-title').textContent=s.title;$('#step-lede').textContent=s.lede;$('#step-recipe').innerHTML=s.recipe;
  $('#step-science').textContent=s.science;$('#step-result').textContent=s.result;$('#diagram-caption').textContent=s.caption;$('#stage-status').textContent=s.status;
  $('#stage').dataset.step=current;$('#stage').dataset.childStep=current;$('#why').open=false;
  $('#prev').disabled=current===0;$('#next').innerHTML=current===list.length-1?'Replay <span aria-hidden="true">↺</span>':'Next <span aria-hidden="true">→</span>';
  $('#child-title').textContent=`${journeyInfo[activeJourney].name}: ${s.title}`;$('#child-desc').textContent=`Illustrative navigation sample. ${s.lede}`;
  stepControls();renderChild();
  if(reveal&&window.matchMedia('(max-width:760px)').matches)$('.step-kicker').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
};
setView=function(nextView){if(activeJourney==='speaker')speakerSetView(nextView);};
nextStep=function(){if(current===currentSteps().length-1){if(activeJourney==='speaker')setView('exploded');setStep(0);}else setStep(current+1);};
function coilLoops(){return Array.from({length:9},(_,i)=>`<rect class="winding-turn" x="${212+i*3}" y="${252+i*3}" width="${336-i*6}" height="${152-i*6}" rx="${45-i*2}" fill="none" stroke="${i%2?'#efad69':'#c86f37'}" stroke-width="3"/>`).join('');}
function renderChild(){
  const wire=activeJourney==='wire',tool=activeJourney==='fixtures';
  if(wire){
    $('#child-art').innerHTML=`<g class="wire-core"><path d="M135 302H599" stroke="#bc652e" stroke-width="46" stroke-linecap="round"/><path d="M137 292H600" stroke="#f1b36f" stroke-width="13" stroke-linecap="round"/><ellipse cx="602" cy="302" rx="20" ry="23" fill="#dd904a" stroke="#9c5229" stroke-width="2"/></g><g class="wire-coating"><path d="M135 302H583" fill="none" stroke="#75c8bc" stroke-width="63" stroke-linecap="round" opacity=".5"/><ellipse cx="596" cy="302" rx="29" ry="35" fill="none" stroke="#5eaa9b" stroke-width="9"/><path d="M150 269h405" stroke="#dbfff4" stroke-width="5" stroke-linecap="round"/></g><g class="wire-to-coil">${coilLoops()}</g><g class="child-labels"><text x="380" y="170" text-anchor="middle">${current===0?'COPPER CONDUCTOR':current===1?'INSULATION SURROUNDS THE CORE':'THE SAME WIRE, MANY TURNS'}</text><path d="M380 185v65" stroke="#769399" stroke-dasharray="4 6"/><text x="380" y="474" text-anchor="middle">${current===0?'A continuous current path':current===1?'Two materials · two roles':'Back returns to the voice coil'}</text></g>`;return;
  }
  const form=`<g class="child-form"><rect x="239" y="275" width="282" height="105" rx="30" fill="#c0e9df" stroke="#5aaf9e" stroke-width="3"/><rect x="255" y="287" width="250" height="78" rx="24" fill="#e4faf3" stroke="#7ac3b3" stroke-width="2"/><path d="M261 379v18h240v-18" fill="#77b6a8" stroke="#5a9f90" stroke-width="2"/></g>`;
  const holder=`<g class="child-holder"><path d="M292 404h176l29 39H263Z" fill="#aec0da" stroke="#657fab" stroke-width="2"/><rect x="266" y="437" width="228" height="26" rx="7" fill="#7f99bc"/><path d="M319 403v-40h122v40" fill="#aebfce" stroke="#70899f" stroke-width="3"/></g>`;
  const coil=`<g class="child-winding">${coilLoops()}<path d="M214 329l-32 3-33 27 M545 329l36 3 34-20" fill="none" stroke="#c97740" stroke-width="4" stroke-linecap="round"/></g>`;
  const feed=`<g class="child-feed" role="button" tabindex="0" data-inspect="wire" aria-label="Try this path: insulated wire"><path d="M113 202C183 161 178 278 248 223S350 214 440 203H626" fill="none" stroke="#7ac8b9" stroke-width="14" stroke-linecap="round"/><path d="M113 202C183 161 178 278 248 223S350 214 440 203H626" fill="none" stroke="#dd8a48" stroke-width="8" stroke-linecap="round"/><circle cx="110" cy="202" r="25" fill="#fff8ec" stroke="#b77938" stroke-width="2"/><text x="110" y="210" text-anchor="middle" class="child-hotspot">↗</text><text x="380" y="155" text-anchor="middle" class="child-label">Insulated wire · Try this path</text></g>`;
  const fixtureTarget=!tool?`<g class="child-fixture-target" role="button" tabindex="0" data-inspect="fixtures" aria-label="Try this path: winding fixture tool"><path d="M520 340h85" stroke="#a798b9" stroke-width="2"/><circle cx="629" cy="340" r="25" fill="#f4effc" stroke="#a18cbb" stroke-width="2"/><text x="629" y="348" class="child-hotspot" text-anchor="middle">↗</text><text x="620" y="388" text-anchor="middle" class="child-label">Fixture · TOOL</text></g>`:'';
  $('#child-art').innerHTML=`${holder}${form}${coil}${tool?'':feed}${fixtureTarget}<g class="child-labels"><text x="380" y="${tool?160:510}" text-anchor="middle">${tool?['A TEMPORARY SHAPING SURFACE','FORM + HOLDER','TOOL STAYS · COIL LEAVES'][current]:['ONE CONTINUOUS INSULATED WIRE','WIRE BECOMES A WINDING','PART AND TOOL SEPARATE'][current]}</text>${tool?'<text x="380" y="530" text-anchor="middle" class="child-label">Used to make the voice coil · outside the speaker</text>':''}</g>`;
}
function enterJourney(id,trigger){
  if(entering||!sampleSteps[id]||id===activeJourney)return;
  entering=true;$('#inline-inspection').hidden=true;
  parents.push(captureState());
  if(activeJourney==='speaker'&&id==='fixtures')$('#stage').dataset.view='exploded';
  $('#stage').dataset.entering=id;$('#stage').classList.add('departing');
  $('#stage').setAttribute('aria-busy','true');
  window.setTimeout(()=>{
    activeJourney=id;current=0;view='child';
    $('#stage').classList.remove('departing');delete $('#stage').dataset.entering;
    $('#stage').dataset.view='child';$('#stage').classList.add('child-arrival');
    updateShell();setStep(0,false);$('#stage').setAttribute('aria-busy','false');
    $('.step-kicker').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
    $('#journey-back').focus({preventScroll:true});entering=false;
    window.setTimeout(()=>$('#stage').classList.remove('child-arrival'),650);
  },reduced.matches?0:650);
}
function backToParent(index=parents.length-1){
  if(entering||index<0||!parents[index])return;
  const state=parents[index];parents=parents.slice(0,index);
  activeJourney=state.journey;current=state.current;view=state.view;
  $('#inline-inspection').hidden=true;updateShell();setStep(current,false);
  if(activeJourney==='speaker'){speakerSetView(state.view);$('#speaker-svg').setAttribute('viewBox',state.camera);}else{$('#stage').dataset.view='child';$('#child-svg').setAttribute('viewBox',state.childCamera);}
  pauseMotion(state.paused);$('#why').open=state.whyOpen;
  $('#stage').classList.add('child-arrival');window.setTimeout(()=>$('#stage').classList.remove('child-arrival'),650);
  window.scrollTo({top:state.scrollY,behavior:'instant'});
}
function inlineNote(title,body){
  $('#inline-inspection').hidden=false;
  $('#inline-inspection').innerHTML=`<div><span class="inspector-type">INLINE REQUIREMENT / CONTEXT</span><h2>${title}</h2><p>${body}</p></div><button data-close-inline aria-label="Close inline details">×</button>`;
  $('#inline-inspection').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'center'});$('#inline-inspection').focus({preventScroll:true});
}
inspect=function(id,trigger){
  if(id==='fixtures'&&trigger?.textContent.includes('alignment')){inlineNote('Alignment fixture','This tool centers the moving coil in the magnetic gap and is removed after the adhesive secures the surround. The available winding-fixture sample shows a different member of this grouped tool requirement.');return;}
  if(sampleSteps[id]){enterJourney(id,trigger);return;}
  const n=nodes[id];if(n){$('#stage').dataset.focusPart=id;inlineNote(n.name,`${n.role}<br><br><strong>Requirements:</strong> ${n.requirements}<br><br>This item has inline details. Its own making journey is not part of the available navigation samples.`);}
};
context=function(id){inlineNote(id==='smartphone'?'Smartphone':'Sound system','Smartphone contains the Sound system, which contains Speaker. Follow the outlined Copper voice coil and Winding fixture paths to explore child and tool dependencies. Their ancestry stays visible, and Back restores the exact parent state.');};
inventory=function(){inlineNote('Requirements and available child paths',`<strong>Try this path:</strong> ${sampleButton('coil','Copper voice coil')} ${sampleButton('fixtures','Winding fixture','TOOL')}<br><br>The speaker has four assembly steps, four grouped parts, two grouped tools, assembly materials and an audio signal/current source. Other requirements offer inline details. The new child journeys are illustrative stand-ins.`);};
$('#journey-back').addEventListener('click',()=>backToParent());
$('#bottom-back').addEventListener('click',()=>backToParent());
document.addEventListener('click',e=>{
  if(e.target.closest('[data-journey-back]'))backToParent();
  const ancestor=e.target.closest('[data-parent-state]');if(ancestor)backToParent(Number(ancestor.dataset.parentState));
  if(e.target.closest('[data-close-inline]')){$('#inline-inspection').hidden=true;delete $('#stage').dataset.focusPart;}
});
document.addEventListener('keydown',e=>{
  const sample=e.target.closest('[data-inspect][role="button"]');
  if(sample&&(e.key==='Enter'||e.key===' ')){e.preventDefault();inspect(sample.dataset.inspect,sample);}
});
updateShell();setStep(0,false);speakerSetView('exploded');
$$('[data-part="coil"]').forEach(part=>part.setAttribute('aria-label','Try this path: Copper voice coil'));
