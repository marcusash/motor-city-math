// gp-2265: RP11 per-question input counts snapshot
const d=require('../data/retake-practice-11.json');
const EXP={1:3,2:5,3:3,4:1,5:3,6:2,7:1,8:1,9:1,10:2,11:1,12:7,13:5,14:5,15:2};
let pass=0,fail=0;
d.questions.forEach(q=>{const got=(q.inputs||[]).length;if(got===EXP[q.number])pass++;else{fail++;console.log('  FAIL Q'+q.number+': expected '+EXP[q.number]+' got '+got);}});
console.log('gp-2265-rp11-per-q-inputs:',pass+' pass, '+fail+' fail');
if(fail>0)process.exit(1);
console.log('OK -- RP11 per-question input counts snapshot locked');
