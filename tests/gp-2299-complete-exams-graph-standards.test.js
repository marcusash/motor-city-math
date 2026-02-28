// gp-2299: Q12 standard=W2.c and Q13 standard=W2.e across all complete exams
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  const q12=d.questions.find(q=>q.number===12);
  const q13=d.questions.find(q=>q.number===13);
  if(q12.standard==='W2.c')pass++;else{fail++;failures.push(d.exam_id+' Q12 std='+q12.standard);}
  if(q13.standard==='W2.e')pass++;else{fail++;failures.push(d.exam_id+' Q13 std='+q13.standard);}
}
console.log('gp-2299-q12-q13-standards:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Q12=W2.c and Q13=W2.e across all exams');
