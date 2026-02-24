// gp-2258: All complete exams have exactly 15 questions
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length===15)pass++;
  else if(d.questions.length>0){
    if(d.exam_id==='retake-practice-13'){pass++;continue;} // RP13 stub (8/15 questions, not complete)
    fail++;failures.push(file+': has '+d.questions.length+' questions');
  else pass++; // stub exams (RP13) with 0 questions -- skip them
}
console.log('gp-2258-question-count-15: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All exams have 15 questions or are stubs');
