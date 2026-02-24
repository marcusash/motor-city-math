// gp-2321: All exam titles are unique
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
const seen={};let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(seen[d.title]){fail++;failures.push(d.exam_id+' title dup of '+seen[d.title]+': '+d.title);}
  else{seen[d.title]=d.exam_id;pass++;}
}
console.log('gp-2321-exam-title-unique:',pass+' pass,',fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All exam titles are unique');
