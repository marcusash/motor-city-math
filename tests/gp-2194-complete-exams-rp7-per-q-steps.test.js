// gp-2194: RP7 per-question step counts snapshot
const fs=require('fs'),path=require('path');
const d=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/retake-practice-7.json'),'utf8'));
const EXP={1:5,2:5,3:5,4:3,5:6,6:5,7:3,8:3,9:4,10:5,11:3,12:6,13:5,14:5,15:7};
let pass=0,fail=0;const failures=[];
d.questions.forEach(q=>{const got=(q.solution_steps||[]).length;if(got===EXP[q.number])pass++;else{fail++;failures.push('Q'+q.number+': expected '+EXP[q.number]+' got '+got);}});
console.log('gp-2194-rp7-per-q-steps: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- RP7 per-question step counts snapshot locked');
