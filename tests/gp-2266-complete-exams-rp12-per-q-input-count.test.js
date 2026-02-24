// gp-2266: RP12 per-question input counts snapshot
const d=require('../data/retake-practice-12.json');
const EXP={1:3,2:2,3:7,4:1,5:2,6:1,7:1,8:1,9:1,10:1,11:1,12:3,13:2,14:1,15:2};
let pass=0,fail=0;
d.questions.forEach(q=>{const got=(q.inputs||[]).length;if(got===EXP[q.number])pass++;else{fail++;console.log('  FAIL Q'+q.number+': expected '+EXP[q.number]+' got '+got);}});
console.log('gp-2266-rp12-per-q-inputs:',pass+' pass, '+fail+' fail');
if(fail>0)process.exit(1);
console.log('OK -- RP12 per-question input counts snapshot locked');
