// gp-2272: RP1 per-question input counts snapshot
const d=require('../data/retake-practice-1.json');
const EXP={1:3,2:2,3:3,4:1,5:2,6:1,7:1,8:1,9:2,10:1,11:1,12:2,13:2,14:1,15:1};
let pass=0,fail=0;
d.questions.forEach(q=>{const got=(q.inputs||[]).length;if(got===EXP[q.number])pass++;else{fail++;console.log('  FAIL Q'+q.number+': expected '+EXP[q.number]+' got '+got);}});
console.log('gp-2272-rp1-per-q-inputs:',pass+' pass, '+fail+' fail');
if(fail>0)process.exit(1);
console.log('OK -- RP1 per-question input counts snapshot locked');
