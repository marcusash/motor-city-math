// gp-2281: RP8 per-question solution_steps count snapshot
const d=require('../data/retake-practice-8.json');
const EXP={1:3,2:3,3:6,4:4,5:4,6:4,7:4,8:3,9:3,10:4,11:3,12:6,13:5,14:4,15:5};
let pass=0,fail=0;
d.questions.forEach(q=>{const got=(q.solution_steps||[]).length;if(got===EXP[q.number])pass++;else{fail++;console.log('  FAIL Q'+q.number+': expected '+EXP[q.number]+' got '+got);}});
console.log('gp-2281-rp8-per-q-steps:',pass+' pass,',fail+' fail');
if(fail>0)process.exit(1);
console.log('OK -- RP8 per-question step counts snapshot locked');
