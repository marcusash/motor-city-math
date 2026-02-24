// gp-2205: schema_version snapshot -- RP11 = 2.0, all others = 1.0
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const EXPECTED={'retake-practice-1':'1.0','retake-practice-2':'1.0','retake-practice-3':'1.0',
  'retake-practice-4':'1.0','retake-practice-5':'1.0','retake-practice-6':'1.0',
  'retake-practice-7':'1.0','retake-practice-8':'1.0','retake-practice-9':'1.0',
  'retake-practice-10':'1.0','retake-practice-11':'2.0','retake-practice-12':'1.0'};
let pass=0,fail=0;const failures=[];
for(const[exam_id,exp] of Object.entries(EXPECTED)){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,exam_id+'.json'),'utf8'));
  if(d.schema_version===exp)pass++;
  else{fail++;failures.push(exam_id+': expected '+exp+' got '+d.schema_version);}
}
console.log('gp-2205-schema-version-snapshot: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- schema_version snapshot locked (RP11=2.0, others=1.0)');
