// gp-2324: All exams created in 2026 or later
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  const year=parseInt((d.created||'').substring(0,4));
  if(year>=2026)pass++;else{fail++;failures.push(d.exam_id+' created='+d.created);}
}
console.log('gp-2324-created-year-2026:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All exams created in 2026 or later');
