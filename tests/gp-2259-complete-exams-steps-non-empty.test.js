// gp-2259: All solution_steps are non-empty strings
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  let ok=true;
  d.questions.forEach(q=>{
    (q.solution_steps||[]).forEach((s,i)=>{
      if(typeof s!=='string'||s.trim()===''){ok=false;failures.push(d.exam_id+' Q'+q.number+' step['+i+']='+JSON.stringify(s));}
    });
  });
  if(ok)pass++; else fail++;
}
console.log('gp-2259-solution-steps-non-empty: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All solution steps are non-empty strings');
