// gp-2227: Q1 type snapshot -- OLDER(RP1-7,RP12)=identify, NEWER(RP8-11)=quadratic
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const OLDER=['retake-practice-1','retake-practice-2','retake-practice-3','retake-practice-4','retake-practice-5','retake-practice-6','retake-practice-7','retake-practice-12'];
const NEWER=['retake-practice-8','retake-practice-9','retake-practice-10','retake-practice-11'];
let pass=0,fail=0;const failures=[];
for(const exam_id of OLDER){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  const q1=d.questions.find(q=>q.number===1);
  if(q1.type==='identify')pass++;else{fail++;failures.push(exam_id+' Q1='+q1.type+' (expected identify)');}
}
for(const exam_id of NEWER){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  const q1=d.questions.find(q=>q.number===1);
  if(q1.type==='quadratic')pass++;else{fail++;failures.push(exam_id+' Q1='+q1.type+' (expected quadratic)');}
}
console.log('gp-2227-q1-type-snapshot: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Q1 type snapshot: OLDER=identify, NEWER=quadratic');
