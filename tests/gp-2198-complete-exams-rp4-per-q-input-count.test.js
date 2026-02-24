// gp-2198: RP4 per-question input counts snapshot
const fs=require('fs'),path=require('path');
const d=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/retake-practice-4.json'),'utf8'));
const EXP={1:3,2:2,3:7,4:1,5:2,6:1,7:1,8:1,9:1,10:1,11:1,12:2,13:2,14:1,15:2};
let pass=0,fail=0;const failures=[];
d.questions.forEach(q=>{const got=(q.inputs||[]).length;if(got===EXP[q.number])pass++;else{fail++;failures.push('Q'+q.number+': expected '+EXP[q.number]+' got '+got);}});
console.log('gp-2198-rp4-per-q-inputs: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- RP4 per-question input counts snapshot locked');
