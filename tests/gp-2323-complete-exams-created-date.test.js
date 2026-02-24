// gp-2323: All exams have valid created date (YYYY-MM-DD format)
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
const DATE_RE=/^\d{4}-\d{2}-\d{2}$/;
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(typeof d.created==='string'&&DATE_RE.test(d.created))pass++;
  else{fail++;failures.push(d.exam_id+' created='+JSON.stringify(d.created));}
}
console.log('gp-2323-created-date:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All exams have valid YYYY-MM-DD created date');
