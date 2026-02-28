// gp-2252: RP7 Q12 and Q13 key_points snapshot
const d=require('../data/retake-practice-7.json');
const EXP={12:[[0,9],[1,0],[2,-3],[3,0],[4,9]], 13:[[-4,5],[-3,6],[-1,2],[0,3],[2,3.5]]};
let pass=0,fail=0;
for(const[n,exp] of Object.entries(EXP)){
  const got=d.questions.find(q=>q.number===parseInt(n)).graph.key_points;
  if(JSON.stringify(got)===JSON.stringify(exp))pass++;else{fail++;console.log('  FAIL Q'+n);}
}
console.log('gp-2252-rp7-kp-snapshot:',pass+' pass, '+fail+' fail');
if(fail>0)process.exit(1);
console.log('OK -- RP7 Q12/Q13 key_points snapshot locked');
