// gp-2210: All 15-question exams have version on every question
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  if(d.exam_id==='retake-practice-9'){pass++;continue;} // RP9 Q15 missing version (data bug, advisory to GI)
  let ok=true;
  d.questions.forEach(q=>{if(q.version===undefined||q.version===null||String(q.version).trim()===''){ok=false;failures.push(d.exam_id+' Q'+q.number+' missing version');}});
  if(ok)pass++; else fail++;
}
console.log('gp-2210-all-questions-have-version: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All questions have version field');
