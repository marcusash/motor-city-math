// gp-2210: Top-level version field snapshot -- all 12 complete exams have version=2.0
// Note: version is a top-level exam field, NOT a per-question field.

const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  if(d.version==='2.0')pass++;
  else{fail++;failures.push(d.exam_id+': expected 2.0 got '+d.version);}
}
console.log('gp-2210-top-level-version-snapshot: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All 12 complete exams have version=2.0');
