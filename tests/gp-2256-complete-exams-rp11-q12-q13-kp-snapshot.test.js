// gp-2256: RP11 Q12 and Q13 key_points snapshot
const d=require('../data/retake-practice-11.json');
const EXP={12:[[-9,0],[-7,16],[-6,18],[-4,10],[-3,0]], 13:[[-7,12],[-6,11.5],[-3,16],[-1,14],[2,13.5]]};
let pass=0,fail=0;
for(const[n,exp] of Object.entries(EXP)){
  const got=d.questions.find(q=>q.number===parseInt(n)).graph.key_points;
  if(JSON.stringify(got)===JSON.stringify(exp))pass++;else{fail++;console.log('  FAIL Q'+n);}
}
console.log('gp-2256-rp11-kp-snapshot:',pass+' pass, '+fail+' fail');
if(fail>0)process.exit(1);
console.log('OK -- RP11 Q12/Q13 key_points snapshot locked');
