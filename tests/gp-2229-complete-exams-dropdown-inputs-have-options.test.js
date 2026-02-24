// gp-2229: All dropdown-type inputs must have a non-empty options array
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
      if(inp.type==='dropdown'){
        if(!inp.options||!Array.isArray(inp.options)||inp.options.length===0){
          ok=false;failures.push(d.exam_id+' Q'+q.number+' '+inp.id+' dropdown missing options');
        }
      }
    });
  });
  if(ok)pass++; else fail++;
}
console.log('gp-2229-dropdown-inputs-have-options: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All dropdown inputs have non-empty options array');
