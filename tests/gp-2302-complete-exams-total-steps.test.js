// gp-2302: Total solution steps across all exams = 861 (global snapshot lock)
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let total=0;
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  d.questions.forEach(q=>total+=(q.solution_steps||[]).length);
}
console.log('gp-2302-total-steps: total='+total);
if(total!==861){console.log('  FAIL: expected 861, got '+total);process.exit(1);}
console.log('OK -- Total solution steps = 861 (global snapshot locked)');
