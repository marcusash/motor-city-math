// gp-2276: Q14 input count snapshot by exam
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const EXPECTED={
  'retake-practice-1':1,'retake-practice-2':1,'retake-practice-3':1,'retake-practice-4':1,
  'retake-practice-5':1,'retake-practice-6':3,'retake-practice-7':3,'retake-practice-8':3,
  'retake-practice-9':2,'retake-practice-10':3,'retake-practice-11':5,'retake-practice-12':1
};
let pass=0,fail=0;const failures=[];
for(const[exam_id,exp] of Object.entries(EXPECTED)){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  const q14=d.questions.find(q=>q.number===14);
  const got=(q14.inputs||[]).length;
  if(got===exp)pass++;else{fail++;failures.push(exam_id+' Q14 inputs='+got+' expected '+exp);}
}
console.log('gp-2276-q14-input-count-snapshot:',pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Q14 input count snapshot locked');
