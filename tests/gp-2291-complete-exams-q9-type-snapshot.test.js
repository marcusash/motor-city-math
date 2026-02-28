// gp-2291: Q9 type snapshot across all complete exams
// RP1-5,RP7-12 = radical; RP6 = rational
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const EXPECTED={
  'retake-practice-1':'radical','retake-practice-2':'radical','retake-practice-3':'radical',
  'retake-practice-4':'radical','retake-practice-5':'radical','retake-practice-6':'rational',
  'retake-practice-7':'radical','retake-practice-8':'radical','retake-practice-9':'radical',
  'retake-practice-10':'radical','retake-practice-11':'radical','retake-practice-12':'radical'
};
let pass=0,fail=0;const failures=[];
for(const[exam_id,exp] of Object.entries(EXPECTED)){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  const q9=d.questions.find(q=>q.number===9);
  if(q9.type===exp)pass++;else{fail++;failures.push(exam_id+' Q9 type='+q9.type+' expected '+exp);}
}
console.log('gp-2291-q9-type-snapshot:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Q9 type snapshot locked (RP1-5,RP7-12=radical, RP6=rational)');
