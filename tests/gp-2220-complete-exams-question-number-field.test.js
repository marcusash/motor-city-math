// gp-2220: All questions have number field as integer 1-15 (in order)
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  let ok=true;
  d.questions.forEach((q,idx)=>{
    if(!Number.isInteger(q.number)||q.number<1||q.number>15){ok=false;failures.push(d.exam_id+' idx'+idx+' number='+q.number);}
  });
  if(ok)pass++; else fail++;
}
console.log('gp-2220-question-number-field: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All question number fields are valid integers 1-15');
