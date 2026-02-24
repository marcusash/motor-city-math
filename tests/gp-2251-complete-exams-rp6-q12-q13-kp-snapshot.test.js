// gp-2251: RP6 Q12 and Q13 key_points snapshot
const d=require('../data/retake-practice-6.json');
const EXP={12:[[-3,-2],[-2,4],[-1,6],[0,4],[1,-2]], 13:[[1,-4],[2,-6],[4,2],[5,0],[7,-1]]};
let pass=0,fail=0;
for(const[n,exp] of Object.entries(EXP)){
  const got=d.questions.find(q=>q.number===parseInt(n)).graph.key_points;
  if(JSON.stringify(got)===JSON.stringify(exp))pass++;else{fail++;console.log('  FAIL Q'+n);}
}
console.log('gp-2251-rp6-kp-snapshot:',pass+' pass, '+fail+' fail');
if(fail>0)process.exit(1);
console.log('OK -- RP6 Q12/Q13 key_points snapshot locked');
