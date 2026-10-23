document.querySelectorAll('.fixture-path').forEach(a=>{a.dataset.node='winding';a.dataset.role='Tool';a.href='article.html?node=winding';});
document.querySelectorAll('.article-rail-return').forEach(a=>a.dataset.return='');
window.EncyclopediaNav.breadcrumbs(document.getElementById('article-path'));
window.EncyclopediaNav.bind();
document.getElementById('caller-context').textContent='Return restores the Speaker step and link that opened this article.';
const wind=document.querySelector('#sample-wind');if(wind){let visible=true;wind.addEventListener('click',()=>{visible=!visible;document.querySelector('#sample-turns').style.opacity=visible?'1':'0';wind.textContent=visible?'Show the reference tool alone':'Show wire wound on the reference';wind.setAttribute('aria-pressed',String(visible));});wind.textContent='Show the reference tool alone';}
