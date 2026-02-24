// gp-2298: All exams have non-empty 'purpose' field at top level
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(typeof d.purpose==='string'&&d.purpose.trim().length>0)pass++;
  else{fail++;failures.push(d.exam_id+' purpose='+JSON.stringify(d.purpose));}
}
console.log('gp-2298-purpose-field:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All exams have non-empty purpose field');
