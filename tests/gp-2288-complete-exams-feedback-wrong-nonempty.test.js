// gp-2288: All questions have non-empty feedback_wrong
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  for(const q of d.questions){
    if(!q.feedback_wrong||q.feedback_wrong.trim().length===0){fail++;failures.push(d.exam_id+' Q'+q.number+' feedback_wrong missing/empty');}
    else pass++;
  }
}
console.log('gp-2288-feedback-wrong-nonempty:',pass+' pass,',fail+' fail');
if(fail>0){failures.slice(0,5).forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All feedback_wrong are non-empty');
