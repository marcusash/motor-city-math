// gp-2195: RP11 per-question step counts snapshot
const fs=require('fs'),path=require('path');
const d=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/retake-practice-11.json'),'utf8'));
const EXP={1:5,2:4,3:4,4:3,5:4,6:4,7:3,8:4,9:6,10:4,11:4,12:5,13:5,14:5,15:5};
let pass=0,fail=0;const failures=[];
d.questions.forEach(q=>{const got=(q.solution_steps||[]).length;if(got===EXP[q.number])pass++;else{fail++;failures.push('Q'+q.number+': expected '+EXP[q.number]+' got '+got);}});
console.log('gp-2195-rp11-per-q-steps: '+pass+' pass, '+fail+' fail');
if(fail>0){failures.forEach(f=>console.log('  FAIL:',f));process.exit(1);}
console.log('OK -- RP11 per-question step counts snapshot locked');
