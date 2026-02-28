// gp-2287: All questions have non-empty feedback_correct
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  for(const q of d.questions){
    if(!q.feedback_correct||q.feedback_correct.trim().length===0){fail++;failures.push(d.exam_id+' Q'+q.number+' feedback_correct missing/empty');}
    else pass++;
  }
}
console.log('gp-2287-feedback-correct-nonempty:',pass+' pass,',fail+' fail');
if(fail>0){failures.slice(0,5).forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All feedback_correct are non-empty');
