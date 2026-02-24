// gp-2328: Question numbers are sequential 1-15 (no gaps, no duplicates)
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  const nums=d.questions.map(q=>q.number).sort((a,b)=>a-b);
  const expected=Array.from({length:15},(_,i)=>i+1);
  const ok=JSON.stringify(nums)===JSON.stringify(expected);
  if(ok)pass++;else{fail++;failures.push(d.exam_id+' nums='+JSON.stringify(nums));}
}
console.log('gp-2328-question-numbers-sequential:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Question numbers are sequential 1-15 in all exams');
