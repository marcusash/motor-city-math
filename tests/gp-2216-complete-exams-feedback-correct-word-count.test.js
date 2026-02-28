// gp-2216: feedback_correct word count ADHD guard -- max 25 words per ADHD design spec
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
const MAX_WORDS=25;
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  let ok=true;
  d.questions.forEach(q=>{
    const words=(q.feedback_correct||'').split(/\s+/).filter(Boolean).length;
    if(words>MAX_WORDS){ok=false;failures.push(d.exam_id+' Q'+q.number+' feedback_correct='+words+' words (max '+MAX_WORDS+')');}
  });
  if(ok)pass++; else fail++;
}
console.log('gp-2216-feedback-correct-word-count: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All feedback_correct within '+MAX_WORDS+' word ADHD limit');
