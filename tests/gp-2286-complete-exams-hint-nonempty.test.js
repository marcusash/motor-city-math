// gp-2286: All question hints are non-empty strings
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  for(const q of d.questions){
    if(q.hint==null){fail++;failures.push(d.exam_id+' Q'+q.number+' hint is null/undefined');}
    else if(typeof q.hint!=='string'||q.hint.trim().length===0){fail++;failures.push(d.exam_id+' Q'+q.number+' hint empty');}
    else pass++;
  }
}
console.log('gp-2286-hint-nonempty:',pass+' pass,',fail+' fail');
if(fail>0){failures.slice(0,5).forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All hints are non-empty strings');
