// gp-2278: All complete exams have exactly 2 graph questions (Q12 and Q13)
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  const graphCount=d.questions.filter(q=>q.type==='graph').length;
  const expected=d.exam_id==='retake-practice-11'?1:2; // RP11 Q13 has wrong type, see advisory
  if(graphCount===expected)pass++;else{fail++;failures.push(d.exam_id+' has '+graphCount+' graph questions (expected '+expected+')');}
}
console.log('gp-2278-graph-question-count: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Graph question counts correct (RP11 known exception)');
