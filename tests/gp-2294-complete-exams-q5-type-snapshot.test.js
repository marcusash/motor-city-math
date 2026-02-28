// gp-2294: Q5 type snapshot across all complete exams
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const EXPECTED={
  'retake-practice-1':'quadratic','retake-practice-2':'quadratic','retake-practice-3':'quadratic',
  'retake-practice-4':'quadratic','retake-practice-5':'quadratic','retake-practice-6':'exponential',
  'retake-practice-7':'quadratic','retake-practice-8':'quadratic','retake-practice-9':'quadratic',
  'retake-practice-10':'quadratic','retake-practice-11':'quadratic','retake-practice-12':'quadratic'
};
let pass=0,fail=0;const failures=[];
for(const[exam_id,exp] of Object.entries(EXPECTED)){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  const q5=d.questions.find(q=>q.number===5);
  if(q5.type===exp)pass++;else{fail++;failures.push(exam_id+' Q5 type='+q5.type+' expected '+exp);}
}
console.log('gp-2294-q5-type-snapshot:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Q5 type snapshot locked (RP1-5,RP7-12=quadratic, RP6=exponential)');
