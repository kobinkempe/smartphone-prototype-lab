(() => {
 const nav=window.EncyclopediaNav,nodeKey=nav.key,data=window.EncyclopediaData[nodeKey]||window.EncyclopediaData.wire;
 if(nodeKey==='speaker'||nodeKey==='coil'){location.replace(nav.ordinaryHref(nodeKey)+location.search);return;}
 document.title=data.name+' — The Phone Encyclopedia';
 document.getElementById('article-kicker').textContent='How to make · '+data.role;
 document.getElementById('article-title').innerHTML=data.title||data.name;
 document.getElementById('article-name').textContent=data.name;
 document.getElementById('caller-context').textContent=nodeKey==='phone'?'Root article':'Called from '+(nav.labels[nav.caller]||window.EncyclopediaData[nav.caller]?.name||nav.caller);
 const link=node=>{const d=window.EncyclopediaData[node];return `<a data-node="${node}" data-role="${d?.role||'Part'}" class="inline-link ${d?.role==='Tool'?'tool-link':'part-link'}" href="${nav.ordinaryHref(node)}"><small class="role-hint">${d?.role||'Part'}</small>${d?.name||node}<span aria-hidden="true"> ↗</span></a>`;};
 const imageKeys=new Set(['magnet','iron','wire','film','frame']);
 const cutaway=nodeKey==='magnet'||nodeKey==='iron';
 const heroFigure=imageKeys.has(nodeKey)?`<figure class="warm-figure article-object-figure"><img src="${cutaway?'realistic-cutaway.png':'warm-speaker.png'}" width="${cutaway?'1536':'1254'}" height="${cutaway?'1024':'1254'}" alt="Illustrated speaker, providing the parent context for ${data.name}."><span class="object-focus focus-${nodeKey}" aria-hidden="true"></span><figcaption class="caption">${data.name} in the speaker context.</figcaption></figure>`:`<figure class="article-diagram tbd-diagram"><svg viewBox="0 0 430 260" role="img" aria-label="Conceptual ${data.name} making diagram, still to be developed"><path d="M70 78L276 47L355 94L148 130Z" fill="#e6e0d3" stroke="#8d927c"/><path d="M70 78V150L148 198L355 162V94L148 130Z" fill="#cbd0bd" stroke="#8d927c"/><path d="M121 76L263 56L308 84L165 108Z" fill="#f6f0df" stroke="#c2b898" stroke-dasharray="4 4"/><path d="M125 54V28M320 79V53" stroke="#b7a06b" stroke-width="4"/><text x="215" y="233" text-anchor="middle" fill="#78806b" font-size="14">Making diagram · TBD</text></svg></figure>`;
 document.getElementById('article-hero').innerHTML=heroFigure+`<div><p>${data.intro}</p><div class="article-relationship">${data.role==='Tool'?'This page makes the tool. Its use belongs in the calling making step.':'This page makes a physical part or input for the caller.'}</div>${nodeKey==='phone'?link('speaker'):''}</div>`;
 const steps=document.getElementById('article-steps'), side=document.getElementById('article-nav');
 data.steps.forEach(([title,body,parts,tools],index)=>{
  const id='making-step-'+(index+1),actualParts=parts.filter(n=>n!==nodeKey),actualTools=tools.filter(n=>n!==nodeKey);
  const section=document.createElement('section');section.className='article-step';section.id=id;
  section.innerHTML=`<div class="article-diagram tbd-diagram"><svg viewBox="0 0 430 215" role="img" aria-label="Stage ${index+1} diagram: ${title}. Detailed design-specific figure is TBD."><path d="M65 90L161 71L207 97L111 117Z" fill="#e4dfd2" stroke="#999c87"/><path d="M65 90V124L111 151L207 132V97L111 117Z" fill="#c8cfba" stroke="#999c87"/><path d="M227 105H274M265 99L275 105L265 111" stroke="#b49b5f" stroke-width="2" fill="none"/><rect x="300" y="74" width="62" height="68" rx="9" fill="#f4ecd7" stroke="#b5a26a"/><path d="M315 90H348M315 105H348M315 120H337" stroke="#bbad84"/><text x="215" y="189" text-anchor="middle" fill="#8a8977" font-size="12">Stage ${index+1} · detailed diagram TBD</text></svg></div><div><p class="step-kicker">Making step ${index+1}</p><h2>${title}</h2><p>${body}</p>${actualParts.length?`<p>Start with ${actualParts.map(link).join(', ')}.</p>`:''}${actualTools.length?`<p>Make or check this stage with ${actualTools.map(link).join(', ')}.</p>`:''}</div>`;
  steps.append(section);const a=document.createElement('a');a.className='stepnav';a.href='#'+id;a.innerHTML=`<span>${index+1}</span>${title}`;side.append(a);
 });
 if(nodeKey==='phone'){document.querySelectorAll('[data-return],.caller-bar').forEach(el=>el.hidden=true);document.querySelector('.child-return').hidden=true;}
 if(nodeKey==='magnet')document.querySelector('.source-note p').innerHTML='Conceptual making overview informed by <a href="https://www.arnoldmagnetics.com/resources/magnet-manufacturing-process/" target="_blank" rel="noreferrer">Arnold Magnetic Technologies</a> and <a href="https://www.tdk.com/en/tech-mag/ferrite02/001" target="_blank" rel="noreferrer">TDK’s hard-ferrite explanation</a>. Different material systems need different manufacturing routes.';
 nav.breadcrumbs(document.getElementById('article-path'));nav.bind();
})();
