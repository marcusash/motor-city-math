// gp-2247: RP4 Q12 and Q13 key_points snapshot
const d=require('../data/retake-practice-4.json');
const EXPECTED={12:[[0,0],[1,-6],[2,-8],[3,-6],[4,0]], 13:[[2,4],[3,5],[5,1],[6,2],[8,2.5]]};
let pass=0,fail=0;
for(const[qnum,exp] of Object.entries(EXPECTED)){
  const got=d.questions.find(q=>q.number===parseInt(qnum)).graph.key_points;
  if(JSON.stringify(got)===JSON.stringify(exp))pass++;
  else{fail++;console.log('  FAIL Q'+qnum+': expected',JSON.stringify(exp),'got',JSON.stringify(got));}
}
console.log('gp-2247-rp4-q12-q13-kp-snapshot:',pass+' pass, '+fail+' fail');
if(fail>0){process.exit(1);}
console.log('OK -- RP4 Q12/Q13 key_points snapshot locked');
