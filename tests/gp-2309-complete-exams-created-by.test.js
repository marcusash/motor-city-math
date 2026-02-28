// gp-2309: All exams have valid created_by (known agent IDs only)
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
const VALID=new Set(['Agent R','GR','FR','Agent FR','Agent GA']);
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(VALID.has(d.created_by))pass++;
  else{fail++;failures.push(d.exam_id+' created_by='+JSON.stringify(d.created_by));}
}
console.log('gp-2309-created-by:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All created_by values are known agent IDs');
