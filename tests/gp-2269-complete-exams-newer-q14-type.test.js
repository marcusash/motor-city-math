// gp-2269: NEWER exams (RP8-11) Q14 type must be write-equation
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const NEWER=['retake-practice-8','retake-practice-9','retake-practice-10','retake-practice-11'];
let pass=0,fail=0;const failures=[];
for(const exam_id of NEWER){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  const q14=d.questions.find(q=>q.number===14);
  if(q14.type==='write-equation')pass++;
  else{fail++;failures.push(exam_id+' Q14 type='+q14.type+' (expected write-equation)');}
}
console.log('gp-2269-newer-q14-write-equation:',pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- NEWER exams Q14 type=write-equation');
