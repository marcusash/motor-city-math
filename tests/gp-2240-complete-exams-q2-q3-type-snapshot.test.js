// gp-2240: Section A Q2/Q3 type snapshot -- OLDER=identify, NEWER=absolute-value
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const OLDER=['retake-practice-1','retake-practice-2','retake-practice-3','retake-practice-4','retake-practice-5','retake-practice-6','retake-practice-7','retake-practice-12'];
const NEWER=['retake-practice-8','retake-practice-9','retake-practice-10','retake-practice-11'];
let pass=0,fail=0;const failures=[];
for(const exam_id of OLDER){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  [2,3].forEach(n=>{
    const q=d.questions.find(q=>q.number===n);
    if(q.type==='identify')pass++;else{fail++;failures.push(exam_id+' Q'+n+' type='+q.type+' (expected identify)');}
  });
}
for(const exam_id of NEWER){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  [2,3].forEach(n=>{
    const q=d.questions.find(q=>q.number===n);
    if(q.type==='absolute-value')pass++;else{fail++;failures.push(exam_id+' Q'+n+' type='+q.type+' (expected absolute-value)');}
  });
}
console.log('gp-2240-q2-q3-type-snapshot: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Q2/Q3 type snapshot: OLDER=identify, NEWER=absolute-value');
