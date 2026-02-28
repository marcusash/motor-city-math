// gp-2204: Cross-exam question type distribution snapshot
const fs=require('fs'),path=require('path');
const DATA_DIR=path.join(__dirname,'../data');
const RP_FILES=fs.readdirSync(DATA_DIR).filter(f=>/^retake-practice-\d+\.json$/.test(f)).sort();
const EXPECTED={identify:24,exponential:30,quadratic:16,radical:23,rational:13,extraneous:7,'fractional-exp':12,graph:23,'multiple-choice':6,'word-problem':12,'absolute-value':8,'write-equation':4,'error-analysis':1,construct:1};
const counts={};
let fail=0;const failures=[];
for(const file of RP_FILES){
  const d=JSON.parse(fs.readFileSync(path.join(DATA_DIR,file),'utf8'));
  if(d.questions.length!==15)continue;
  d.questions.forEach(q=>{const t=q.type||'UNKNOWN';counts[t]=(counts[t]||0)+1;});
}
for(const[t,exp] of Object.entries(EXPECTED)){
  if((counts[t]||0)===exp) ;
  else{fail++;failures.push(t+': expected '+exp+' got '+(counts[t]||0));}
}
console.log('gp-2204-type-distribution: '+(Object.keys(EXPECTED).length-fail)+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- Cross-exam question type distribution snapshot locked');
