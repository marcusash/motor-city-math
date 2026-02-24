// gp-2211: Graph Q12 function string snapshot lock for all 12 complete exams
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const EXPECTED={
  'retake-practice-1':'Math.pow(x - 1, 2) - 4',
  'retake-practice-2':'2 * Math.pow(x - 3, 2) - 6',
  'retake-practice-3':'Math.pow(x + 3, 2) - 1',
  'retake-practice-4':'2 * Math.pow(x - 2, 2) - 8',
  'retake-practice-5':'Math.pow(x,2) - 6*x + 5',
  'retake-practice-6':'-2 * Math.pow(x + 1, 2) + 6',
  'retake-practice-7':'3 * Math.pow(x - 2, 2) - 3',
  'retake-practice-8':'-(Math.pow(x-3,2))+4',
  'retake-practice-9':'-2*Math.pow(x+1,2)+8',
  'retake-practice-10':'2*Math.pow(x+4,2)-32',
  'retake-practice-11':'-2*Math.pow(x+6,2)+18',
  'retake-practice-12':'-(Math.pow(x + 2, 2)) + 9'
};
let pass=0,fail=0;const failures=[];
for(const[exam_id,exp] of Object.entries(EXPECTED)){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  const q12=d.questions.find(q=>q.number===12);
  const got=q12&&q12.graph?q12.graph.function:'MISSING';
  if(got===exp)pass++;
  else{fail++;failures.push(exam_id+' Q12: expected '+JSON.stringify(exp)+' got '+JSON.stringify(got));}
}
console.log('gp-2211-q12-function-snapshot: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All Q12 graph function strings snapshot locked');
