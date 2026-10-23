(() => {
 const query=new URLSearchParams(location.search), base=new URL('.',location.href);
 const current=document.body.dataset.node||document.body.dataset.article||'speaker';
 const aliases={fixtures:'winding'};
 const key=aliases[current]||current;
 const labels={phone:'Phone',speaker:'Speaker',coil:'Copper voice coil',wire:'Insulated wire',magnet:'Permanent magnet',iron:'Iron flux parts',winding:'Winding fixture',alignment:'Alignment fixture',meter:'Meter',signal:'Audio signal source',amplifier:'Audio amplifier',microphone:'Measurement microphone',power:'Power source'};
 const validKey=value=>/^[a-z][a-z0-9-]*$/.test(value||'');
 let trail=(query.get('trail')||'').split(',').filter(validKey);
 if(!trail.length)trail=key==='phone'?['phone']:key==='speaker'?['phone','speaker']:key==='coil'?['phone','speaker','coil']:key==='wire'?['phone','speaker','coil','wire']:['phone','speaker',key];
 if(trail.at(-1)!==key)trail.push(key);
 const fallback=key==='speaker'?'phone.html':key==='coil'?'index.html#'+(query.get('from')||'step-2'):key==='wire'?'voice-coil.html#coil-step-1':key==='phone'?null:'index.html#overview';
 const safeBack=value=>{try{const url=new URL(value,base);return url.origin===base.origin&&url.pathname.startsWith(base.pathname)&&/\/(index|voice-coil|article|phone|fixtures)\.html$/.test(url.pathname)?url:null;}catch{return null;}};
 const back=safeBack(query.get('back')||fallback), caller= query.get('caller')||trail.at(-2)||'phone';
 const bound=new WeakSet();
 const ordinaryHref=node=>node==='phone'?'phone.html':node==='speaker'?'index.html':node==='coil'?'voice-coil.html':'article.html?node='+encodeURIComponent(node);
 function childHref(node,step,focus){
  const target=ordinaryHref(node), params=new URLSearchParams(node==='phone'||node==='speaker'||node==='coil'?'':'node='+encodeURIComponent(node));
  const nextTrail=node==='wire'&&key==='speaker'?[...trail,'coil',node]:[...trail,node];params.set('trail',nextTrail.join(','));params.set('caller',key);
  const currentFile=location.pathname.split('/').at(-1)||'index.html';params.set('back',currentFile+(location.search||'')+'#'+step);params.set('focus',focus);
  return target.split('?')[0]+'?'+params;
 }
 function restore(){try{const record=JSON.parse(sessionStorage.getItem('encyclopedia-return')||'null');if(record&&record.url===location.pathname+location.search){sessionStorage.removeItem('encyclopedia-return');requestAnimationFrame(()=>{const target=document.getElementById(record.focus);if(target){target.focus({preventScroll:true});target.scrollIntoView({block:'center',behavior:'instant'});}else if(record.step)document.getElementById(record.step)?.scrollIntoView({block:'start'});});}}catch{}}
 function bind(){
  document.querySelectorAll('[data-node]').forEach((link,index)=>{if(!link.matches('a')||bound.has(link))return;bound.add(link);const node=link.dataset.node;if(!validKey(node))return;
   const section=link.closest('.step-section,.article-step'),step=section?.id||'overview';if(!link.id){const scope=section||link.closest('main')||document.body,positions=[];let element=link;while(element&&element!==scope){positions.unshift(Array.from(element.parentElement.children).indexOf(element));element=element.parentElement;}link.id='open-'+node+'-'+step+'-'+positions.join('-');}link.setAttribute('href',childHref(node,step,link.id));
   const role=link.dataset.role||window.EncyclopediaData?.[node]?.role||'Part';link.title='Open how to make '+(labels[node]||window.EncyclopediaData?.[node]?.name||node)+' · '+role;
  });
  document.querySelectorAll('[data-return],.caller-return').forEach(link=>{if(!back)return;link.href=back.pathname.split('/').at(-1)+back.search+back.hash;if(!link.closest('.breadcrumb'))link.textContent='← Return to '+(labels[caller]||window.EncyclopediaData?.[caller]?.name||caller);
   if(bound.has(link))return;bound.add(link);link.addEventListener('click',()=>{try{sessionStorage.setItem('encyclopedia-return',JSON.stringify({url:back.pathname+back.search,step:back.hash.slice(1),focus:query.get('focus')}));}catch{}});
  });restore();
 }
 function breadcrumbs(container){if(!container)return;container.replaceChildren();trail.forEach((node,index)=>{if(index){const separator=document.createElement('span');separator.className=window.EncyclopediaData?.[node]?.role==='Tool'?'path-relation':'relation';separator.textContent=separator.className==='path-relation'?'uses tool':'›';container.append(separator);}
   const name=labels[node]||window.EncyclopediaData?.[node]?.name||node;if(index===trail.length-1){const strong=document.createElement('strong');strong.textContent=name;strong.setAttribute('aria-current','page');container.append(strong);}else{const a=document.createElement('a');a.textContent=name;a.href=ordinaryHref(node);if(node===caller&&back){a.href=back.pathname.split('/').at(-1)+back.search+back.hash;a.dataset.return='';}container.append(a);}
  });}
 window.EncyclopediaNav={bind,breadcrumbs,key,trail,back,caller,labels,ordinaryHref};
})();
