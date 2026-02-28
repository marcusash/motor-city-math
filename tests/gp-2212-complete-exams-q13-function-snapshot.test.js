// gp-2212: Graph Q13 function string snapshot lock for all 12 complete exams
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const EXPECTED={
  'retake-practice-1':'2 / (x + 1) + 3',
  'retake-practice-2':'-3 / (x - 2) + 1',
  'retake-practice-3':'4 / (x + 3) - 2',
  'retake-practice-4':'-2 / (x - 4) + 3',
  'retake-practice-5':'5 / (2 - x) - 3',
  'retake-practice-6':'4 / (x - 3) - 2',
  'retake-practice-7':'-2 / (x + 2) + 4',
  'retake-practice-8':'4/(x+3)-1',
  'retake-practice-9':'6/(x-4)+7',
  'retake-practice-10':'2/(x-5)-3',
  'retake-practice-11':'3/(x+4)+13',
  'retake-practice-12':'4 / (x - 3) - 2'
};
let pass=0,fail=0;const failures=[];
for(const[exam_id,exp] of Object.entries(EXPECTED)){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  const q13=d.questions.find(q=>q.number===13);
  const got=q13&&q13.graph?q13.graph.function:'MISSING';
  if(got===exp)pass++;
  else{fail++;failures.push(exam_id+' Q13: expected '+JSON.stringify(exp)+' got '+JSON.stringify(got));}
}
console.log('gp-2212-q13-function-snapshot: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All Q13 graph function strings snapshot locked');
