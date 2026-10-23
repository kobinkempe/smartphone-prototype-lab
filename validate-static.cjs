const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const root=path.join(__dirname,'site');
const errors=[];let files=0,scripts=0;
function visit(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){
 const p=path.join(dir,item.name);if(item.isDirectory()){visit(p);continue;}files++;
 if(p.endsWith('.html')){
  const s=fs.readFileSync(p,'utf8');
  for(const m of s.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/g)){
   const ref=m[1];if(/^(?:https?:|data:|mailto:|#|javascript:)/.test(ref))continue;
   const pathname=ref.split(/[?#]/)[0];if(!pathname)continue;
   let target=pathname.startsWith('/')?path.join(root,pathname):path.resolve(path.dirname(p),pathname);
   if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
   if(!fs.existsSync(target))errors.push(path.relative(root,p)+' missing '+ref);
  }
  if(!/<meta[^>]+name=["']viewport/.test(s))errors.push(path.relative(root,p)+' missing viewport');
 }
 if(/\.m?js$/.test(p)&&!/^three\./.test(item.name)){
  scripts++;const r=cp.spawnSync(process.execPath,['--check',p],{encoding:'utf8'});if(r.status!==0)errors.push(path.relative(root,p)+' syntax: '+r.stderr);
 }
}}
visit(root);console.log(JSON.stringify({files,scripts,errors},null,2));if(errors.length)process.exitCode=1;
