// gp-2311: RP9 per-question solution_steps count snapshot
const d=require('../data/retake-practice-9.json');
const EXP={1:5,2:3,3:4,4:3,5:5,6:3,7:4,8:3,9:3,10:4,11:3,12:5,13:4,14:4,15:4};
let pass=0,fail=0;
d.questions.forEach(q=>{const got=(q.solution_steps||[]).length;if(got===EXP[q.number])pass++;else{fail++;console.log('  FAIL Q'+q.number+': expected '+EXP[q.number]+' got '+got);}});
console.log('gp-2311-rp9-per-q-steps:',pass+' pass,',fail+' fail');
if(fail>0)process.exit(1);
console.log('OK -- RP9 per-question step counts snapshot locked');
