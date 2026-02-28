// gp-2236: All complete exams have created_by and created fields
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  let ok=true;
  if(!d.created_by||d.created_by.trim()===''){ok=false;failures.push(d.exam_id+' missing created_by');}
  if(!d.created||d.created.trim()===''){ok=false;failures.push(d.exam_id+' missing created');}
  if(ok)pass++; else fail++;
}
console.log('gp-2236-created-by-and-date: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All exams have created_by and created fields');
