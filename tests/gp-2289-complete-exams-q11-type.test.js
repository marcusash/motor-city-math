// gp-2289: Q11 type=fractional-exp across all complete exams
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  const q11=d.questions.find(q=>q.number===11);
  if(q11.type==='fractional-exp')pass++;
  else{fail++;failures.push(d.exam_id+' Q11 type='+q11.type);}
}
console.log('gp-2289-q11-fractional-exp: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All Q11 are fractional-exp across all exams');
