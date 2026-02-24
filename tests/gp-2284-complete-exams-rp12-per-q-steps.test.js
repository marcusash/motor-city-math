// gp-2284: RP12 per-question solution_steps count snapshot
const d=require('../data/retake-practice-12.json');
const EXP={1:5,2:4,3:6,4:4,5:4,6:4,7:5,8:4,9:3,10:6,11:6,12:5,13:8,14:4,15:6};
let pass=0,fail=0;
d.questions.forEach(q=>{const got=(q.solution_steps||[]).length;if(got===EXP[q.number])pass++;else{fail++;console.log('  FAIL Q'+q.number+': expected '+EXP[q.number]+' got '+got);}});
console.log('gp-2284-rp12-per-q-steps:',pass+' pass,',fail+' fail');
if(fail>0)process.exit(1);
console.log('OK -- RP12 per-question step counts snapshot locked');
