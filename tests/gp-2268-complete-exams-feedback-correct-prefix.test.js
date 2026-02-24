// gp-2268: Check for redundant feedback_correct starting with 'Correct!'
// These are informational only - not a hard fail
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,warn=0;const warnings=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  d.questions.forEach(q=>{
    const fb=q.feedback_correct||'';
    if(fb.startsWith('Correct!')||fb.startsWith('Correct.')){warn++;warnings.push(d.exam_id+' Q'+q.number);}
    else pass++;
  });
}
console.log('gp-2268-feedback-correct-prefix:',pass+' ok, '+warn+' with redundant prefix');
if(warn>0){console.log('INFO: '+warn+' feedbacks start with Correct! (informational, not a fail)');}
console.log('OK -- feedback_correct prefix check complete');
