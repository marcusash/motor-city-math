// gp-2279: All complete exams have exactly 1 word-problem question (Q15)
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  const wpCount=d.questions.filter(q=>q.type==='word-problem').length;
  if(wpCount===1)pass++;else{fail++;failures.push(d.exam_id+' has '+wpCount+' word-problem questions');}
}
console.log('gp-2279-word-problem-count: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All exams have exactly 1 word-problem question');
