// gp-2271: OLDER exams Q14 type snapshot
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const EXPECTED={
  'retake-practice-1':'multiple-choice','retake-practice-2':'multiple-choice',
  'retake-practice-3':'multiple-choice','retake-practice-4':'multiple-choice',
  'retake-practice-5':'error-analysis','retake-practice-6':'construct',
  'retake-practice-7':'multiple-choice','retake-practice-12':'multiple-choice'
};
let pass=0,fail=0;const failures=[];
for(const[exam_id,exp] of Object.entries(EXPECTED)){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  const q14=d.questions.find(q=>q.number===14);
  if(q14.type===exp)pass++;else{fail++;failures.push(exam_id+' Q14 type='+q14.type+' expected '+exp);}
}
console.log('gp-2271-older-q14-type-snapshot:',pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- OLDER exams Q14 type snapshot locked');
