// gp-2303: Total hints across all exams = 188 (global snapshot)
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let total=0;
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  d.questions.forEach(q=>{ if(q.hint) total++; });
}
console.log('gp-2303-total-hints: total='+total);
if(total!==188){console.log('  FAIL: expected 188, got '+total);process.exit(1);}
console.log('OK -- Total hints = 188 (global snapshot locked)');
