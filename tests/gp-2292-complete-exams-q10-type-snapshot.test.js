// gp-2292: Q10 type snapshot across all complete exams
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const EXPECTED={
  'retake-practice-1':'extraneous','retake-practice-2':'extraneous','retake-practice-3':'extraneous',
  'retake-practice-4':'extraneous','retake-practice-5':'extraneous','retake-practice-6':'extraneous',
  'retake-practice-7':'exponential','retake-practice-8':'exponential','retake-practice-9':'exponential',
  'retake-practice-10':'exponential','retake-practice-11':'exponential','retake-practice-12':'extraneous'
};
let pass=0,fail=0;const failures=[];
for(const[exam_id,exp] of Object.entries(EXPECTED)){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  const q10=d.questions.find(q=>q.number===10);
  if(q10.type===exp)pass++;else{fail++;failures.push(exam_id+' Q10 type='+q10.type+' expected '+exp);}
}
console.log('gp-2292-q10-type-snapshot:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Q10 type snapshot locked');
