// gp-2249: exam_id in JSON must match filename (e.g. retake-practice-1.json has exam_id='retake-practice-1')
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
let pass=0,fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  const expected=file.replace('.json','');
  if(d.exam_id===expected)pass++;
  else{fail++;failures.push(file+': expected '+expected+' got '+d.exam_id);}
}
console.log('gp-2249-exam-id-matches-filename: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- All exam_id values match their filenames');
