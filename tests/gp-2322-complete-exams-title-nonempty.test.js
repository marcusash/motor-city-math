// gp-2322: All exam titles are non-empty and at least 10 chars
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(typeof d.title==='string'&&d.title.trim().length>=10)pass++;
  else{fail++;failures.push(d.exam_id+' title='+JSON.stringify(d.title));}
}
console.log('gp-2322-exam-title-nonempty:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All exam titles are non-empty (10+ chars)');
