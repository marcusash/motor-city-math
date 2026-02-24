// gp-2207: All 15-question exams have feedback_correct and feedback_wrong on every question
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  let ok=true;
  d.questions.forEach(q=>{
    if(!q.feedback_correct||q.feedback_correct.trim()===''){ok=false;failures.push(d.exam_id+' Q'+q.number+' missing feedback_correct');}
    if(!q.feedback_wrong||q.feedback_wrong.trim()===''){ok=false;failures.push(d.exam_id+' Q'+q.number+' missing feedback_wrong');}
  });
  if(ok)pass++; else fail++;
}
console.log('gp-2207-all-questions-have-feedback: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All questions have feedback_correct and feedback_wrong');
