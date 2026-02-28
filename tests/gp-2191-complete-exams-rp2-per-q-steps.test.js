// gp-2191: RP2 per-question step counts snapshot
const fs=require('fs'),path=require('path');
const d=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/retake-practice-2.json'),'utf8'));
const EXP={1:4,2:3,3:4,4:4,5:4,6:4,7:5,8:4,9:4,10:6,11:4,12:8,13:8,14:5,15:5};
let pass=0,fail=0;const failures=[];
d.questions.forEach(q=>{const got=(q.solution_steps||[]).length;if(got===EXP[q.number])pass++;else{fail++;failures.push('Q'+q.number+': expected '+EXP[q.number]+' got '+got);}});
console.log('gp-2191-rp2-per-q-steps: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- RP2 per-question step counts snapshot locked');
