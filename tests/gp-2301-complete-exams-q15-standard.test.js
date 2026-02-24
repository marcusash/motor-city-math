// gp-2301: Q15 standard=W3.a across all complete exams
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  const q15=d.questions.find(q=>q.number===15);
  if(q15.standard==='W3.a')pass++;else{fail++;failures.push(d.exam_id+' Q15 std='+q15.standard);}
}
console.log('gp-2301-q15-standard: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Q15 standard=W3.a across all exams');
