// gp-2275: Q15 (word-problem) input count snapshot
// RP1/RP2 have 1 input, all others have 2
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const EXPECTED={
  'retake-practice-1':1,'retake-practice-2':1,'retake-practice-3':2,
  'retake-practice-4':2,'retake-practice-5':2,'retake-practice-6':2,
  'retake-practice-7':2,'retake-practice-8':2,'retake-practice-9':2,
  'retake-practice-10':2,'retake-practice-11':2,'retake-practice-12':2
};
let pass=0,fail=0;const failures=[];
for(const[exam_id,exp] of Object.entries(EXPECTED)){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  const q15=d.questions.find(q=>q.number===15);
  const got=(q15.inputs||[]).length;
  if(got===exp)pass++;else{fail++;failures.push(exam_id+' Q15 inputs='+got+' expected '+exp);}
}
console.log('gp-2275-q15-input-count-snapshot:',pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Q15 input counts snapshot locked (RP1/RP2=1, others=2)');
