// gp-2285: All solution steps are non-empty strings
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  for(const q of d.questions){
    for(let i=0;i<(q.solution_steps||[]).length;i++){
      const step=q.solution_steps[i];
      if(typeof step==='string'&&step.trim().length>0)pass++;
      else{fail++;failures.push(d.exam_id+' Q'+q.number+' step['+i+']: '+(typeof step==='string'?'"'+step+'"':typeof step));}
    }
  }
}
console.log('gp-2285-solution-steps-nonempty:',pass+' pass,',fail+' fail');
if(fail>0){failures.slice(0,5).forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All solution steps are non-empty strings');
