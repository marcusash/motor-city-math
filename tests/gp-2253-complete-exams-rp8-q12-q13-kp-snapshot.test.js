// gp-2253: RP8 Q12 and Q13 key_points snapshot
const d=require('../data/retake-practice-8.json');
const EXP={12:[[1,0],[2,3],[3,4],[4,3],[5,0]], 13:[[-5,-3],[-4,-5],[-2,3],[0,0.3333333333333333],[3,-0.3333333333333333]]};
let pass=0,fail=0;
for(const[n,exp] of Object.entries(EXP)){
  const got=d.questions.find(q=>q.number===parseInt(n)).graph.key_points;
  if(JSON.stringify(got)===JSON.stringify(exp))pass++;else{fail++;console.log('  FAIL Q'+n);}
}
console.log('gp-2253-rp8-kp-snapshot:',pass+' pass, '+fail+' fail');
if(fail>0)process.exit(1);
console.log('OK -- RP8 Q12/Q13 key_points snapshot locked');
