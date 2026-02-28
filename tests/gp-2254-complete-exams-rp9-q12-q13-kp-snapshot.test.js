// gp-2254: RP9 Q12 and Q13 key_points snapshot
const d=require('../data/retake-practice-9.json');
const EXP={12:[[-3,0],[-2,6],[-1,8],[0,6],[1,0]], 13:[[0,5.5],[1,5],[3,1],[7,9],[10,8]]};
let pass=0,fail=0;
for(const[n,exp] of Object.entries(EXP)){
  const got=d.questions.find(q=>q.number===parseInt(n)).graph.key_points;
  if(JSON.stringify(got)===JSON.stringify(exp))pass++;else{fail++;console.log('  FAIL Q'+n,'expected',JSON.stringify(exp),'got',JSON.stringify(got));}
}
console.log('gp-2254-rp9-kp-snapshot:',pass+' pass, '+fail+' fail');
if(fail>0)process.exit(1);
console.log('OK -- RP9 Q12/Q13 key_points snapshot locked');
