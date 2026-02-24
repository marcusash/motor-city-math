// gp-2261: RP1 per-question step counts snapshot
const d=require('../data/retake-practice-1.json');
const EXP={1:4,2:3,3:4,4:4,5:4,6:4,7:5,8:4,9:4,10:6,11:4,12:6,13:7,14:5,15:5};
let pass=0,fail=0;
d.questions.forEach(q=>{const got=(q.solution_steps||[]).length;if(got===EXP[q.number])pass++;else{fail++;console.log('  FAIL Q'+q.number+': expected '+EXP[q.number]+' got '+got);}});
console.log('gp-2261-rp1-per-q-steps:',pass+' pass, '+fail+' fail');
if(fail>0)process.exit(1);
console.log('OK -- RP1 per-question step counts snapshot locked');
