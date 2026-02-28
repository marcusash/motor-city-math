// gp-2235: All inputs must have label or placeholder (at least one for Kai readability)
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  let ok=true;
  d.questions.forEach(q=>{
    (q.inputs||[]).forEach(inp=>{
      if(inp.type==='dropdown'||inp.type==='radio')return; // these use options[], not label/placeholder
      const hasLabel=inp.label&&inp.label.trim()!=='';
      const hasPlaceholder=inp.placeholder&&inp.placeholder.trim()!=='';
      if(!hasLabel&&!hasPlaceholder){ok=false;failures.push(d.exam_id+' Q'+q.number+' '+inp.id+' has no label or placeholder');}
    });
  });
  if(ok)pass++; else fail++;
}
console.log('gp-2235-input-label-or-placeholder: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All inputs have label or placeholder');
