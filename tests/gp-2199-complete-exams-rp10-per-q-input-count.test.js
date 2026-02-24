// gp-2199: RP10 per-question input counts snapshot
const fs=require('fs'),path=require('path');
const d=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/retake-practice-10.json'),'utf8'));
const EXP={1:3,2:5,3:3,4:1,5:3,6:2,7:1,8:1,9:1,10:2,11:1,12:7,13:5,14:3,15:2};
let pass=0,fail=0;const failures=[];
d.questions.forEach(q=>{const got=(q.inputs||[]).length;if(got===EXP[q.number])pass++;else{fail++;failures.push('Q'+q.number+': expected '+EXP[q.number]+' got '+got);}});
console.log('gp-2199-rp10-per-q-inputs: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- RP10 per-question input counts snapshot locked');
