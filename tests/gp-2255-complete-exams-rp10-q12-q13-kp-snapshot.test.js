// gp-2255: RP10 Q12 and Q13 key_points snapshot
const d=require('../data/retake-practice-10.json');
const EXP={12:[[-8,0],[-6,-24],[-4,-32],[-2,-24],[0,0]], 13:[[3,-4],[4,-5],[6,-1],[7,-2],[10,-2.6]]};
let pass=0,fail=0;
for(const[n,exp] of Object.entries(EXP)){
  const got=d.questions.find(q=>q.number===parseInt(n)).graph.key_points;
  if(JSON.stringify(got)===JSON.stringify(exp))pass++;else{fail++;console.log('  FAIL Q'+n);}
}
console.log('gp-2255-rp10-kp-snapshot:',pass+' pass, '+fail+' fail');
if(fail>0)process.exit(1);
console.log('OK -- RP10 Q12/Q13 key_points snapshot locked');
